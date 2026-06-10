import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseItem } from "@/lib/cases";

export default function CaseCard({ item }: { item: CaseItem }) {
  return (
    <Link
      href={`/cases/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
    >
      {/* 윗칸 이미지 (그라데이션 대체) */}
      <div
        className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${item.gradient}`}
      >
        <span className="text-2xl font-extrabold text-white/90">
          {item.category}
        </span>
        <ArrowUpRight className="absolute right-3 top-3 h-5 w-5 text-white/80 transition group-hover:scale-125" />
      </div>
      {/* 아랫칸 상호명 + 자세히 보기 */}
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-bold text-slate-900">{item.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-500">{item.summary}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
          자세히 보기 <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
