import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { NextRequest } from "next/server";

function reqWith(key: string | null): NextRequest {
  return {
    headers: { get: (name: string) => (name === "x-admin-key" ? key : null) },
  } as unknown as NextRequest;
}

describe("auth", () => {
  const original = process.env.ADMIN_KEY;

  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    if (original === undefined) delete process.env.ADMIN_KEY;
    else process.env.ADMIN_KEY = original;
  });

  it("uses default key when env unset", async () => {
    delete process.env.ADMIN_KEY;
    const { ADMIN_KEY, isAuthorized } = await import("@/lib/auth");
    expect(ADMIN_KEY).toBe("weflow2026");
    expect(isAuthorized(reqWith("weflow2026"))).toBe(true);
    expect(isAuthorized(reqWith("wrong"))).toBe(false);
    expect(isAuthorized(reqWith(null))).toBe(false);
  });

  it("uses ADMIN_KEY env when set", async () => {
    process.env.ADMIN_KEY = "secret123";
    const { ADMIN_KEY, isAuthorized } = await import("@/lib/auth");
    expect(ADMIN_KEY).toBe("secret123");
    expect(isAuthorized(reqWith("secret123"))).toBe(true);
  });
});
