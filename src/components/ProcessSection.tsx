import { ArrowDown } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { SIMPLE_STEPS, DETAIL_STEPS } from "@/lib/process";

// 제작 진행 과정(4칸) + 6단계 제작 프로세스(6칸) 양옆 나란히 (메뉴얼 page 2)
export default function ProcessSection() {
  return (
    <section className="container-w py-16">
      <SectionHeading
        eyebrow="PROCESS"
        title="제작 진행 과정"
        description="상담부터 사후관리까지, 체계적인 6단계 프로세스로 진행합니다."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 제작 진행 과정 — 세로 4칸 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-5 text-lg font-bold text-slate-900">
            제작 진행 과정
          </h3>
          <ol className="space-y-3">
            {SIMPLE_STEPS.map((step, i) => (
              <li key={step.title}>
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {step.title}
                  </span>
                </div>
                {i < SIMPLE_STEPS.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-4 w-4 text-slate-300" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* 6단계 제작 프로세스 — 세로 6칸 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-5 text-lg font-bold text-slate-900">
            6단계 제작 프로세스
          </h3>
          <ol className="space-y-2.5">
            {DETAIL_STEPS.map((step) => (
              <li
                key={step.no}
                className="flex items-start gap-3 rounded-xl border border-slate-100 px-4 py-3"
              >
                <span className="text-lg font-extrabold text-brand-500">
                  {step.no}
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{step.title}</p>
                  <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
1