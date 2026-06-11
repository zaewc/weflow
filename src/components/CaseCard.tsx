import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CaseItem } from "@/lib/cases";

export default function CaseCard({ item }: { item: CaseItem }) {
  return (
    <Link
      href={`/cases/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
    >
      {/* 윗칸 이미지 */}
      <div
        className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${item.gradient}`}
      >
        <Image
          src={item.image}
          alt={`${item.name} 성공사례`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {item.category}
        </span>
        <ArrowUpRight className="absolute right-3 top-3 h-5 w-5 text-white drop-shadow transition group-hover:scale-125" />
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
