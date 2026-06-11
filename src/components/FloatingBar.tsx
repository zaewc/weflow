import { Phone, MessageCircle, BookOpen, Stethoscope } from "lucide-react";
import { LINKS } from "@/lib/site";
import { DockTabs, type DockItem } from "@/components/ui/dock-tabs";

const ITEMS: readonly DockItem[] = [
  {
    id: "phone",
    name: "24시간 상담",
    href: LINKS.phone,
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    icon: <Phone />,
  },
  {
    id: "kakao",
    name: "카카오톡문의",
    href: LINKS.kakao,
    external: true,
    color: "bg-gradient-to-br from-amber-300 to-yellow-500 text-slate-900",
    icon: <MessageCircle />,
  },
  {
    id: "blog",
    name: "블로그",
    href: LINKS.blog,
    external: true,
    color: "bg-gradient-to-br from-emerald-400 to-green-600",
    icon: <BookOpen />,
  },
  {
    id: "diagnosis",
    name: "무료진단",
    href: "/diagnosis",
    color: "bg-gradient-to-br from-violet-500 to-fuchsia-600",
    icon: <Stethoscope />,
  },
];

export default function FloatingBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] sm:bottom-5">
      <DockTabs items={ITEMS} className="pointer-events-auto" />
    </div>
  );
}
