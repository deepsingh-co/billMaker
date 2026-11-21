import {
  ChartColumn,
  ReceiptText,
  ScanBarcode,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Reveal from "./Reveal";

const FEATURES = [
  {
    icon: ScanBarcode,
    title: "Scan or type. Either works.",
    description:
      "Use the device camera for EAN and UPC codes, or fall back to manual entry when the light is low or the label is worn.",
    tag: "Camera + manual",
  },
  {
    icon: ReceiptText,
    title: "Invoice in one pass",
    description:
      "Quantities, line totals and the amount payable stay in sync. The server recalculates every total before a bill is stored.",
    tag: "Validated totals",
  },
  {
    icon: ChartColumn,
    title: "Revenue, live",
    description:
      "Today vs yesterday, a 7 or 30 day revenue trend and the products moving fastest — updated with every sale.",
    tag: "Real-time view",
  },
  {
    icon: Search,
    title: "Every sale, searchable",
    description:
      "Search by invoice number, product name or barcode, filter by date and expand any bill to see its line items.",
    tag: "Instant lookup",
  },
  {
    icon: Zap,
    title: "Built for busy counters",
    description:
      "A keyboard-first workspace with Alt + 1/2/3 shortcuts, optimistic totals and clear feedback on every action.",
    tag: "Alt + 1/2/3",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    description:
      "Barcode Suite talks to your own API and MongoDB instance. No third-party analytics, no customer data leaves your store.",
    tag: "Self-hosted",
  },
];

export default function FeatureGrid() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative scroll-mt-24 border-t border-white/5 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
            Capabilities
          </p>
          <h2
            id="features-title"
            className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Everything the counter needs.
            <span className="text-slate-400"> Nothing it doesn&apos;t.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Two screens do the heavy lifting: a point of sale that keeps up with
            the queue, and a dashboard that tells you what just happened.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={index * 0.06}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-sky-400/30 hover:bg-white/[0.05]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-sky-400/0 blur-2xl transition-all duration-500 group-hover:bg-sky-400/10"
                  />
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/20 to-sky-600/10 text-sky-300 ring-1 ring-inset ring-sky-400/20">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                  <span className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    {feature.tag}
                  </span>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
