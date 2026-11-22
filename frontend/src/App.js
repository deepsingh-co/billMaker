import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import Landing from "./pages/Landing";

const Workspace = lazy(() => import("./components/layout/Workspace"));

const PAGES = {
  dashboard: {
    title: "Sales dashboard",
    subtitle: "Live overview of store performance",
  },
  pos: {
    title: "Point of sale",
    subtitle: "Scan products and generate invoices",
  },
  transactions: {
    title: "Transactions",
    subtitle: "Search and review every recorded bill",
  },
};

const SHORTCUTS = {
  1: "dashboard",
  2: "pos",
  3: "transactions",
};

function WorkspaceLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600"
      />
      <p role="status" className="text-sm font-medium text-slate-500">
        Loading workspace…
      </p>
    </div>
  );
}

function getPageFromHash() {
  const page = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  if (page === "" || page === "home" || page === "landing") return "home";
  return PAGES[page] ? page : "home";
}

function App() {
  const [page, setPage] = useState(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", handleHashChange);
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#/");
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.title =
      page === "home"
        ? "Barcode Suite | Barcode billing, POS & live retail analytics"
        : `${PAGES[page].title} | Barcode Suite`;
  }, [page]);

  const navigate = useCallback((next) => {
    const destination = next === "home" ? "home" : PAGES[next] ? next : null;
    if (!destination) return;

    setPage(destination);

    const hash = destination === "home" ? "#/" : `#/${destination}`;
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (page === "home") return;
      if (!event.altKey || event.ctrlKey || event.metaKey) return;
      const destination = SHORTCUTS[event.key];
      if (destination) {
        event.preventDefault();
        navigate(destination);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, page]);

  if (page === "home") {
    return <Landing onNavigate={navigate} />;
  }

  return (
    <Suspense fallback={<WorkspaceLoading />}>
      <Workspace page={page} meta={PAGES[page]} onNavigate={navigate} />
    </Suspense>
  );
}

export default App;
