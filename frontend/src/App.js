import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Loader2, ScanBarcode } from "lucide-react";
import Landing from "./pages/Landing";
import { useAuth } from "./components/auth/AuthProvider";

const Workspace = lazy(() => import("./components/layout/Workspace"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

const WORKSPACE_PAGES = {
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

const AUTH_PAGES = new Set(["login", "signup"]);

const PAGE_TITLES = {
  home: "Barcode Suite | Barcode billing, POS & live retail analytics",
  login: "Sign in | Barcode Suite",
  signup: "Create account | Barcode Suite",
};

const SHORTCUTS = {
  1: "dashboard",
  2: "pos",
  3: "transactions",
};

function parseRoute() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [rawPath, rawQuery = ""] = raw.split("?");
  const page = (rawPath || "home").toLowerCase();
  const params = new URLSearchParams(rawQuery);
  const nextParam = params.get("next");
  const next = WORKSPACE_PAGES[nextParam] ? nextParam : null;

  if (page === "" || page === "home" || page === "landing") {
    return { page: "home", next: null };
  }
  if (WORKSPACE_PAGES[page] || AUTH_PAGES.has(page)) {
    return { page, next };
  }
  return { page: "home", next: null };
}

function AppLoading({ label }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-900/20">
        <ScanBarcode className="h-6 w-6 text-white" aria-hidden="true" />
      </span>
      <p
        role="status"
        className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        {label}
      </p>
    </div>
  );
}

function App() {
  const { status } = useAuth();
  const [route, setRoute] = useState(parseRoute);
  const { page, next } = route;

  const authLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const handleHashChange = () => setRoute(parseRoute());
    window.addEventListener("hashchange", handleHashChange);
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#/");
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.title =
      PAGE_TITLES[page] ||
      (WORKSPACE_PAGES[page]
        ? `${WORKSPACE_PAGES[page].title} | Barcode Suite`
        : PAGE_TITLES.home);
  }, [page]);

  const navigate = useCallback((destination, options = {}) => {
    const isHome = destination === "home";
    const isKnown =
      isHome || Boolean(WORKSPACE_PAGES[destination]) || AUTH_PAGES.has(destination);
    if (!isKnown) return;

    const nextRoute =
      options.next && WORKSPACE_PAGES[options.next] ? options.next : null;
    const hash = `${isHome ? "#/" : `#/${destination}`}${
      nextRoute ? `?next=${nextRoute}` : ""
    }`;

    if (window.location.hash !== hash) {
      if (options.replace) {
        window.history.replaceState(null, "", hash);
      } else {
        window.location.hash = hash;
      }
    }

    setRoute({ page: destination, next: nextRoute });

    if (options.scroll !== false) {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }, []);

  // Keep the URL and the visible screen in sync with the session state.
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated && WORKSPACE_PAGES[page]) {
      navigate("login", { replace: true, next: page, scroll: false });
      return;
    }

    if (isAuthenticated && AUTH_PAGES.has(page)) {
      navigate(next || "dashboard", { replace: true, scroll: false });
    }
  }, [authLoading, isAuthenticated, page, next, navigate]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isAuthenticated || !WORKSPACE_PAGES[page]) return;
      if (!event.altKey || event.ctrlKey || event.metaKey) return;

      const destination = SHORTCUTS[event.key];
      if (destination) {
        event.preventDefault();
        navigate(destination);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated, navigate, page]);

  if (authLoading) {
    return <AppLoading label="Checking your session…" />;
  }

  // A guest opened a workspace URL: show sign-in with the intended route.
  if (!isAuthenticated && WORKSPACE_PAGES[page]) {
    const destination = page;
    return (
      <Suspense fallback={<AppLoading label="Loading sign in…" />}>
        <Login
          next={destination}
          onNavigate={navigate}
          onSuccess={() =>
            navigate(destination, { replace: true, scroll: false })
          }
        />
      </Suspense>
    );
  }

  if (isAuthenticated && AUTH_PAGES.has(page)) {
    return <AppLoading label="Opening your workspace…" />;
  }

  if (page === "login" || page === "signup") {
    const AuthPage = page === "login" ? Login : Signup;
    return (
      <Suspense
        fallback={
          <AppLoading
            label={page === "login" ? "Loading sign in…" : "Loading sign up…"}
          />
        }
      >
        <AuthPage
          next={next}
          onNavigate={navigate}
          onSuccess={() => navigate(next || "dashboard", { replace: true })}
        />
      </Suspense>
    );
  }

  if (page === "home") {
    return <Landing onNavigate={navigate} />;
  }

  return (
    <Suspense fallback={<AppLoading label="Loading workspace…" />}>
      <Workspace
        page={page}
        meta={WORKSPACE_PAGES[page]}
        onNavigate={navigate}
      />
    </Suspense>
  );
}

export default App;
