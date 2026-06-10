// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { NextRequest } from "next/server";
import type { Submission } from "@/lib/types";

vi.mock("@/lib/auth", () => ({ isAuthorized: vi.fn() }));
vi.mock("@/lib/store", () => ({
  updateStatus: vi.fn(),
  deleteSubmission: vi.fn(),
}));

import { PATCH, DELETE } from "@/app/api/submissions/[id]/route";
import { isAuthorized } from "@/lib/auth";
import { updateStatus, deleteSubmission } from "@/lib/store";

const ctx = (id: string) => ({ params: { id } });

const updated: Submission = {
  id: "1",
  kind: "reservation",
  status: "done",
  name: "n",
  phone: "p",
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

beforeEach(() => vi.clearAllMocks());

describe("PATCH /api/submissions/[id]", () => {
  it("401 when unauthorized", async () => {
    vi.mocked(isAuthorized).mockReturnValue(false);
    const res = await PATCH(jsonReq({}), ctx("1"));
    expect(res.status).toBe(401);
  });

  it("400 on invalid JSON", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    const res = await PATCH(jsonReq(null, true), ctx("1"));
    expect(res.status).toBe(400);
  });

  it("400 on invalid status value", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    const res = await PATCH(jsonReq({ status: "weird" }), ctx("1"));
    expect(res.status).toBe(400);
    const res2 = await PATCH(jsonReq({ status: 123 }), ctx("1"));
    expect(res2.status).toBe(400);
  });

  it("404 when not found", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    vi.mocked(updateStatus).mockResolvedValue(null);
    const res = await PATCH(jsonReq({ status: "done" }), ctx("x"));
    expect(res.status).toBe(404);
  });

  it("200 on success", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    vi.mocked(updateStatus).mockResolvedValue(updated);
    const res = await PATCH(jsonReq({ status: "done" }), ctx("1"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ item: updated });
  });
});

describe("DELETE /api/submissions/[id]", () => {
  it("401 when unauthorized", async () => {
    vi.mocked(isAuthorized).mockReturnValue(false);
    const res = await DELETE({} as NextRequest, ctx("1"));
    expect(res.status).toBe(401);
  });

  it("404 when not found", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    vi.mocked(deleteSubmission).mockResolvedValue(false);
    const res = await DELETE({} as NextRequest, ctx("x"));
    expect(res.status).toBe(404);
  });

  it("200 on success", async () => {
    vi.mocked(isAuthorized).mockReturnValue(true);
    vi.mocked(deleteSubmission).mockResolvedValue(true);
    const res = await DELETE({} as NextRequest, ctx("1"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
