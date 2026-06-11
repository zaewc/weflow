import Link from "next/link";
import { Check, Crown } from "lucide-react";
import type { PlanCard as Plan } from "@/lib/pricing";

export default function PlanCardView({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition ${
        plan.highlight
          ? "border-brand-300 bg-gradient-to-b from-brand-50 to-white shadow-brand ring-1 ring-brand-200"
          : "border-slate-200 bg-white hover:border-brand-200 hover:shadow-lg"
      }`}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white shadow-brand">
          <Crown className="h-3.5 w-3.5" /> BEST
        </span>
      )}

      <div className="mb-4">
        {plan.badge && (
          <span
            className={`text-sm font-extrabold tracking-wide ${
              plan.highlight ? "text-brand-600" : "text-slate-500"
            }`}
          >
            {plan.badge}
          </span>
        )}
        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
        {plan.subtitle && (
          <p className="mt-0.5 text-sm text-slate-500">{plan.subtitle}</p>
        )}
      </div>

      <ul className="mb-6 flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-100 pt-4">
        <p className="text-sm font-medium text-slate-500 line-through">
          {plan.oldPrice}
        </p>
        <p className="mt-0.5 flex items-end gap-1">
          <span
            className={`text-3xl font-extrabold ${
              plan.highlight ? "text-brand-600" : "text-slate-900"
            }`}
          >
            {plan.newPrice}
          </span>
          {plan.priceSuffix && (
            <span className="pb-1 text-lg font-bold text-slate-500">
              {plan.priceSuffix}
            </span>
          )}
        </p>
        <Link
          href="/diagnosis"
          className={
            plan.highlight
              ? "btn-primary mt-4 w-full"
              : "btn-ghost mt-4 w-full"
          }
        >
          무료진단 후 견적받기
        </Link>
      </div>
    </div>
  );
}
