import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  UNAUTHORIZED_EVENT,
} from "../../lib/api";
import {
  clearStoredToken,
  getStoredToken,
  storeToken,
} from "../../lib/tokenStore";

const AuthContext = createContext(null);

const ANONYMOUS = { status: "anonymous", user: null };

export function AuthProvider({ children }) {
  // Only show the session loader when a saved token actually needs checking.
  const [state, setState] = useState(() =>
    getStoredToken() ? { status: "loading", user: null } : ANONYMOUS
  );

  // Restore a saved session once on load, then trust local state.
  useEffect(() => {
    let active = true;
    const token = getStoredToken();

    if (!token) {
      setState(ANONYMOUS);
      return () => {
        active = false;
      };
    }

    getCurrentUser()
      .then((data) => {
        if (!active) return;
        setState({ status: "authenticated", user: data.user });
      })
      .catch(() => {
        if (!active) return;
        clearStoredToken();
        setState(ANONYMOUS);
      });

    return () => {
      active = false;
    };
  }, []);

  // A protected API call returned 401: end the session everywhere.
  useEffect(() => {
    const handleUnauthorized = () => {
      clearStoredToken();
      setState(ANONYMOUS);
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = useCallback(async ({ email, password, remember }) => {
    const data = await loginUser({
      email,
      password,
      remember: Boolean(remember),
    });
    storeToken(data.token, Boolean(remember));
    setState({ status: "authenticated", user: data.user });
    return data.user;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const data = await registerUser({ name, email, password });
    storeToken(data.token, true);
    setState({ status: "authenticated", user: data.user });
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setState(ANONYMOUS);
  }, []);

  const value = useMemo(
    () => ({
      user: state.user,
      status: state.status,
      isAuthenticated: state.status === "authenticated",
      isLoading: state.status === "loading",
      login,
      register,
      logout,
    }),
    [state, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
