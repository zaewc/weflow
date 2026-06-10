import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  PenTool,
  LayoutGrid,
  Code2,
  TrendingUp,
  Megaphone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { DETAIL_STEPS, AD_SYSTEM } from "@/lib/process";

export const metadata: Metadata = {
  title: "서비스 | WEFLOW",
  description:
    "상담·진단부터 기획·디자인·개발·SEO·광고운영까지 WEFLOW의 6단계 제작 프로세스를 안내합니다.",
};

const STEP_ICONS = [Search, PenTool, LayoutGrid, Code2, TrendingUp, Megaphone];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-16">
        <div className="container-w text-center">
          <span className="chip">SERVICE</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            제작 진행 과정
          </h1>
          <p className="mt-3 text-slate-600">
            상담부터 광고 운영·사후관리까지, 문의가 들어오는 구조를 설계합니다.
          </p>
        </div>
      </section>

      {/* 6단계 제작 진행 과정 */}
      <section className="container-w py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DETAIL_STEPS.map((step, i) => {
            const Icon = STEP_ICONS[i] ?? Search;
            return (
              <div
                key={step.no}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-200 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-4xl font-extrabold text-slate-100">
                    {step.no}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 광고 운영 · 사후관리 시스템 */}
      <section id="ad" className="scroll-mt-20 bg-slate-50 py-16">
        <div className="container-w">
          <div className="mb-10 text-center">
            <span className="chip">AD & SEO</span>
            <h2 className="section-title mt-3">광고 운영 · 사후관리 시스템</h2>
            <p className="mt-2 text-slate-500">
              인스타 · 블로그 · 네이버 키워드 등 채널별 광고를 통합 운영·관리합니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {AD_SYSTEM.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-500" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/diagnosis" className="btn-primary">
              무료진단 후 견적받기 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
