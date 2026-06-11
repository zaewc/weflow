import type { Metadata } from "next";
import SubmissionForm from "@/components/SubmissionForm";
import { DIAGNOSIS_CHECKS } from "@/lib/diagnosis";

export const metadata: Metadata = {
  title: "무료진단 받기 | WEFLOW",
  description:
    "지금 바로 무료 진단받고 사이트의 숨겨진 잠재력을 발견하세요. 문의 구조 진단 · 디자인 점검 · 검색 노출 분석 · 문의 개선 제안.",
};

export default function DiagnosisPage() {
  return (
    <section className="bg-gradient-to-b from-brand-50 to-white py-12 sm:py-16">
      <div className="container-w grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* 좌측 안내 */}
        <div>
          <span className="chip">FREE DIAGNOSIS</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            무료진단 받기
          </h1>
          <p className="mt-3 text-slate-600">
            지금 바로 무료 진단받고, 사이트의 숨겨진 잠재력을 발견하세요.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {DIAGNOSIS_CHECKS.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-brand-100 bg-white px-4 py-4"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  ✓ {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            제작부터 광고 연동·운영 관리까지, 단순 제작이 아닌 문의 구조까지
            설계합니다. 접수해주시면 담당자가 빠르게 연락드립니다.
          </div>
        </div>

        {/* 우측 폼 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <h2 className="mb-1 text-xl font-bold text-slate-900">
            무료진단 후 견적받기
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            아래 정보를 남겨주시면 무료로 진단해 드립니다.
          </p>
          <SubmissionForm kind="inquiry" submitLabel="무료진단 후 견적받기" />
        </div>
      </div>
    </section>
  );
}
