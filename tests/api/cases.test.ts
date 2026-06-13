// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { NextRequest } from "next/server";
import type { CaseItem } from "@/lib/cases";

vi.mock("@/lib/auth", () => ({ isAuthorized: vi.fn() }));
vi.mock("@/lib/store", () => ({
  listCases: vi.fn(),
  createCase: vi.fn(),
  updateCase: vi.fn(),
  deleteCase: vi.fn(),
}));

import { GET, POST } from "@/app/api/cases/route";
import { PATCH, DELETE } from "@/app/api/cases/[slug]/route";
import { isAuthorized } from "@/lib/auth";
import { listCases, createCase, updateCase, deleteCase } from "@/lib/store";

const sample: CaseItem = {
  slug: "abc",
  name: "OO 카페",
  category: "카페",
  summary: "요약",
  image: "/cases_카페.jpg",
  gradient: "from-brand-500 to-brand-700",
  metrics: [{ label: "문의", value: "+100%" }],
  highlights: ["포인트"],
};

const validBody = {
  name: "OO 카페",
  category: "카페",
  summary: "요약",
  image: "/cases_카페.jpg",
};

function jsonReq(body: unknown, throwOnJson = false): NextRequest {
  return {
    json: throwOnJson
      ? vi.fn().mockRejectedValue(new Error("bad"))
      : vi.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/cases", () => {
  it("returns the case list (public)", async () => {
    vi.mocked(listCases).mockResolvedValue([sample]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ items: [sample] });
  });
});

describe("POST /api/cases", () => {
  it("401 when unauthorized", async () => {
    vi.mocked(isAuthorized).mockReturnValue(false);
    const res = await POST(jsonReq(validBody));
    expect(res.status).toBe(401);
  });

  it("400 on invalid JSON", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    const res = await POST(jsonReq(null, true));
    expect(res.status).toBe(400);
  });

  it("400 when required fields missing", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    const res = await POST(jsonReq({ name: "이름만" }));
    expect(res.status).toBe(400);
  });

  it("201 creates a case", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    vi.mocked(createCase).mockResolvedValue(sample);
    const res = await POST(jsonReq(validBody));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ item: sample });
  });
});

describe("PATCH /api/cases/[slug]", () => {
  const ctx = { params: { slug: "abc" } };

  it("401 when unauthorized", async () => {
    vi.mocked(isAuthorized).mockReturnValue(false);
    const res = await PATCH(jsonReq(validBody), ctx);
    expect(res.status).toBe(401);
  });

  it("400 on invalid JSON", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    const res = await PATCH(jsonReq(null, true), ctx);
    expect(res.status).toBe(400);
  });

  it("400 when required fields missing", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    const res = await PATCH(jsonReq({}), ctx);
    expect(res.status).toBe(400);
  });

  it("404 when case not found", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    vi.mocked(updateCase).mockResolvedValue(null);
    const res = await PATCH(jsonReq(validBody), ctx);
    expect(res.status).toBe(404);
  });

  it("200 updates a case", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    vi.mocked(updateCase).mockResolvedValue(sample);
    const res = await PATCH(jsonReq(validBody), ctx);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ item: sample });
  });
});

describe("DELETE /api/cases/[slug]", () => {
  const ctx = { params: { slug: "abc" } };

  it("401 when unauthorized", async () => {
    vi.mocked(isAuthorized).mockReturnValue(false);
    const res = await DELETE({} as NextRequest, ctx);
    expect(res.status).toBe(401);
  });

  it("404 when not found", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    vi.mocked(deleteCase).mockResolvedValue(false);
    const res = await DELETE({} as NextRequest, ctx);
    expect(res.status).toBe(404);
  });

  it("200 when deleted", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    vi.mocked(deleteCase).mockResolvedValue(true);
    const res = await DELETE({} as NextRequest, ctx);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
