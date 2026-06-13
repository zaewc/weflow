import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { NewSubmission } from "@/lib/types";
import type { NewCase } from "@/lib/cases";
import { CASES } from "@/lib/cases";

// 공유 인메모리 상태 (mock 팩토리와 테스트가 함께 접근)
const mem = vi.hoisted(() => ({
  // file 백엔드 (접수 / 성공사례 별도 파일)
  file: { content: null as string | null },
  casesFile: { content: null as string | null, writeThrows: false },
  // redis 백엔드
  hashes: new Map<string, Record<string, unknown>>(),
  zset: [] as { score: number; member: string }[],
  kv: new Map<string, unknown>(),
}));

vi.mock("fs", () => {
  const slotFor = (p: string) =>
    p.includes("cases.json") ? mem.casesFile : mem.file;
  const promises = {
    readFile: vi.fn(async (p: string) => {
      const slot = slotFor(p);
      if (slot.content === null) throw new Error("ENOENT");
      return slot.content;
    }),
    writeFile: vi.fn(async (p: string, data: string) => {
      if (p.includes("cases.json") && mem.casesFile.writeThrows) {
        throw new Error("EROFS: read-only file system");
      }
      slotFor(p).content = data;
    }),
    mkdir: vi.fn(async () => undefined),
  };
  return { promises, default: { promises } };
});

vi.mock("@upstash/redis", () => {
  class FakeRedis {
    constructor(_opts: { url: string; token: string }) {}
    async zrange(
      _key: string,
      _start: number,
      _stop: number,
      opts?: { rev?: boolean },
    ) {
      const sorted = [...mem.zset].sort((a, b) => a.score - b.score);
      if (opts?.rev) sorted.reverse();
      return sorted.map((e) => e.member);
    }
    pipeline() {
      const cmds: string[] = [];
      return {
        hgetall: (key: string) => {
          cmds.push(key);
        },
        exec: async () => cmds.map((k) => mem.hashes.get(k) ?? null),
      };
    }
    async hset(key: string, obj: Record<string, unknown>) {
      mem.hashes.set(key, { ...(mem.hashes.get(key) ?? {}), ...obj });
    }
    async zadd(_key: string, entry: { score: number; member: string }) {
      mem.zset.push(entry);
    }
    async hgetall(key: string) {
      return mem.hashes.get(key) ?? null;
    }
    async zrem(_key: string, member: string) {
      const before = mem.zset.length;
      mem.zset = mem.zset.filter((e) => e.member !== member);
      return before - mem.zset.length;
    }
    async del(key: string) {
      mem.hashes.delete(key);
    }
    async get<T>(key: string): Promise<T | null> {
      return mem.kv.has(key) ? (mem.kv.get(key) as T) : null;
    }
    async set(key: string, value: unknown) {
      mem.kv.set(key, value);
    }
  }
  return { Redis: FakeRedis };
});

const caseInput: NewCase = {
  name: "OO 신규샵",
  category: "신규업종",
  summary: "신규 성공사례",
  image: "/cases_new.jpg",
  gradient: "from-brand-500 to-brand-700",
  metrics: [{ label: "문의", value: "+100%" }],
  highlights: ["포인트1"],
};

const input: NewSubmission = {
  kind: "inquiry",
  name: "테스터",
  phone: "010-0000-0000",
  projectType: "랜딩페이지 제작",
  industry: "카페",
  note: "",
  schedule: "",
};

async function freshStore() {
  vi.resetModules();
  return import("@/lib/store");
}

