import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
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
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#050b18] font-sans text-slate-200 selection:bg-sky-400/30 selection:text-white">
        <a
          href="#landing-main"
          onClick={skipToContent}
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900"
        >
          Skip to content
        </a>

        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
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
    </MotionConfig>
  );
}
