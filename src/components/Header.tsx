"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  LayoutGrid,
  Tag,
  Trophy,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import Logo from "@/components/Logo";
import { LimelightNav, type NavItem } from "@/components/ui/limelight-nav";
import { NAV } from "@/lib/site";

// NAV 순서와 1:1 대응하는 아이콘
const NAV_ICONS: LucideIcon[] = [Home, LayoutGrid, Tag, Trophy, CalendarDays];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const activeIndex = Math.max(
    0,
    NAV.findIndex((n) =>
      n.href === "/" ? pathname === "/" : pathname.startsWith(n.href),
    ),
  );

  const navItems: NavItem[] = NAV.map((n, i) => {
    const Icon = NAV_ICONS[i]!;
    return {
      id: n.href,
      label: n.label,
      href: n.href,
      icon: <Icon />,
      onClick: () => router.push(n.href),
    };
  });

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container-w flex h-16 items-center justify-between">
        <Logo />

        <div className="hidden lg:block">
          <LimelightNav
            items={navItems}
            defaultActiveIndex={activeIndex}
            className="border-slate-200 bg-white/60"
            iconContainerClassName="min-w-[7.5rem]"
            iconClassName="text-brand-600"
          />
        </div>

        <div className="hidden lg:block">
          <Link href="/diagnosis" className="btn-primary px-4 py-2 text-sm">
            무료 진단 신청
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="메뉴 열기"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-100 bg-white lg:hidden">
          <div className="container-w flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/diagnosis"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              무료 진단 신청
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
