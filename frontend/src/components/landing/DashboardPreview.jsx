import { useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Lock,
  ReceiptText,
  ScanBarcode,
  ScanLine,
  Search,
  TrendingUp,
} from "lucide-react";
import Reveal from "./Reveal";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ScanLine, label: "Point of sale" },
  { icon: ReceiptText, label: "Transactions" },
];

const KPIS = [
  { label: "Revenue today", value: "₹42,890", delta: "+18.2%", positive: true },
  { label: "Bills today", value: "37", delta: "+9.1%", positive: true },
  { label: "Average bill", value: "₹1,159", delta: "−2.4%", positive: false },
];

const PRODUCTS = [
  { name: "Aashirvaad Atta 5kg", units: "12 units", value: "₹3,420", width: "92%" },
  { name: "Amul Butter 500g", units: "9 units", value: "₹2,385", width: "74%" },
  { name: "Fortune Sunflower Oil", units: "7 units", value: "₹1,015", width: "58%" },
];

const INVOICES = [
  { id: "INV-2048", time: "2 min ago", amount: "₹550" },
  { id: "INV-2047", time: "8 min ago", amount: "₹1,248" },
  { id: "INV-2046", time: "14 min ago", amount: "₹285" },
];

export default function DashboardPreview({ onNavigate }) {
  const frame = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    if (event.pointerType !== "mouse") return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !frame.current
    ) {
      return;
    }
    const rect = frame.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    setTilt({ x: (0.5 - py) * 4.5, y: (px - 0.5) * 6.5 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <section
      id="preview"
      aria-labelledby="preview-title"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/5 py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(14,165,233,0.13),transparent_65%)] blur-2xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
            Product tour
          </p>
          <h2
            id="preview-title"
            className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            A workspace that reads at a glance.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            The dashboard pairs a calm, data-dense layout with the numbers that
            actually change decisions: revenue, bill value and product velocity.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative mt-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-2 top-24 z-20 hidden -rotate-3 items-center gap-2 rounded-xl border border-sky-400/20 bg-[#07182e]/95 px-3.5 py-2.5 shadow-xl shadow-sky-950/50 backdrop-blur lg:flex xl:-left-10"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400/15 text-sky-300">
              <ScanBarcode className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-white">Scan → cart</p>
              <p className="font-mono text-[10px] text-slate-400">0.4 seconds</p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 bottom-20 z-20 hidden rotate-2 items-center gap-2 rounded-xl border border-emerald-400/20 bg-[#07182e]/95 px-3.5 py-2.5 shadow-xl shadow-emerald-950/40 backdrop-blur lg:flex xl:-right-10"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-white">
                Revenue up 18.2%
              </p>
              <p className="font-mono text-[10px] text-slate-400">
                vs yesterday
              </p>
            </div>
          </div>

          <div
            ref={frame}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
            className="mx-auto max-w-4xl [perspective:1500px]"
            aria-hidden="true"
          >
            <div
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
              className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#07101f] shadow-[0_50px_120px_-40px_rgba(2,132,199,0.55)] transition-transform duration-200 ease-out will-change-transform"
            >
              <div className="flex items-center gap-2 border-b border-white/10 bg-[#0a1526] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                <span className="mx-auto flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] text-slate-400">
                  <Lock className="h-3 w-3" aria-hidden="true" />
                  barcode-suite.app/dashboard
                </span>
                <span className="w-12" />
              </div>

              <div className="flex">
                <aside className="hidden w-44 shrink-0 border-r border-white/10 bg-[#070f1c] p-3 sm:block">
                  <div className="flex items-center gap-2 px-1">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-sky-600">
                      <ScanBarcode className="h-3.5 w-3.5 text-white" />
                    </span>
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-sky-300">
                        Retail OS
                      </p>
                      <p className="font-display text-[11px] font-bold leading-tight text-white">
                        Barcode Suite
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 px-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Workspace
                  </p>
                  <ul className="mt-2 space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.label}>
                          <span
                            className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-medium ${
                              item.active
                                ? "bg-white/10 text-white"
                                : "text-slate-400"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {item.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-2">
                    <p className="text-[8px] uppercase tracking-wider text-slate-500">
                      Active store
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-white">
                      Main Store
                    </p>
                  </div>
                </aside>

                <div className="min-w-0 flex-1 bg-[#f8fafc] p-3 text-slate-900 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-brand-700">
                        Overview
                      </p>
                      <p className="font-display text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                        Sales dashboard
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="hidden items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[9px] font-medium text-slate-500 sm:flex">
                        <Search className="h-2.5 w-2.5" />
                        Search sales
                      </span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 font-mono text-[8px] font-semibold text-brand-800">
                        DS
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {KPIS.map((kpi) => (
                      <div
                        key={kpi.label}
                        className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm"
                      >
                        <p className="truncate text-[8px] font-medium text-slate-500 sm:text-[9px]">
                          {kpi.label}
                        </p>
                        <p className="mt-1 font-display text-xs font-bold text-slate-900 sm:text-sm">
                          {kpi.value}
                        </p>
                        <p
                          className={`mt-0.5 text-[8px] font-semibold ${
                            kpi.positive ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {kpi.delta}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2.5 grid gap-2.5 md:grid-cols-[1.6fr_1fr]">
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[9px] font-semibold text-slate-800">
                            Revenue trend
                          </p>
                          <p className="text-[8px] text-slate-500">
                            Last 7 days
                          </p>
                        </div>
                        <p className="font-display text-[11px] font-bold text-slate-900">
                          ₹12,255
                        </p>
                      </div>

                      <svg
                        viewBox="0 0 320 96"
                        className="mt-2 h-20 w-full sm:h-24"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="previewArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>
                        {[20, 44, 68].map((y) => (
                          <line
                            key={y}
                            x1="0"
                            y1={y}
                            x2="320"
                            y2={y}
                            stroke="#e2e8f0"
                            strokeDasharray="3 5"
                          />
                        ))}
                        <path
                          d="M0 70 L53 58 L107 66 L160 44 L213 52 L267 30 L320 38 L320 96 L0 96 Z"
                          fill="url(#previewArea)"
                        />
                        <path
                          d="M0 70 L53 58 L107 66 L160 44 L213 52 L267 30 L320 38"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>

                      <div className="flex justify-between font-mono text-[7px] text-slate-400">
                        <span>14 Nov</span>
                        <span>16 Nov</span>
                        <span>18 Nov</span>
                        <span>20 Nov</span>
                      </div>
                    </div>

                    <div className="hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:block">
                      <p className="text-[9px] font-semibold text-slate-800">
                        Top products
                      </p>
                      <ul className="mt-2 space-y-2">
                        {PRODUCTS.map((product) => (
                          <li key={product.name}>
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-[8px] font-medium text-slate-600">
                                {product.name}
                              </p>
                              <p className="font-mono text-[8px] font-semibold text-slate-800">
                                {product.value}
                              </p>
                            </div>
                            <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-sky-500"
                                style={{ width: product.width }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-2.5 rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                      <p className="text-[9px] font-semibold text-slate-800">
                        Recent transactions
                      </p>
                      <span className="flex items-center gap-0.5 text-[8px] font-semibold text-brand-700">
                        View all <ChevronDown className="h-2.5 w-2.5 -rotate-90" />
                      </span>
                    </div>
                    <ul className="divide-y divide-slate-100">
                      {INVOICES.map((invoice) => (
                        <li
                          key={invoice.id}
                          className="flex items-center justify-between gap-2 px-3 py-1.5"
                        >
                          <span className="rounded bg-brand-50 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-brand-700">
                            {invoice.id}
                          </span>
                          <span className="text-[8px] text-slate-500">
                            {invoice.time}
                          </span>
                          <span className="font-mono text-[9px] font-semibold text-slate-800">
                            {invoice.amount}
                          </span>
                          <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-semibold text-emerald-700 sm:flex">
                            <span className="h-1 w-1 rounded-full bg-emerald-500" />
                            Recorded
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 shadow-xl shadow-sky-950/30 transition-colors duration-200 hover:bg-sky-50"
          >
            Explore the full dashboard
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
          <p className="text-xs text-slate-400">
            Sample data shown. Your workspace starts with your own MongoDB bills.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
