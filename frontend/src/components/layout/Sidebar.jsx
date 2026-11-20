import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  ReceiptText,
  ScanBarcode,
  ScanLine,
  Store,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, shortcut: "1" },
  { id: "pos", label: "Point of Sale", icon: ScanLine, shortcut: "2" },
  { id: "transactions", label: "Transactions", icon: ReceiptText, shortcut: "3" },
];

function SidebarContent({ page, onNavigate, onClose }) {
  return (
    <div className="flex h-full flex-col bg-brand-950">
      <div className="flex h-16 items-center justify-between gap-3 border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-950/50">
            <ScanBarcode className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-300">
              Retail OS
            </p>
            <p className="text-base font-semibold tracking-tight text-white">
              Barcode Suite
            </p>
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="px-4 py-5">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-brand-200">
              <Store className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Active store
              </p>
              <p className="truncate text-sm font-medium text-white">Main Store</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
          </div>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex-1 px-3">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] transition-colors ${
                      active
                        ? "text-brand-200"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 xl:block">
                    {item.shortcut}
                  </kbd>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Terminal
            </p>
            <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              v1.0
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Use{" "}
            <kbd className="rounded border border-white/10 bg-white/5 px-1 font-mono text-[10px] text-slate-300">
              Alt
            </kbd>{" "}
            +{" "}
            <kbd className="rounded border border-white/10 bg-white/5 px-1 font-mono text-[10px] text-slate-300">
              1–3
            </kbd>{" "}
            to switch views.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ page, onNavigate, open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarContent page={page} onNavigate={onNavigate} />
      </aside>

      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              type="button"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="absolute inset-0 cursor-pointer bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl"
            >
              <SidebarContent
                page={page}
                onNavigate={onNavigate}
                onClose={onClose}
              />
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
