import { ArrowRight, ScanLine } from "lucide-react";
import Reveal from "./Reveal";

export default function CtaBand({ onNavigate }) {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative border-t border-white/5 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-sky-400/20 bg-gradient-to-br from-[#07182e] via-[#050f20] to-[#0a1a2f] px-6 py-14 text-center shadow-[0_40px_120px_-50px_rgba(14,165,233,0.6)] sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent"
            />

            <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
              Ready when you are
            </p>
            <h2
              id="cta-title"
              className="relative mx-auto mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
            >
              Bring your counter into focus.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300">
              Open the dashboard to explore the workspace, or jump straight into
              the point of sale and run a test invoice in under a minute.
            </p>

            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-brand-950 shadow-xl shadow-orange-500/25 transition-colors duration-200 hover:bg-orange-400 sm:w-auto"
              >
                Open the dashboard
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("pos")}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10 sm:w-auto"
              >
                <ScanLine className="h-4 w-4 text-sky-300" aria-hidden="true" />
                Start a sale
              </button>
            </div>

            <p className="relative mt-6 text-xs text-slate-400">
              No sign-up · Camera optional · Runs against your own MongoDB
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
