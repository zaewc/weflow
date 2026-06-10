// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { NextRequest } from "next/server";
import type { Submission } from "@/lib/types";

vi.mock("@/lib/auth", () => ({ isAuthorized: vi.fn() }));
vi.mock("@/lib/store", () => ({ listSubmissions: vi.fn() }));

import { GET } from "@/app/api/export/route";
import { isAuthorized } from "@/lib/auth";
import { listSubmissions } from "@/lib/store";

const rows: Submission[] = [
  {
    id: "1",
    kind: "reservation",
    status: "pending",
    name: "예약자",
    phone: "010-1",
    projectType: "홈페이지 제작",
    industry: "카페",
    note: "메모",
    schedule: "2026-06-12 14:30",
    createdAt: "2026-06-10T00:00:00.000Z",
  },
  {
    id: "2",
    kind: "inquiry",
    status: "done",
    name: "문의자",
    phone: "010-2",
    projectType: "",
    industry: "",
    note: "",
    schedule: "",
    createdAt: "2026-06-09T00:00:00.000Z",
  },
];

function req(kind?: string): NextRequest {
  const params = new URLSearchParams(kind ? { kind } : {});
  return { nextUrl: { searchParams: params } } as unknown as NextRequest;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(listSubmissions).mockResolvedValue(rows);
});

describe("GET /api/export", () => {
  it("401 when unauthorized", async () => {
    vi.mocked(isAuthorized).mockReturnValue(false);
    const res = await GET(req("all"));
    expect(res.status).toBe(401);
  });

  it("exports all (two sheets) by default when no kind param", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    const res = await GET(req());
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("spreadsheetml");
    expect(res.headers.get("Content-Disposition")).toContain(".xlsx");
    const buf = await res.arrayBuffer();
    expect(buf.byteLength).toBeGreaterThan(0);
  });

  it("exports reservation only", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    const res = await GET(req("reservation"));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Disposition")).toContain(
      "weflow-reservation",
    );
  });

  it("exports inquiry only", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    const res = await GET(req("inquiry"));
    expect(res.status).toBe(200);
    const buf = await res.arrayBuffer();
    expect(buf.byteLength).toBeGreaterThan(0);
  });
});
