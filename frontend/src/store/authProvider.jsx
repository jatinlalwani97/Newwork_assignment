import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Authentication Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load persisted auth on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          setToken(parsed.token);
          setUser(parsed.user || null);
        }
      }
    } catch (_) {
      // ignore corrupt storage
    }
    setIsInitializing(false);
  }, []);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  const login = (authToken, userData) => {
    setToken(authToken);
    setUser(userData || null);
    try {
      localStorage.setItem("auth", JSON.stringify({ token: authToken, user: userData || null }));
    } catch (_) {
      // storage may fail in private mode; continue without persistence
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem("auth");
    } catch (_) {
      // ignore
    }
  };

  return <AuthContext.Provider value={{ isAuthenticated, isInitializing, token, user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
