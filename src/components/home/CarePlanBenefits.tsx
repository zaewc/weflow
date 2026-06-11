import {
  PackageCheck,
  Rocket,
  Wallet,
  Headphones,
  Megaphone,
  Layers,
  ArrowDown,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

// WEFLOW만의 케어 플랜 혜택 — 6칸 + 진행 흐름 (메뉴얼 page 2)
const BENEFITS = [
  { Icon: Layers, title: "WEFLOW 케어플랜", desc: "제작·운영·광고·관리를 하나로" },
  { Icon: PackageCheck, title: "원터치 통합 관리", desc: "제작 + 운영 + 광고 + 관리" },
  { Icon: Rocket, title: "빠른 제작", desc: "3~7일 로켓배송" },
  { Icon: Wallet, title: "합리적인 가성비", desc: "필요한 기능만 구성" },
  { Icon: Headphones, title: "24시간 상담대기", desc: "빠른 상담 및 피드백" },
  { Icon: Megaphone, title: "운영·광고 지원", desc: "사후관리 서비스" },
];

const FLOW = ["고객의뢰", "접수 후 제작", "3~7일 배송완료", "광고 및 운영 사후 관리"];

export default function CarePlanBenefits() {
  return (
    <section className="container-w py-16">
      <SectionHeading eyebrow="CARE PLAN" title="WEFLOW만의 케어 플랜 혜택" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-md"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 진행 흐름 */}
      <div className="mt-10 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center">
        {FLOW.map((step, i) => (
          <div key={step} className="flex flex-col items-center sm:flex-row">
            <div className="rounded-xl bg-brand-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-brand">
              {step}
            </div>
            {i < FLOW.length - 1 && (
              <ArrowDown className="my-1 h-4 w-4 text-brand-300 sm:mx-2 sm:my-0 sm:-rotate-90" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
