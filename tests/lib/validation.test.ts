import { describe, it, expect } from "vitest";
import { parseSubmission } from "@/lib/validation";

describe("parseSubmission", () => {
  const valid = {
    kind: "reservation",
    name: "홍길동",
    phone: "010-1234-5678",
    projectType: "홈페이지 제작",
    industry: "카페",
    note: "메모",
    schedule: "2026-06-12 14:30",
    agreed: true,
  };

  it("rejects non-object payloads", () => {
    expect(parseSubmission(null).ok).toBe(false);
    expect(parseSubmission("x").ok).toBe(false);
    expect(parseSubmission(123).error).toBe("잘못된 요청입니다.");
  });

  it("requires name", () => {
    const res = parseSubmission({ ...valid, name: "" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("이름");
  });

  it("requires phone", () => {
    const res = parseSubmission({ ...valid, phone: "" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("연락처");
  });

  it("requires agreement", () => {
    const res = parseSubmission({ ...valid, agreed: false });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("동의");
  });

  it("coerces non-string fields to empty and defaults kind to inquiry", () => {
    const res = parseSubmission({
      kind: 999,
      name: "김철수",
      phone: "010",
      projectType: undefined,
      agreed: true,
    });
    expect(res.ok).toBe(true);
    expect(res.data?.kind).toBe("inquiry");
    expect(res.data?.projectType).toBe("");
    expect(res.data?.industry).toBe("");
  });

  it("accepts a fully valid reservation payload", () => {
    const res = parseSubmission(valid);
    expect(res.ok).toBe(true);
    expect(res.data).toMatchObject({
      kind: "reservation",
      name: "홍길동",
      schedule: "2026-06-12 14:30",
    });
  });
});
