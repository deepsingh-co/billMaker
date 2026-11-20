import { CalendarDays, Menu, Plus } from "lucide-react";
import { todayLabel } from "../../lib/format";

export default function Topbar({
  title,
  subtitle,
  onOpenSidebar,
  onNewSale,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
          <p className="hidden truncate text-xs text-slate-500 sm:block">
            {subtitle}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 md:flex">
            <CalendarDays className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            {todayLabel()}
          </span>
          <button
            type="button"
            onClick={onNewSale}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-800 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-700 sm:px-4"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">New sale</span>
            <span className="sm:hidden">Sale</span>
          </button>
          <span
            aria-label="Signed in as store admin"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 font-mono text-xs font-semibold text-brand-800 ring-2 ring-white"
          >
            DS
          </span>
        </div>
      </div>
    </header>
  );
}
