import Link from "next/link";
import { Phone, MessageCircle, BookOpen, Stethoscope } from "lucide-react";
import { LINKS } from "@/lib/site";

// 모든 페이지 하단에 항상 고정되는 4개 1열 가로 바 (메뉴얼 page 5 / 13)
const ITEMS = [
  { label: "24시간 상담", href: LINKS.phone, Icon: Phone, external: false },
  { label: "카카오톡문의", href: LINKS.kakao, Icon: MessageCircle, external: true },
  { label: "블로그", href: LINKS.blog, Icon: BookOpen, external: true },
  { label: "무료진단", href: "/diagnosis", Icon: Stethoscope, external: false },
] as const;

export default function FloatingBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur">
      <div className="container-w grid grid-cols-4">
        {ITEMS.map(({ label, href, Icon, external }) => {
          const inner = (
            <span className="flex flex-col items-center justify-center gap-1 py-2.5 text-slate-700 transition hover:text-brand-700">
              <Icon className="h-5 w-5" />
              <span className="text-[11px] font-semibold sm:text-xs">
                {label}
              </span>
            </span>
          );
          return external ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="border-r border-slate-100 last:border-r-0"
            >
              {inner}
            </a>
          ) : (
            <Link
              key={label}
              href={href}
              className="border-r border-slate-100 last:border-r-0"
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
