import { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import { ToastProvider } from "./components/ui/ToastProvider";
import Dashboard from "./pages/Dashboard";
import PointOfSale from "./pages/PointOfSale";
import Transactions from "./pages/Transactions";

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

function getPageFromHash() {
  const page = window.location.hash.replace(/^#\/?/, "");
  return PAGES[page] ? page : "dashboard";
}

function App() {
  const [page, setPage] = useState(getPageFromHash);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", handleHashChange);
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#/dashboard");
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = useCallback((next) => {
    if (!PAGES[next]) return;
    setPage(next);
    setSidebarOpen(false);
    if (window.location.hash !== `#/${next}`) {
      window.location.hash = `#/${next}`;
    }
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!event.altKey || event.ctrlKey || event.metaKey) return;
      const destination = SHORTCUTS[event.key];
      if (destination) {
        event.preventDefault();
        navigate(destination);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const meta = PAGES[page];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50">
        <a
          href="#main-content"
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
            className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
          >
            {page === "dashboard" ? <Dashboard onNavigate={navigate} /> : null}
            {page === "pos" ? <PointOfSale /> : null}
            {page === "transactions" ? (
              <Transactions onNavigate={navigate} />
            ) : null}

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
