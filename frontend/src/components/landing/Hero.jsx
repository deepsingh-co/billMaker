import { ArrowRight, CircleDot, ShieldCheck, Sparkles } from "lucide-react";
import Hero3D from "./Hero3D";

const STATS = [
  { value: "0.4s", label: "barcode lookup" },
  { value: "3", label: "connected workspaces" },
  { value: "100%", label: "local data ownership" },
];

function scrollToWorkflow() {
  const target = document.getElementById("how-it-works");
  if (!target) return;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

export default function Hero({ onNavigate }) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36"
    >
      <div
        aria-hidden="true"
        className="landing-grid pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.16),transparent_65%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.12),transparent_65%)] blur-2xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:px-8">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-200">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" aria-hidden="true" />
            Barcode billing, rebuilt for modern retail
          </span>

          <h1
            id="hero-title"
            className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            From barcode to{" "}
            <span className="bg-gradient-to-r from-sky-300 via-sky-400 to-orange-300 bg-clip-text text-transparent">
              insight
            </span>
            , in seconds.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
            Turn any camera into a checkout counter. Scan products, generate
            invoices and watch revenue update live — all from one fast,
            distraction-free workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-semibold text-brand-950 shadow-xl shadow-orange-500/25 transition-colors duration-200 hover:bg-orange-400"
            >
              Open the dashboard
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={scrollToWorkflow}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
            >
              <CircleDot className="h-4 w-4 text-sky-300" aria-hidden="true" />
              See how it works
            </button>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 sm:flex sm:flex-wrap sm:gap-x-8 sm:gap-y-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
            <p className="flex items-center gap-1.5 text-xs text-slate-400 sm:ml-auto sm:self-end">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              No sign-up required
            </p>
          </div>
        </div>

        <div className="relative">
          <Hero3D />
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Live 3D scene · moves as you explore
          </p>
        </div>
      </div>
    </section>
  );
}
