"use client";

import {
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type ColorKey =
  | "color1"
  | "color2"
  | "color3"
  | "color4"
  | "color5"
  | "color6"
  | "color7"
  | "color8"
  | "color9"
  | "color10"
  | "color11"
  | "color12"
  | "color13"
  | "color14"
  | "color15"
  | "color16"
  | "color17";

export type Colors = Record<ColorKey, string>;

const DEFAULT_COLORS: Colors = {
  color1: "#FFFFFF",
  color2: "#1E10C5",
  color3: "#9089E2",
  color4: "#FCFCFE",
  color5: "#F9F9FD",
  color6: "#B2B8E7",
  color7: "#0E2DCB",
  color8: "#0017E9",
  color9: "#4743EF",
  color10: "#7D7BF4",
  color11: "#0B06FC",
  color12: "#C5C1EA",
  color13: "#1403DE",
  color14: "#B6BAF6",
  color15: "#C1BEEB",
  color16: "#290ECB",
  color17: "#3F4CC0",
};

const GRADIENT_TRANSFORMS = [
  "translate(287.5 280) rotate(-29.0546) scale(689.807 1000)",
  "translate(126.5 418.5) rotate(-64.756) scale(533.444 773.324)",
  "translate(264.5 339.5) rotate(-42.3022) scale(946.451 1372.05)",
  "translate(860.5 420) rotate(-153.984) scale(957.528 1388.11)",
  "translate(264.5 339.5) rotate(-42.3022) scale(946.451 1372.05)",
  "translate(126.5 418.5) rotate(-64.756) scale(533.444 773.324)",
  "translate(287.5 280) rotate(-29.0546) scale(689.807 1000)",
] as const;

const STOP_OFFSETS = [
  0, 0.104167, 0.188423, 0.260417, 0.328792, 0.442708, 0.537556, 0.631738,
  0.725645, 0.817779, 0.869792, 0.90569, 1,
] as const;

const COLOR_SEQUENCE: readonly ColorKey[] = [
  "color1",
  "color12",
  "color2",
  "color13",
  "color4",
  "color6",
  "color7",
  "color1",
  "color8",
  "color9",
  "color10",
  "color1",
  "color11",
];

interface GradientSvgProps {
  className?: string;
  colors: Colors;
  gradientId: string;
  isHovered: boolean;
}

function GradientSvg({
  className,
  colors,
  gradientId,
  isHovered,
}: GradientSvgProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 1030 280"
      preserveAspectRatio="none"
    >
      <rect width="1030" height="280" rx="140" fill={`url(#${gradientId})`} />
      <defs>
        <motion.radialGradient
          id={gradientId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform={GRADIENT_TRANSFORMS[0]}
          initial={{ gradientTransform: GRADIENT_TRANSFORMS[0] }}
          animate={{ gradientTransform: [...GRADIENT_TRANSFORMS] }}
          transition={{
            duration: isHovered ? 4 : 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {STOP_OFFSETS.map((offset, index) => {
            const colorKey = COLOR_SEQUENCE[index];
            return (
              <stop
                key={offset}
                offset={offset}
                stopColor={colorKey ? colors[colorKey] : colors.color1}
              />
            );
          })}
        </motion.radialGradient>
      </defs>
    </svg>
  );
}

interface LiquidProps {
  colors?: Colors;
  idPrefix: string;
  isHovered: boolean;
}

export function Liquid({
  colors = DEFAULT_COLORS,
  idPrefix,
  isHovered,
}: LiquidProps) {
  return (
    <>
      {Array.from({ length: 7 }, (_, index) => (
        <span
          key={index}
          className={cn(
            "absolute left-1/2 top-1/2 mix-blend-difference",
            index < 3 ? "h-[121px] w-[443px]" : "h-[207px] w-[756px]",
            index === 0 && "-translate-x-1/2 -translate-y-1/2",
            index === 1 &&
              "-translate-x-1/2 -translate-y-1/2 rotate-[164.971deg]",
            index === 2 &&
              "-translate-x-[53%] -translate-y-[53%] -rotate-[11.61deg]",
            index === 3 &&
              "-translate-x-1/2 -translate-y-[57%] -rotate-[179.012deg]",
            index === 4 &&
              "-translate-x-[57%] -translate-y-1/2 -rotate-[29.722deg]",
            index === 5 &&
              "-translate-x-[62%] -translate-y-[24%] rotate-[160.227deg]",
            index === 6 &&
              "-translate-x-[67%] -translate-y-[29%] rotate-180 mix-blend-hard-light",
          )}
        >
          <GradientSvg
            className="h-full w-full"
            colors={colors}
            gradientId={`${idPrefix}-${index}`}
            isHovered={isHovered}
          />
        </span>
      ))}
    </>
  );
}

interface AnimatedGradientButtonProps
  extends Omit<ComponentPropsWithoutRef<typeof Link>, "children"> {
  children: ReactNode;
  colors?: Colors;
}

export function AnimatedGradientButton({
  children,
  className,
  colors = DEFAULT_COLORS,
  ...props
}: AnimatedGradientButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const idPrefix = useId().replace(/:/g, "");

  return (
    <Link
      className={cn(
        "group relative isolate inline-flex min-h-12 items-center justify-center overflow-visible rounded-xl px-6 py-3",
        "font-bold tracking-tight text-white outline-none transition-transform duration-200",
        "hover:scale-[1.03] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      {...props}
    >
      <span className="absolute inset-[-10%] -z-20 rounded-2xl bg-blue-500/60 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
      <span className="absolute inset-0 -z-10 overflow-hidden rounded-xl border border-white/45 bg-[#010128] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_8px_24px_rgba(30,16,197,0.45)]">
        <span className="absolute inset-0 bg-black/25" />
        <Liquid
          colors={colors}
          idPrefix={idPrefix}
          isHovered={isHovered}
        />
        <span className="absolute inset-px rounded-[0.7rem] border border-white/25 mix-blend-overlay" />
        <span className="absolute inset-x-[15%] top-[28%] h-[30%] rounded-full bg-blue-100/30 blur-xl" />
      </span>
      <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
        {children}
      </span>
    </Link>
  );
}
