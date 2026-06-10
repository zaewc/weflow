"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { PROJECT_TYPES } from "@/lib/site";
import type { SubmissionKind } from "@/lib/types";

interface Props {
  kind: SubmissionKind;
  /** 예약 폼에서 선택된 희망 일정 (있으면 함께 전송) */
  schedule?: string;
  /** 제출 직전 검증 (false 반환 시 중단) */
  beforeSubmit?: () => string | null;
  submitLabel?: string;
  compact?: boolean;
}

const inputBase =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export default function SubmissionForm({
  kind,
  schedule,
  beforeSubmit,
  submitLabel = "무료진단 후 견적받기",
  compact = false,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState<string>("");
  const [industry, setIndustry] = useState("");
  const [note, setNote] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (beforeSubmit) {
      const msg = beforeSubmit();
      if (msg) {
        setError(msg);
        return;
      }
    }
    if (!name.trim()) return setError("이름을 입력해주세요.");
    if (!phone.trim()) return setError("연락처를 입력해주세요.");
    if (!agreed) return setError("개인정보 수집 및 이용 동의가 필요합니다.");

    setStatus("loading");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name,
          phone,
          projectType,
          industry,
          note,
          schedule: schedule ?? "",
          agreed,
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "접수에 실패했습니다.");
      }
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 px-6 py-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-600" />
        <h3 className="text-xl font-bold text-slate-900">
          접수가 완료되었습니다!
        </h3>
        <p className="text-sm text-slate-600">
          담당자가 빠르게 확인 후 연락드리겠습니다. 감사합니다.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "space-y-3" : "space-y-4"}
    >
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          이름 <span className="text-brand-600">*</span>
        </label>
        <input
          className={inputBase}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          autoComplete="name"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          연락처 <span className="text-brand-600">*</span>
        </label>
        <input
          className={inputBase}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-0000-0000"
          inputMode="tel"
          autoComplete="tel"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          제작종류
        </label>
        <select
          className={`${inputBase} appearance-none bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
          }}
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
        >
          <option value="">선택해주세요</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          업종
        </label>
        <input
          className={inputBase}
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="예: PT샵, 필라테스, 카페 등"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          추가요청사항
        </label>
        <textarea
          className={`${inputBase} resize-none`}
          rows={compact ? 2 : 3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="원하시는 내용을 자유롭게 적어주세요."
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
        />
        <span>개인정보 수집 및 상담 이용에 동의합니다.</span>
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full disabled:opacity-60"
      >
        {status === "loading" && (
          <Loader2 className="h-5 w-5 animate-spin" />
        )}
        {submitLabel}
      </button>
    </form>
  );
}
