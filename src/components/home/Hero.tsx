import Link from "next/link";
import { ArrowRight, Rocket, ShieldCheck, Wallet } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass";

const BADGES = [
  { Icon: ShieldCheck, title: "케어 플랜", desc: "제작·광고·운영" },
  { Icon: Rocket, title: "빠른제작", desc: "3일~7일" },
  { Icon: Wallet, title: "합리적 비용", desc: "가성비+퀄리티" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* 애니메이션 그라데이션 배경 (브랜드 톤) */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(12, 20, 69)"
        gradientBackgroundEnd="rgb(8, 11, 40)"
        firstColor="31, 78, 245"
        secondColor="89, 141, 255"
        thirdColor="100, 220, 255"
        fourthColor="124, 58, 237"
        fifthColor="56, 189, 248"
        pointerColor="120, 150, 255"
        containerClassName="absolute inset-0 h-full w-full"
      />
      {/* 가독성 확보용 스크림 */}
      <div
        className="pointer-events-none absolute inset-0 bg-slate-950/30"
        aria-hidden
      />
      {/* 리퀴드 글래스 distortion 필터 정의 */}
      <GlassFilter />

      <div className="container-w relative z-10 py-16 sm:py-20 lg:py-28">
        <p className="text-sm font-semibold text-brand-200 sm:text-base">
          랜딩&홈페이지 제작 · 광고 운영 · 검색 상단 노출 · 맞춤형 웹 솔루션
        </p>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md sm:text-5xl">
          <span className="block whitespace-nowrap">문의로 이어지는</span>
          <span className="block whitespace-nowrap">
            홈페이지를 <span className="text-cyan-300">만듭니다</span>
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
          홈페이지 제작부터 광고 연동·운영 관리까지
          <br />
          단순 제작이 아닌 문의 구조까지 설계합니다.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/diagnosis" className="btn-primary">
            무료 진단 신청 <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/cases" className="inline-block">
            <GlassEffect className="rounded-xl px-6 py-3">
              <span className="text-base font-semibold text-white">
                성공 사례 보기
              </span>
            </GlassEffect>
          </Link>
          <Link href="/landing" className="inline-block">
            <GlassEffect className="rounded-xl px-6 py-3">
              <span className="text-base font-semibold text-white">
                WEFLOW 랜딩 페이지
              </span>
            </GlassEffect>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {BADGES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 text-cyan-200">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-white">
                  {title}
                </span>
                <span className="block text-xs text-white/70">{desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
