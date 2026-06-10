// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { NextRequest } from "next/server";
import type { Submission } from "@/lib/types";

vi.mock("@/lib/auth", () => ({ isAuthorized: vi.fn() }));
vi.mock("@/lib/store", () => ({
  listSubmissions: vi.fn(),
  createSubmission: vi.fn(),
}));

import { GET, POST } from "@/app/api/submissions/route";
import { isAuthorized } from "@/lib/auth";
import { listSubmissions, createSubmission } from "@/lib/store";

const sample: Submission = {
  id: "1",
  kind: "inquiry",
  status: "pending",
  name: "홍길동",
  phone: "010",
  projectType: "",
  industry: "",
  note: "",
  schedule: "",
  createdAt: "2026-06-10T00:00:00.000Z",
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

describe("GET /api/submissions", () => {
  it("401 when unauthorized", async () => {
    vi.mocked(isAuthorized).mockReturnValue(false);
    const res = await GET({} as NextRequest);
    expect(res.status).toBe(401);
  });

  it("returns items when authorized", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    vi.mocked(listSubmissions).mockResolvedValue([sample]);
    const res = await GET({} as NextRequest);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ items: [sample] });
  });
});

describe("POST /api/submissions", () => {
  it("400 on invalid JSON", async () => {
    const res = await POST(jsonReq(null, true));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("형식");
  });

  it("400 on validation failure", async () => {
    const res = await POST(jsonReq({ name: "", phone: "", agreed: false }));
    expect(res.status).toBe(400);
  });

  it("201 on success", async () => {
    vi.mocked(createSubmission).mockResolvedValue(sample);
    const res = await POST(
      jsonReq({ name: "홍길동", phone: "010", agreed: true }),
    );
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ item: sample });
    expect(createSubmission).toHaveBeenCalledOnce();
  });
});
