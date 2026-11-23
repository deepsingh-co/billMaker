import {
  ArrowLeft,
  BarChart3,
  ScanBarcode,
  ShieldCheck,
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

const HIGHLIGHTS = [
  {
    icon: ScanBarcode,
    title: "Scan, bill, done",
    copy: "Camera or manual barcode entry with totals validated on the server.",
  },
  {
    icon: BarChart3,
    title: "Live store analytics",
    copy: "Revenue, bills and top products refresh as every sale lands.",
  },
  {
    icon: ShieldCheck,
    title: "Protected workspace",
    copy: "Hashed passwords, signed sessions and rate-limited sign-in.",
  },
];

function DesktopBrand() {
  return (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-950/50">
        <ScanBarcode className="h-5 w-5 text-white" aria-hidden="true" />
      </span>
      <span className="text-left">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-300">
          Retail OS
        </span>
        <span className="block text-base font-semibold tracking-tight text-white">
          Barcode Suite
        </span>
      </span>
    </>
  );
}

function MobileBrand() {
  return (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600">
        <ScanBarcode className="h-4 w-4 text-white" aria-hidden="true" />
      </span>
      <span className="text-left">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300">
          Retail OS
        </span>
        <span className="block text-sm font-semibold text-slate-900 dark:text-white">
          Barcode Suite
        </span>
      </span>
    </>
  );
}

export default function AuthLayout({
  badge,
  title,
  subtitle,
  children,
  footer,
  onNavigate,
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <aside className="relative hidden overflow-hidden bg-brand-950 lg:flex lg:flex-col">
          <div
            aria-hidden="true"
            className="landing-grid pointer-events-none absolute inset-0"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-28 top-24 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl"
          />

          <div className="relative flex h-full flex-col px-10 py-10 xl:px-14 xl:py-12">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="flex cursor-pointer items-center gap-3 self-start rounded-xl focus-visible:ring-offset-brand-950"
            >
              <DesktopBrand />
            </button>

            <div className="mt-16 max-w-lg">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-300/25 bg-brand-400/10 px-3 py-1.5 text-xs font-semibold text-brand-200">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Secure retail workspace
              </span>
              <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-[2.75rem]">
                The counter, the numbers and the receipts.
                <span className="bg-gradient-to-r from-brand-300 via-sky-300 to-orange-300 bg-clip-text text-transparent">
                  {" "}
                  In one place.
                </span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-300">
                Sign in to scan products, generate invoices and watch today&apos;s
                revenue update live from a single fast workspace.
              </p>
            </div>

            <ul className="mt-10 space-y-4">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-brand-200">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                        {item.copy}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto pt-10">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span>Session security</span>
                  <span className="font-mono text-emerald-300">JWT</span>
                </div>
                <p className="mt-3 font-mono text-xs leading-relaxed text-slate-400">
                  bcrypt password hashing · rate-limited sign-in · protected API
                  routes
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-10">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="flex cursor-pointer items-center gap-3 rounded-xl lg:hidden"
            >
              <MobileBrand />
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="hidden cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:inline-flex"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to site
              </button>
              <ThemeToggle />
            </div>
          </header>

          <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
            <div className="w-full max-w-md">
              <div className="mb-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">
                  {badge}
                </span>
                <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[2rem]">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                {children}
              </div>

              {footer ? (
                <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  {footer}
                </div>
              ) : null}

              <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Passwords are hashed. Sessions are signed.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
