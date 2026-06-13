import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CaseCard from "@/components/CaseCard";
import type { CaseItem } from "@/lib/cases";

// 성공사례 — 왼쪽 안내 박스 + 오른쪽 카드 그리드 (메뉴얼 page 2)
// 노출 데이터는 상위(서버 컴포넌트)에서 저장소를 읽어 props로 전달한다.
export default function SuccessShowcase({ cases }: { cases: CaseItem[] }) {
  const featured = cases.slice(0, 6);
  return (
    <section className="bg-slate-50 py-20">
      <div className="container-w">
        {/* 섹션 헤더 + 더보기(우측 상단) → 문의창 */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="chip">SUCCESS CASE</span>
            <h2 className="section-title mt-3">성공사례</h2>
          </div>
          <Link
            href="/diagnosis"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            더보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* 왼쪽 안내 박스 */}
          <div className="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-brand lg:col-span-4">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              aria-hidden
            />
            <span className="text-sm font-semibold text-brand-100">
              SUCCESS CASE
            </span>
            <h3 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">
              다양한 업종의
              <br />
              성공 사례를
              <br />
              확인하세요.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-brand-100">
              어디서도 볼 수 없는 업종별 전환 최적화 사례를 직접 확인하세요.
            </p>
            <Link
              href="/diagnosis"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
            >
              살펴보기 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 오른쪽 카드 그리드 */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-8 lg:grid-cols-3">
            {featured.map((item) => (
              <CaseCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
