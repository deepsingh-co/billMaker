import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-16 shrink-0 cursor-pointer items-center rounded-full border border-slate-200 bg-slate-100 p-1 shadow-sm transition-colors duration-200 hover:bg-slate-200 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-950 ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      >
        <Sun className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      >
        <Moon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <span
        aria-hidden="true"
        className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm transition-transform duration-300 ease-out dark:bg-slate-950 dark:text-amber-300 ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Sun className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </span>
      <span className="sr-only">
        {isDark ? "Dark theme enabled" : "Light theme enabled"}
      </span>
    </button>
  );
}
