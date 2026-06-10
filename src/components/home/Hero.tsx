import Link from "next/link";
import { ArrowRight, Rocket, ShieldCheck, Wallet } from "lucide-react";

const BADGES = [
  { Icon: ShieldCheck, title: "케어 플랜", desc: "제작·광고·운영" },
  { Icon: Rocket, title: "빠른제작", desc: "3일~7일" },
  { Icon: Wallet, title: "합리적 비용", desc: "가성비+퀄리티" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl"
        aria-hidden
      />
      <div className="container-w relative py-16 sm:py-20 lg:py-28">
        <p className="text-sm font-semibold text-brand-600 sm:text-base">
          랜딩&홈페이지 제작 · 광고 운영 · 검색 상단 노출 · 맞춤형 웹 솔루션
        </p>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          <span className="block whitespace-nowrap">문의로 이어지는</span>
          <span className="block whitespace-nowrap">
            홈페이지를 <span className="text-brand-600">만듭니다</span>
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
          홈페이지 제작부터 광고 연동·운영 관리까지
          <br />
          단순 제작이 아닌 문의 구조까지 설계합니다.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/diagnosis" className="btn-primary">
            무료 진단 신청 <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/cases" className="btn-ghost">
            성공 사례 보기
          </Link>
          <Link href="/landing" className="btn-ghost">
            WEFLOW 랜딩 페이지
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {BADGES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-900">
                  {title}
                </span>
                <span className="block text-xs text-slate-500">{desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
