import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Skeleton } from "./Skeleton";

const TONES = {
  brand:
    "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  emerald:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  violet:
    "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "brand",
  delta,
  hint,
  loading = false,
}) {
  const hasDelta = typeof delta === "number" && Number.isFinite(delta);
  const isPositive = hasDelta && delta >= 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          {loading ? (
            <Skeleton className="mt-3 h-8 w-28" />
          ) : (
            <p className="tabular mt-2 truncate text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {value}
            </p>
          )}
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONES[tone] || TONES.brand}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {hasDelta && !loading ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ArrowDownRight className="h-3 w-3" aria-hidden="true" />
            )}
            {`${Math.abs(delta).toFixed(1)}%`}
          </span>
        ) : null}
        {hint ? <span className="text-xs text-slate-500 dark:text-slate-400">{hint}</span> : null}
      </div>
    </article>
  );
}
