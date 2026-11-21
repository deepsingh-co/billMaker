import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import { ToastProvider } from "./components/ui/ToastProvider";
import Landing from "./pages/Landing";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const PointOfSale = lazy(() => import("./pages/PointOfSale"));
const Transactions = lazy(() => import("./pages/Transactions"));

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
    <div
      role="status"
      className="flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card"
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600"
      />
      <p className="text-sm font-medium text-slate-500">
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    const destination =
      next === "home" ? "home" : PAGES[next] ? next : null;
    if (!destination) return;

    setPage(destination);
    setSidebarOpen(false);

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

  const meta = PAGES[page];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50">
        <a
          href="#main-content"
          onClick={(event) => {
            event.preventDefault();
            const main = document.getElementById("main-content");
            if (!main) return;
            main.focus({ preventScroll: true });
            main.scrollIntoView({ behavior: "auto", block: "start" });
          }}
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <Sidebar
          page={page}
          onNavigate={navigate}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="lg:pl-64">
          <Topbar
            title={meta.title}
            subtitle={meta.subtitle}
            onOpenSidebar={() => setSidebarOpen(true)}
            onNewSale={() => navigate("pos")}
          />

          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-[1500px] px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8"
          >
            <Suspense fallback={<WorkspaceLoading />}>
              {page === "dashboard" ? <Dashboard onNavigate={navigate} /> : null}
              {page === "pos" ? <PointOfSale /> : null}
              {page === "transactions" ? (
                <Transactions onNavigate={navigate} />
              ) : null}
            </Suspense>

            <footer className="mt-10 flex flex-col gap-1 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                &copy; {new Date().getFullYear()} Barcode Suite. Retail POS and
                billing workspace.
              </p>
              <p className="font-mono">v1.0 · Local terminal</p>
            </footer>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
