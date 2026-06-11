import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn 표준 클래스 병합 유틸 — 조건부 클래스 + Tailwind 충돌 해소
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