beforeEach(() => {
  mem.file.content = null;
  mem.casesFile.content = null;
  mem.casesFile.writeThrows = false;
  mem.hashes.clear();
  mem.zset = [];
  mem.kv.clear();
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("store (file backend)", () => {
  it("returns empty list when no file exists", async () => {
    const store = await freshStore();
    expect(await store.listSubmissions()).toEqual([]);
  });

  it("returns empty list when file holds a non-array", async () => {
    mem.file.content = JSON.stringify({ not: "array" });
    const store = await freshStore();
    expect(await store.listSubmissions()).toEqual([]);
  });

  it("creates, lists (newest first), updates and deletes", async () => {
    const store = await freshStore();
    const a = await store.createSubmission(input);
    const b = await store.createSubmission({ ...input, name: "두번째" });

    const list = await store.listSubmissions();
    expect(list).toHaveLength(2);
    // 최신이 먼저
    expect(list[0]!.createdAt >= list[1]!.createdAt).toBe(true);

    const updated = await store.updateStatus(a.id, "done");
    expect(updated?.status).toBe("done");
    expect(await store.updateStatus("nope", "done")).toBeNull();

    expect(await store.deleteSubmission(b.id)).toBe(true);
    expect(await store.deleteSubmission("nope")).toBe(false);
    expect(await store.listSubmissions()).toHaveLength(1);
  });
});

describe("store (redis backend)", () => {
  beforeEach(() => {
    process.env.KV_REST_API_URL = "https://example.upstash.io";
    process.env.KV_REST_API_TOKEN = "token";
  });

  it("returns empty list when index empty", async () => {
    const store = await freshStore();
    expect(await store.listSubmissions()).toEqual([]);
  });

  it("creates, lists, updates and deletes via redis", async () => {
    const store = await freshStore();
    const a = await store.createSubmission(input);
    await store.createSubmission({ ...input, name: "두번째" });

    const list = await store.listSubmissions();
    expect(list).toHaveLength(2);

    const updated = await store.updateStatus(a.id, "in_progress");
    expect(updated?.status).toBe("in_progress");
    expect(await store.updateStatus("missing", "done")).toBeNull();

    expect(await store.deleteSubmission(a.id)).toBe(true);
    expect(await store.deleteSubmission("missing")).toBe(false);
    expect(await store.listSubmissions()).toHaveLength(1);
  });

  it("falls back to file backend when only one env var present", async () => {
    delete process.env.KV_REST_API_TOKEN;
    const store = await freshStore();
    await store.createSubmission(input);
    // 파일 백엔드가 사용됐는지 (redis 상태는 비어있음)
    expect(mem.hashes.size).toBe(0);
    expect(await store.listSubmissions()).toHaveLength(1);
  });

  it("uses UPSTASH_* env vars as fallback names", async () => {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    process.env.UPSTASH_REDIS_REST_URL = "https://u.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "utoken";
    const store = await freshStore();
    await store.createSubmission(input);
    expect(mem.hashes.size).toBe(1);
  });
});

describe("cases store (file backend)", () => {
  it("seeds defaults when nothing is stored yet", async () => {
    const store = await freshStore();
    const list = await store.listCases();
    expect(list).toHaveLength(CASES.length);
    expect(list[0]!.slug).toBe(CASES[0]!.slug);
    // 시드가 파일에 기록됨
    expect(mem.casesFile.content).not.toBeNull();
  });

  it("treats a non-array file as unset and seeds", async () => {
    mem.casesFile.content = JSON.stringify({ not: "array" });
    const store = await freshStore();
    expect(await store.listCases()).toHaveLength(CASES.length);
  });

  it("returns defaults even when the seed write fails (read-only FS)", async () => {
    mem.casesFile.writeThrows = true;
    const store = await freshStore();
    // 쓰기 실패해도 예외 없이 기본 시드 반환
    expect(await store.listCases()).toHaveLength(CASES.length);
    expect(mem.casesFile.content).toBeNull();
  });

  it("respects a stored empty array (no reseed)", async () => {
    mem.casesFile.content = "[]";
    const store = await freshStore();
    expect(await store.listCases()).toEqual([]);
  });

  it("gets a case by slug and returns null for unknown", async () => {
    const store = await freshStore();
    expect((await store.getCase(CASES[0]!.slug))?.slug).toBe(CASES[0]!.slug);
    expect(await store.getCase("nope")).toBeNull();
  });

  it("creates, updates and deletes", async () => {
    const store = await freshStore();
    const created = await store.createCase(caseInput);
    expect(created.slug).toBeTruthy();
    expect(await store.listCases()).toHaveLength(CASES.length + 1);

    const updated = await store.updateCase(created.slug, {
      ...caseInput,
      name: "수정됨",
    });
    expect(updated?.name).toBe("수정됨");
    expect(updated?.slug).toBe(created.slug);
    expect(await store.updateCase("missing", caseInput)).toBeNull();

    expect(await store.deleteCase(created.slug)).toBe(true);
    expect(await store.deleteCase("missing")).toBe(false);
    expect(await store.listCases()).toHaveLength(CASES.length);
  });
});

describe("cases store (redis backend)", () => {
  beforeEach(() => {
    process.env.KV_REST_API_URL = "https://example.upstash.io";
    process.env.KV_REST_API_TOKEN = "token";
  });

  it("seeds defaults then creates/updates/deletes via redis", async () => {
    const store = await freshStore();
    expect(await store.listCases()).toHaveLength(CASES.length);

    const created = await store.createCase(caseInput);
    expect(await store.listCases()).toHaveLength(CASES.length + 1);
    expect((await store.getCase(created.slug))?.name).toBe(caseInput.name);

    const updated = await store.updateCase(created.slug, {
      ...caseInput,
      name: "레디스수정",
    });
    expect(updated?.name).toBe("레디스수정");

    expect(await store.deleteCase(created.slug)).toBe(true);
    expect(await store.listCases()).toHaveLength(CASES.length);
  });
});
