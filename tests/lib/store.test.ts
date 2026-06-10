import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { NewSubmission } from "@/lib/types";

// 공유 인메모리 상태 (mock 팩토리와 테스트가 함께 접근)
const mem = vi.hoisted(() => ({
  // file 백엔드
  file: { content: null as string | null, threwOnRead: false },
  // redis 백엔드
  hashes: new Map<string, Record<string, unknown>>(),
  zset: [] as { score: number; member: string }[],
}));

vi.mock("fs", () => {
  const promises = {
    readFile: vi.fn(async () => {
      if (mem.file.content === null) throw new Error("ENOENT");
      return mem.file.content;
    }),
    writeFile: vi.fn(async (_path: string, data: string) => {
      mem.file.content = data;
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
  }
  return { Redis: FakeRedis };
});

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
  mem.hashes.clear();
  mem.zset = [];
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
