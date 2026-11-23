import { ScanBarcode } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

const PRODUCT_LINKS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "pos", label: "Point of sale" },
  { id: "transactions", label: "Transactions" },
];

const SECTION_LINKS = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it works" },
  { id: "preview", label: "Product tour" },
];

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

export default function LandingFooter({ onNavigate }) {
  const { isAuthenticated } = useAuth();

  const accountLinks = isAuthenticated
    ? [{ id: "dashboard", label: "Open dashboard" }]
    : [
        { id: "login", label: "Sign in" },
        { id: "signup", label: "Create account" },
      ];

  return (
    <footer className="border-t border-white/10 bg-[#040a14]">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-600">
                <ScanBarcode className="h-4 w-4 text-white" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                  Retail OS
                </p>
                <p className="font-display text-base font-bold leading-tight text-white">
                  Barcode Suite
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Barcode billing, point of sale and live sales analytics for
              independent retailers. Scan a product, close the sale and
              understand the day.
            </p>
          </div>

          <nav aria-label="Product links">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Product
            </p>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.id)}
                    className="cursor-pointer text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Landing page links">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {SECTION_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className="cursor-pointer text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account links">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Account
            </p>
            <ul className="mt-4 space-y-2.5">
              {accountLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.id)}
                    className="cursor-pointer text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Barcode Suite. Built for the
            counter.
          </p>
          <p className="font-mono">React · Three.js · Express · MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
