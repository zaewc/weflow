import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { REVIEWS, type Review } from "@/lib/reviews";

function Card({ review }: { review: Review }) {
  return (
    <div className="mx-2 w-72 shrink-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-2 flex gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mb-3 text-sm leading-relaxed text-slate-700">
        “{review.text}”
      </p>
      <p className="text-xs font-semibold text-slate-500">- {review.author}</p>
    </div>
  );
}

// 가로 2줄 자동 흐름 (메뉴얼 page 4). 두 줄로 분할 후 무한 마퀴.
export default function ReviewMarquee() {
  const half = Math.ceil(REVIEWS.length / 2);
  const rowA = REVIEWS.slice(0, half);
  const rowB = REVIEWS.slice(half);

  return (
    <section className="overflow-hidden bg-slate-50 py-16">
      <div className="container-w mb-8 flex items-end justify-between">
        <div>
          <span className="chip">REVIEW</span>
          <h2 className="section-title mt-3">실제 고객 후기</h2>
        </div>
        <Link
          href="/diagnosis"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          후기 더보기 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max animate-marquee">
          {[...rowA, ...rowA].map((r, i) => (
            <Card key={`a-${i}`} review={r} />
          ))}
        </div>
        <div
          className="flex w-max animate-marquee"
          style={{ animationDirection: "reverse", animationDuration: "48s" }}
        >
          {[...rowB, ...rowB].map((r, i) => (
            <Card key={`b-${i}`} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
