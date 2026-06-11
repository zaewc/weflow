import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-extrabold tracking-tight ${className}`}
      aria-label="WEFLOW 홈"
    >
      <Image
        src="/logo_icon.png"
        alt="WEFLOW"
        width={32}
        height={32}
        priority
        className="h-8 w-8 object-contain"
      />
      <span className="text-lg text-slate-900">
        WE<span className="text-brand-600">FLOW</span>
      </span>
    </Link>
  );
}
