import { useEffect, useRef } from "react";
import LandingNav from "../components/landing/LandingNav";
import Hero from "../components/landing/Hero";
import FeatureGrid from "../components/landing/FeatureGrid";
import Workflow from "../components/landing/Workflow";
import DashboardPreview from "../components/landing/DashboardPreview";
import CtaBand from "../components/landing/CtaBand";
import LandingFooter from "../components/landing/LandingFooter";

function skipToContent(event) {
  event.preventDefault();
  const main = document.getElementById("landing-main");
  if (!main) return;
  main.focus({ preventScroll: true });
  main.scrollIntoView({ behavior: "auto", block: "start" });
}

export default function Landing({ onNavigate }) {
  const progress = useRef(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progress.current) {
        progress.current.style.transform = `scaleX(${value})`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050b18] font-sans text-slate-200 selection:bg-sky-400/30 selection:text-white">
      <a
        href="#landing-main"
        onClick={skipToContent}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900"
      >
        Skip to content
      </a>

      <div
        ref={progress}
        aria-hidden="true"
        style={{ transform: "scaleX(0)" }}
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-sky-400 via-sky-300 to-orange-400"
      />

      <LandingNav onNavigate={onNavigate} />

      <main id="landing-main" tabIndex={-1} className="outline-none">
        <Hero onNavigate={onNavigate} />
        <FeatureGrid />
        <Workflow onNavigate={onNavigate} />
        <DashboardPreview onNavigate={onNavigate} />
        <CtaBand onNavigate={onNavigate} />
      </main>

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
