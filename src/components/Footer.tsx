import Link from "next/link";
import { Phone, Mail, MessageCircle, Instagram, Facebook } from "lucide-react";
import Logo from "@/components/Logo";
import { SITE, LINKS } from "@/lib/site";

const SERVICE_LINKS = [
  { label: "홈페이지 제작 과정", href: "/services" },
  { label: "랜딩페이지 제작 과정", href: "/landing" },
  { label: "광고 운영 · 관리 안내", href: "/services#ad" },
];

const CARE_LINKS = [
  { label: "WE 케어", href: "/pricing#care" },
  { label: "FLOW 케어", href: "/pricing#care" },
  { label: "WEFLOW 케어", href: "/pricing#care" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-w grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-slate-600">{SITE.tagline}</p>
          <dl className="space-y-1 text-sm text-slate-500">
            <div>대표 : {SITE.ceo}</div>
            <div>사업자등록번호 : {SITE.bizNo}</div>
            <div>이메일 : {SITE.email}</div>
            <div>운영시간 : {SITE.hours}</div>
          </dl>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-900">서비스</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {SERVICE_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-brand-700">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-900">
            WEFLOW 케어플랜
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {CARE_LINKS.map((l, i) => (
              <li key={i}>
                <Link href={l.href} className="hover:text-brand-700">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-900">상담문의</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <a href={LINKS.phone} className="flex items-center gap-2 hover:text-brand-700">
                <Phone className="h-4 w-4" /> 전화문의
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-brand-700">
                <Mail className="h-4 w-4" /> 이메일 문의
              </a>
            </li>
            <li>
              <a href={LINKS.kakao} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-700">
                <MessageCircle className="h-4 w-4" /> 카카오 채널 문의
              </a>
            </li>
            <li>
              <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-700">
                <Instagram className="h-4 w-4" /> 인스타 문의
              </a>
            </li>
            <li>
              <a href={LINKS.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-700">
                <Facebook className="h-4 w-4" /> 페이스북 문의
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-w flex flex-col items-center justify-between gap-3 py-5 text-sm text-slate-500 sm:flex-row">
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-700">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-brand-700">
              이용약관
            </Link>
          </div>
          <p>{SITE.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
