// 공통 도메인 타입

export type SubmissionKind = "reservation" | "inquiry";

export type SubmissionStatus = "pending" | "in_progress" | "done";

export interface Submission {
  id: string;
  kind: SubmissionKind;
  status: SubmissionStatus;
  name: string;
  phone: string;
  projectType: string;
  industry: string;
  note: string;
  /** 예약에만 사용 — 희망 일정 (예: "2026-06-12 14:30") */
  schedule: string;
  /** 접수일 ISO 문자열 */
  createdAt: string;
}

export type NewSubmission = Omit<
  Submission,
  "id" | "status" | "createdAt"
>;

export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: "대기",
  in_progress: "진행중",
  done: "완료",
};
