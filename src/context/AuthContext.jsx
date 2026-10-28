import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking");
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .me()
      .then(({ user }) => {
        if (!active) return;
        setUser(user);
        setStatus("signedIn");
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setStatus("signedOut");
      });
    return () => {
      active = false;
    };
  }, []);

  // fired by api.js on a 401
  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setStatus("signedOut");
      setNotice("Your session has expired. Please sign in again.");
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, []);

  const startSession = useCallback(({ user }) => {
    setUser(user);
    setStatus("signedIn");
    setNotice(null);
    return user;
  }, []);

  const login = useCallback((email, password) => api.login(email, password).then(startSession), [startSession]);
  const signup = useCallback((name, email, password) => api.signup(name, email, password).then(startSession), [startSession]);

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    setUser(null);
    setStatus("signedOut");
    setNotice("You've been signed out.");
  }, []);

  const value = useMemo(
    () => ({ user, status, notice, login, signup, logout }),
    [user, status, notice, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
