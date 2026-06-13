import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CaseCard from "@/components/CaseCard";
import PageHero from "@/components/PageHero";
import { listCases } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "성공사례 | WEFLOW",
  description:
    "PT샵, 필라테스, 보험설계, 카센터 등 다양한 업종의 전환 최적화 성공 사례를 확인하세요.",
};

// 메뉴얼 page 7 — 우리가 다루는 업종
const INDUSTRIES = [
  "PT샵", "필라테스", "헬스장", "보험 설계", "법률 사무소",
  "자동차 디테일링", "렌터카 업체", "웨딩/스냅 업체", "세무사 사무소",
  "공인중개사", "카페", "미용실", "네일샵", "소상공인 기업형 홈페이지",
  "피부관리샵", "왁싱샵", "반영구샵", "애견미용", "반려동물 용품점",
  "인테리어 업체", "이사 업체", "키즈카페", "스터디카페", "영어학원",
  "수학학원", "입시학원", "개인과외", "청소업체",
];

export default async function CasesPage() {
  const cases = await listCases();
  return (
    <>
      <PageHero
        eyebrow="SUCCESS CASE"
        title="다양한 업종의 성공 사례"
        description="어디서도 볼 수 없는 업종별 전환 최적화 사례를 직접 확인하세요."
      />

      <section className="container-w py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((item) => (
            <CaseCard key={item.slug} item={item} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/diagnosis" className="btn-primary">
            더보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="container-w text-center">
          <h2 className="section-title">이런 업종을 함께했습니다</h2>
          <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-2">
            {INDUSTRIES.map((ind) => (
              <span
                key={ind}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
