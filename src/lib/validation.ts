import type { NewSubmission, SubmissionKind } from "@/lib/types";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export interface ValidationResult {
  ok: boolean;
  data?: NewSubmission;
  error?: string;
}

/** API로 들어온 임의 payload를 NewSubmission으로 검증 */
export function parseSubmission(payload: unknown): ValidationResult {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "잘못된 요청입니다." };
  }
  const body = payload as Record<string, unknown>;

  const kindRaw = asString(body.kind);
  const kind: SubmissionKind =
    kindRaw === "reservation" ? "reservation" : "inquiry";

  const name = asString(body.name);
  const phone = asString(body.phone);
  const projectType = asString(body.projectType);
  const industry = asString(body.industry);
  const note = asString(body.note);
  const schedule = asString(body.schedule);
  const agreed = body.agreed === true;

  if (!name) return { ok: false, error: "이름을 입력해주세요." };
  if (!phone) return { ok: false, error: "연락처를 입력해주세요." };
  if (!agreed) {
    return { ok: false, error: "개인정보 수집 및 이용 동의가 필요합니다." };
  }

  return {
    ok: true,
    data: { kind, name, phone, projectType, industry, note, schedule },
  };
}
