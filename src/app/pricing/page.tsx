import type { Metadata } from "next";
import { Info } from "lucide-react";
import PlanCardView from "@/components/PlanCard";
import {
  PRODUCTION_PLANS,
  CARE_PLANS,
  AD_PLANS,
  PRICING_NOTES,
} from "@/lib/pricing";

export const metadata: Metadata = {
  title: "제작플랜 & 가격안내 | WEFLOW",
  description:
    "랜딩페이지·홈페이지 제작 플랜과 WE/FLOW/WEFLOW 케어 플랜, 네이버·당근 광고 플랜 가격을 안내합니다.",
};

function PlanGroup({
  id,
  eyebrow,
  title,
  desc,
  plans,
}: {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
  plans: typeof PRODUCTION_PLANS;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-12">
      <div className="container-w">
        <div className="mb-8 text-center">
          <span className="chip">{eyebrow}</span>
          <h2 className="section-title mt-3">{title}</h2>
          <p className="mt-2 text-slate-500">{desc}</p>
        </div>
        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCardView key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-16">
        <div className="container-w text-center">
          <span className="chip">PRICE</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            제작플랜 & 가격안내
          </h1>
          <p className="mt-3 text-slate-600">
            필요한 기능만 구성한 합리적인 가격. 지금은 파격 세일가로 진행됩니다.
          </p>
        </div>
      </section>

      <PlanGroup
        id="production"
        eyebrow="제작 플랜"
        title="홈페이지 · 랜딩페이지 제작"
        desc="원하는 플랜을 선택하세요. (3중 택1)"
        plans={PRODUCTION_PLANS}
      />

      <div className="bg-slate-50">
        <PlanGroup
          id="care"
          eyebrow="케어 플랜"
          title="WEFLOW 케어 플랜"
          desc="제작 이후 운영·광고·관리까지. (3중 택1)"
          plans={CARE_PLANS}
        />
      </div>

      <PlanGroup
        id="ad"
        eyebrow="광고 플랜"
        title="키워드 광고 세팅"
        desc="네이버 · 당근 플레이스 광고 세팅을 지원합니다."
        plans={AD_PLANS}
      />

      {/* 안내 사항 */}
      <section className="container-w pb-20">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
            <Info className="h-5 w-5 text-brand-600" /> 안내 사항
          </h3>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
            {PRICING_NOTES.map((note, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand-400">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
