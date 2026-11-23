import { Check, X } from "lucide-react";

export default function PasswordChecklist({ checks }) {
  return (
    <ul
      aria-label="Password requirements"
      className="mt-2 grid gap-1.5 sm:grid-cols-3"
    >
      {checks.map((check) => (
        <li
          key={check.id}
          className={`flex items-center gap-1.5 text-[11px] font-medium ${
            check.met
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {check.met ? (
            <Check className="h-3 w-3 shrink-0" aria-hidden="true" />
          ) : (
            <X className="h-3 w-3 shrink-0" aria-hidden="true" />
          )}
          <span>{check.label}</span>
          <span className="sr-only">
            {check.met ? " requirement met" : " requirement not met"}
          </span>
        </li>
      ))}
    </ul>
  );
}
