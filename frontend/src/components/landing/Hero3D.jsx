import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

const HeroScene = lazy(() => import("./HeroScene"));

const BARS = [
  [7, 82], [3, 64], [9, 92], [4, 58], [3, 74], [8, 96], [4, 62],
  [6, 86], [3, 56], [9, 90], [4, 70], [7, 94], [3, 60], [5, 78],
  [8, 88], [3, 54], [6, 72], [4, 84], [9, 96], [3, 58], [7, 80],
  [5, 68], [3, 76], [8, 92], [4, 60], [6, 86], [3, 52], [9, 90],
  [4, 72], [7, 82], [5, 64], [3, 88],
];

function canUseLiveScene() {
  if (typeof window === "undefined") return false;
  if (window.navigator?.connection?.saveData) return false;

  try {
    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2") || probe.getContext("webgl");
    if (!gl) return false;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(
      debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER)
    );
    gl.getExtension("WEBGL_lose_context")?.loseContext();

    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function BarcodeLines() {
  return (
    <div aria-hidden="true" className="flex h-16 items-end gap-[3px]">
      {BARS.map(([width, height], index) => (
        <span
          key={index}
          className="rounded-[1px] bg-slate-900"
          style={{ width: `${width}px`, height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function StaticInvoice({ animated = false }) {
  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.28),transparent_65%)] blur-2xl" />
      <div className="relative -rotate-2 overflow-hidden rounded-[24px] border border-white/15 bg-white p-5 shadow-[0_35px_90px_-30px_rgba(14,165,233,0.65)] sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M3 5h2v14H3V5Zm4 0h1v14H7V5Zm3 0h3v14h-3V5Zm5 0h1v14h-1V5Zm3 0h2v14h-2V5Z" />
              </svg>
            </span>
            <div>
              <p className="font-display text-sm font-bold text-slate-900">
                Barcode Suite
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Invoice #INV-2048
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-orange-500 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-brand-950">
            PAID
          </span>
        </div>

        <div className="mt-5 space-y-2.5 border-t border-slate-200 pt-4">
          {[
            ["Aashirvaad Atta 5kg", "₹285"],
            ["Amul Butter 500g", "₹265"],
          ].map(([label, price]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="truncate text-xs text-slate-600">{label}</span>
              <span className="font-mono text-xs font-semibold text-slate-800">
                {price}
              </span>
            </div>
          ))}
        </div>

        <div className="relative mt-4 overflow-hidden rounded-xl bg-slate-50 px-4 py-3">
          <BarcodeLines />
          <p className="mt-2 text-center font-mono text-[10px] tracking-[0.35em] text-slate-500">
            8901234567890
          </p>
          {animated ? (
            <span className="landing-scanline pointer-events-none absolute inset-x-3 h-[2px] bg-sky-400/90 shadow-[0_0_12px_3px_rgba(56,189,248,0.65)]" />
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Total amount
            </p>
            <p className="font-display text-xl font-bold text-slate-900">
              ₹550.00
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Invoice saved
          </span>
        </div>
      </div>

      <div className="absolute -right-4 -top-6 hidden rotate-6 rounded-xl border border-white/10 bg-[#0b2340]/95 px-3.5 py-3 shadow-xl shadow-sky-950/40 backdrop-blur sm:block">
        <p className="text-[10px] uppercase tracking-wider text-sky-300">
          Today
        </p>
        <p className="font-display text-lg font-bold text-white">₹42,890</p>
        <p className="text-[10px] font-medium text-emerald-400">+18.2% vs yesterday</p>
      </div>

      <div className="absolute -bottom-10 -left-6 hidden -rotate-3 items-center gap-2 rounded-xl border border-white/10 bg-[#0b2340]/95 px-3.5 py-2.5 shadow-xl shadow-sky-950/40 backdrop-blur sm:flex">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-[11px] font-semibold text-white">Scan detected</p>
          <p className="font-mono text-[10px] text-slate-400">0.4s · 2 items</p>
        </div>
      </div>
    </div>
  );
}

class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export default function Hero3D() {
  const reducedMotion = usePrefersReducedMotion();
  const container = useRef(null);
  const [inView, setInView] = useState(false);
  const [liveSceneAvailable, setLiveSceneAvailable] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setLiveSceneAvailable(false);
      return undefined;
    }

    let cancelled = false;
    const check = () => {
      if (!cancelled) setLiveSceneAvailable(canUseLiveScene());
    };
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(check, { timeout: 1200 })
      : window.setTimeout(check, 350);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, [reducedMotion]);

  useEffect(() => {
    const node = container.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const showScene = inView && liveSceneAvailable && !reducedMotion;

  return (
    <div
      ref={container}
      aria-hidden="true"
      className="relative flex h-[400px] w-full items-center justify-center sm:h-[480px] lg:h-[560px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.22),transparent_62%)] blur-2xl sm:h-[520px] sm:w-[520px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-8 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"
      />

      {showScene ? (
        <SceneBoundary fallback={<StaticInvoice animated />}>
          <Suspense
            fallback={
              <div className="w-full px-6">
                <StaticInvoice animated />
              </div>
            }
          >
            <div className="absolute inset-0">
              <HeroScene />
            </div>
          </Suspense>
        </SceneBoundary>
      ) : (
        <StaticInvoice animated={!reducedMotion} />
      )}
    </div>
  );
}
