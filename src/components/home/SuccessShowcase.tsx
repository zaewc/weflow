import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CaseCard from "@/components/CaseCard";
import { CASES } from "@/lib/cases";

// 성공사례 — 왼쪽 안내 박스 + 오른쪽 카드 (메뉴얼 page 2)
export default function SuccessShowcase() {
  const featured = CASES.slice(0, 4);

  return (
    <section className="bg-slate-50 py-16">
      <div className="container-w grid gap-8 lg:grid-cols-3">
        {/* 왼쪽 안내 박스 */}
        <div className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-brand">
          <span className="text-sm font-semibold text-brand-100">
            SUCCESS CASE
          </span>
          <h2 className="mt-3 text-2xl font-bold leading-snug">
            다양한 업종의
            <br />
            성공 사례를 확인하세요.
          </h2>
          <p className="mt-3 text-sm text-brand-100">
            어디서도 볼 수 없는 업종별 전환 최적화 사례를 직접 확인하세요.
          </p>
          <Link
            href="/diagnosis"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
          >
            살펴보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 오른쪽 카드 + 더보기 */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex justify-end">
            <Link
              href="/cases"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              더보기 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <CaseCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
