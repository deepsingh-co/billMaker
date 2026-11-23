import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  Plus,
} from "lucide-react";
import { todayLabel } from "../../lib/format";
import { getInitials } from "../../lib/authValidation";
import { useAuth } from "../auth/AuthProvider";
import ThemeToggle from "../ui/ThemeToggle";

export default function Topbar({
  title,
  subtitle,
  onOpenSidebar,
  onNewSale,
  onNavigate,
}) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const initials = getInitials(user?.name, user?.email);

  const handleSignOut = () => {
    setMenuOpen(false);
    logout();
    onNavigate?.("login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </p>
          <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">
            {subtitle}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 md:flex">
            <CalendarDays
              className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />
            {todayLabel()}
          </span>
          <ThemeToggle />
          <button
            type="button"
            onClick={onNewSale}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-800 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 sm:px-4"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">New sale</span>
            <span className="sm:hidden">Sale</span>
          </button>

          <div ref={menuRef} className="relative">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls="account-menu"
              aria-label={`Account menu for ${user?.name || "your account"}`}
              className="flex cursor-pointer items-center gap-1.5 rounded-full p-0.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 font-mono text-xs font-semibold text-brand-800 ring-2 ring-white dark:bg-brand-500/15 dark:text-brand-300 dark:ring-slate-900">
                {initials}
              </span>
              <ChevronDown
                className={`hidden h-3.5 w-3.5 text-slate-400 transition-transform duration-200 sm:block ${
                  menuOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {menuOpen ? (
                <motion.div
                  id="account-menu"
                  role="menu"
                  aria-label="Account"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40"
                >
                  <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {user?.name || "Signed in"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-1.5">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate?.("home");
                      }}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                      <Globe
                        className="h-4 w-4 text-slate-400 dark:text-slate-500"
                        aria-hidden="true"
                      />
                      Back to site
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-rose-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-200"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
