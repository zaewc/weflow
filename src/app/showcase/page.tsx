"use client";

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import {
  Component as LiquidGlassDock,
  GlassButton,
  GlassFilter,
} from "@/components/ui/glass-dock";
import {
  LiquidButton,
  MetalButton,
} from "@/components/ui/liquid-metal-button";
import { ButtonColorful } from "@/components/ui/colorful-button";

const METAL_VARIANTS = [
  "default",
  "primary",
  "success",
  "error",
  "gold",
  "bronze",
] as const;

// UI 컴포넌트 쇼케이스 — 벤더링된 liquid-glass / colorful 컴포넌트 데모
export default function ShowcasePage() {
  return (
    <div className="space-y-16 pb-16">
      <GlassFilter />
      {/* 배경 그라데이션 애니메이션 + CTA / 리퀴드 버튼 */}
      <section className="relative h-[70vh] overflow-hidden rounded-none">
        <BackgroundGradientAnimation containerClassName="h-full w-full">
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 px-4 text-center">
            <p className="bg-gradient-to-b from-white/90 to-white/40 bg-clip-text text-4xl font-extrabold text-transparent drop-shadow-2xl md:text-6xl">
              Liquid Glass × Gradients
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <ButtonColorful label="무료 진단 신청" />
              <LiquidButton size="xl" className="text-white">
                Liquid Glass
              </LiquidButton>
              <GlassButton>
                <span className="text-lg text-white">Glass Button</span>
              </GlassButton>
            </div>
          </div>
        </BackgroundGradientAnimation>
      </section>

      {/* 메탈 버튼 변형 */}
      <section className="container-w">
        <h2 className="section-title mb-6 text-center">Metal Buttons</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {METAL_VARIANTS.map((variant) => (
            <MetalButton key={variant} variant={variant}>
              {variant}
            </MetalButton>
          ))}
        </div>
      </section>

      {/* 리퀴드 글래스 독 데모 */}
      <section>
        <h2 className="section-title mb-6 text-center">Liquid Glass Dock</h2>
        <div className="relative h-[60vh] overflow-hidden">
          <LiquidGlassDock />
        </div>
      </section>
    </div>
  );
}
