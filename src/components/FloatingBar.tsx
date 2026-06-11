import { Phone, MessageCircle, BookOpen, Stethoscope } from "lucide-react";
import { LINKS } from "@/lib/site";
import MacOSDock, { type DockApp } from "@/components/ui/mac-os-dock";

const ITEMS: readonly DockApp[] = [
  {
    id: "phone",
    name: "24시간 상담",
    href: LINKS.phone,
    icon: <Phone className="h-5 w-5 sm:h-6 sm:w-6" />,
  },
  {
    id: "kakao",
    name: "카카오톡문의",
    href: LINKS.kakao,
    external: true,
    icon: <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />,
  },
  {
    id: "blog",
    name: "블로그",
    href: LINKS.blog,
    external: true,
    icon: <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />,
  },
  {
    id: "diagnosis",
    name: "무료진단",
    href: "/diagnosis",
    icon: <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6" />,
  },
];

export default function FloatingBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] sm:bottom-5">
      <MacOSDock
        apps={ITEMS}
        className="pointer-events-auto"
      />
    </div>
  );
}
