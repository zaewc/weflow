import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-extrabold tracking-tight ${className}`}
      aria-label="WEFLOW 홈"
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white shadow-brand">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 7l3 10 3-7 3 7 3-10" />
          <path d="M18 7l3 10" />
        </svg>
      </span>
      <span className="text-lg text-slate-900">
        WE<span className="text-brand-600">FLOW</span>
      </span>
    </Link>
  );
}
