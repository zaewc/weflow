import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { CASES } from "@/lib/cases";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const item = CASES.find((c) => c.slug === params.slug);
  if (!item) return { title: "성공사례 | WEFLOW" };
  return {
    title: `${item.name} 성공사례 | WEFLOW`,
    description: item.summary,
  };
}

export default function CaseDetailPage({ params }: Props) {
  const item = CASES.find((c) => c.slug === params.slug);
  if (!item) notFound();

  return (
    <article className="pb-16">
      <div className={`relative overflow-hidden bg-gradient-to-br ${item.gradient}`}>
        <Image
          src={item.image}
          alt={`${item.name} 대표 이미지`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-slate-950/40" aria-hidden />
        <div className="container-w relative py-16 text-white">
          <Link
            href="/cases"
            className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> 성공사례 목록
          </Link>
          <p className="text-sm font-semibold text-white/80">{item.category}</p>
          <h1 className="mt-2 text-3xl font-extrabold drop-shadow sm:text-4xl">
            {item.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90 drop-shadow">
            {item.summary}
          </p>
        </div>
      </div>

      <div className="container-w -mt-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {item.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-extrabold text-brand-600">
                {m.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-bold text-slate-900">진행 포인트</h2>
          <ul className="mt-4 space-y-3">
            {item.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-slate-600">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-brand-600 p-8 text-center text-white shadow-brand">
          <h2 className="text-2xl font-bold">
            우리 업종도 이렇게 만들 수 있을까요?
          </h2>
          <p className="mt-2 text-brand-100">
            무료 진단 후 맞춤 견적을 받아보세요.
          </p>
          <Link
            href="/diagnosis"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-brand-700 transition hover:bg-brand-50"
          >
            무료진단 후 견적받기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
