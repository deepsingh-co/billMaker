import { lazy, Suspense, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ToastProvider } from "../ui/ToastProvider";

const Dashboard = lazy(() => import("../../pages/Dashboard"));
const PointOfSale = lazy(() => import("../../pages/PointOfSale"));
const Transactions = lazy(() => import("../../pages/Transactions"));

function PageLoading() {
  return (
    <div
      role="status"
      className="flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card"
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600"
      />
      <p className="text-sm font-medium text-slate-500">Loading workspace…</p>
    </div>
  );
}

export default function Workspace({ page, meta, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (next) => {
    setSidebarOpen(false);
    onNavigate(next);
  };

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
            <Suspense fallback={<PageLoading />}>
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
