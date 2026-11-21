import { ArrowRight, ReceiptText, ScanBarcode, TrendingUp } from "lucide-react";
import Reveal from "./Reveal";

const STEPS = [
  {
    number: "01",
    icon: ScanBarcode,
    title: "Scan the product",
    description:
      "Open the point of sale and point the camera at a barcode — or type the digits. The product loads in a fraction of a second.",
  },
  {
    number: "02",
    icon: ReceiptText,
    title: "Generate the invoice",
    description:
      "Adjust quantities, check the running total and confirm. The bill is stored with server-validated line items and totals.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Read the store",
    description:
      "Revenue, average bill and top products update immediately, so the dashboard reflects the day as it happens.",
  },
];

export default function Workflow({ onNavigate }) {
  return (
    <section
      id="how-it-works"
      aria-labelledby="workflow-title"
      className="relative scroll-mt-24 border-t border-white/5 py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent"
      />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
            Workflow
          </p>
          <h2
            id="workflow-title"
            className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Scanner to store intelligence, in three steps.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            No setup wizards and no hardware lock-in. If the machine has a
            camera and a browser, your counter is ready.
          </p>
        </Reveal>

        <div className="relative mt-14">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.number} delay={index * 0.1}>
                  <article className="relative h-full">
                    <div className="relative flex items-center gap-4">
                      <span className="relative z-10 flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-2xl border border-sky-400/20 bg-[#07182e] shadow-[0_20px_50px_-20px_rgba(14,165,233,0.55)]">
                        <Icon className="h-8 w-8 text-sky-300" aria-hidden="true" />
                        <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-sky-400/30 bg-[#050b18] font-mono text-[10px] font-semibold text-sky-300">
                          {step.number}
                        </span>
                      </span>
                      <h3 className="font-display text-lg font-semibold text-white lg:pt-2">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
                      {step.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal delay={0.15} className="mt-12">
          <button
            type="button"
            onClick={() => onNavigate("pos")}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
          >
            Try the point of sale
            <ArrowRight
              className="h-4 w-4 text-sky-300 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
