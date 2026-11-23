import { AlertCircle } from "lucide-react";

export default function AuthField({
  id,
  label,
  icon: Icon,
  error,
  hint,
  trailing,
  className = "",
  ...inputProps
}) {
  const showHint = Boolean(hint) && !error;
  const describedBy =
    [error ? `${id}-error` : null, showHint ? `${id}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>

      <div className="relative mt-1.5">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
        ) : null}

        <input
          id={id}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-xl border bg-white py-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:ring-brand-900/60 ${
            Icon ? "pl-10" : "pl-3.5"
          } ${trailing ? "pr-12" : "pr-3.5"} ${
            error
              ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-500/60 dark:focus:border-rose-400 dark:focus:ring-rose-500/20"
              : "border-slate-300 dark:border-slate-700"
          }`}
          {...inputProps}
        />

        {trailing ? (
          <div className="absolute inset-y-0 right-1.5 flex items-center">
            {trailing}
          </div>
        ) : null}
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-300"
        >
          <AlertCircle
            className="mt-px h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
          {error}
        </p>
      ) : showHint ? (
        <p
          id={`${id}-hint`}
          className="mt-1.5 text-xs text-slate-500 dark:text-slate-400"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
