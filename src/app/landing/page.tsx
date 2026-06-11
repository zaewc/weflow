import type { Metadata } from "next";
import Link from "next/link";
import {
  Rocket,
  Wallet,
  Headphones,
  Settings,
  Megaphone,
  Target,
  ArrowRight,
} from "lucide-react";
import SubmissionForm from "@/components/SubmissionForm";
import PlanCardView from "@/components/PlanCard";
import ProcessSection from "@/components/ProcessSection";
import ReviewMarquee from "@/components/ReviewMarquee";
import SectionHeading from "@/components/SectionHeading";
import { PRODUCTION_PLANS, CARE_PLANS, AD_PLANS } from "@/lib/pricing";
import { DIAGNOSIS_CHECKS } from "@/lib/diagnosis";

export const metadata: Metadata = {
  title: "WEFLOW 랜딩 페이지 | 문의로 이어지는 홈페이지",
  description:
    "기획부터 제작, 광고 연동, 운영 관리까지 WEFLOW가 함께합니다. 무료 진단 후 견적받기.",
};

const FEATURES = [
  {
    Icon: Rocket,
    title: "빠른 제작 진행",
    desc: "랜딩페이지 3~4일, 홈페이지 약 1주일. 빠르게 제작하고 빠르게 운영을 시작합니다.",
  },
  {
    Icon: Wallet,
    title: "합리적인 비용",
    desc: "불필요한 비용 없이 필요한 기능만 구성하여 가성비 + 실속 + 퀄리티를 함께 제공합니다.",
  },
  {
    Icon: Headphones,
    title: "24시간 상담 가능",
    desc: "정해진 시간만 기다리지 마세요. 문의가 생길 때 언제든 빠른 상담 및 피드백이 가능합니다.",
  },
  {
    Icon: Settings,
    title: "제작 후 운영 관리",
    desc: "홈페이지 만들고 끝이 아닙니다. 검색 등록, 수정, 유지보수, 운영 관리까지 함께합니다.",
  },
  {
    Icon: Megaphone,
    title: "광고 연동 지원",
    desc: "홈페이지 + 랜딩페이지 + 광고를 한 번에 연결하여 문의가 들어오는 구조를 만듭니다.",
  },
  {
    Icon: Target,
    title: "문의 증가 구조 설계",
    desc: "업종별 고객 흐름 분석, 상담 버튼 위치 최적화, 모바일 문의 동선을 구성합니다.",
  },
];

const ALL_PLANS = [...PRODUCTION_PLANS, ...CARE_PLANS, ...AD_PLANS];

export default function LandingPage() {
  return (
    <>
      {/* 히어로 + 사이드 고정 폼 */}
      <section className="bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="container-w grid gap-10 py-12 lg:grid-cols-5 lg:py-16">
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              문의로 이어지는
              <br />
              홈페이지를 <span className="text-brand-600">만듭니다</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              기획부터 제작, 광고 연동, 운영 관리까지 WEFLOW가 함께합니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/diagnosis" className="btn-primary">
                무료 진단 후 견적받기 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/cases" className="btn-ghost">
                실제 제작 성공 보기
              </Link>
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-900">
                WEFLOW CARE PLAN
              </h2>
              <p className="mt-2 text-slate-600">
                제작부터 운영 · 광고 · 관리까지 한 번에. 사람들은 검색하고
                비교한 뒤 문의합니다. 홈페이지만 필요한 시대는 지났습니다.
              </p>
              <p className="mt-3 font-semibold text-brand-700">
                WEFLOW는 랜딩페이지 + 홈페이지 + 광고 + 사후관리까지 저렴한
                비용과 높은 퀄리티로 한 번에 해결합니다.
              </p>
            </div>
          </div>

          {/* 오른쪽 고정 문의창 (스크롤 시 같이 내려옴) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-20">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <h2 className="mb-1 text-lg font-bold text-slate-900">
                  무료진단 받기
                </h2>
                <p className="mb-4 text-sm text-slate-500">
                  정보를 남겨주시면 빠르게 연락드립니다.
                </p>
                <SubmissionForm
                  kind="inquiry"
                  compact
                  submitLabel="무료진단 후 견적받기"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 강점 */}
      <section className="container-w py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-200 hover:shadow-lg"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 가격 카드 8개 */}
      <section className="bg-slate-50 py-16">
        <div className="container-w">
          <SectionHeading eyebrow="PRICE" title="전체 플랜 한눈에 보기" />
          <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4">
            {ALL_PLANS.map((plan) => (
              <PlanCardView key={`${plan.name}-${plan.newPrice}`} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* 제작 진행 과정 */}
      <ProcessSection />

      {/* 무료진단 안내 */}
      <section className="bg-slate-50 py-16">
        <div className="container-w text-center">
          <h2 className="section-title">
            무료진단에서 이런 걸 확인해드립니다
          </h2>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {DIAGNOSIS_CHECKS.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-5"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  ✓ {label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/diagnosis" className="btn-primary">
              무료진단 후 견적받기 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 후기 */}
      <ReviewMarquee />
    </>
  );
}
