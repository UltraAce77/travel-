import { createContext, useContext, useState, useCallback } from "react";
import { api, isOk } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  });

  const persist = useCallback((tok, usr) => {
    if (tok) localStorage.setItem("authToken", tok);
    else localStorage.removeItem("authToken");
    if (usr) localStorage.setItem("authUser", JSON.stringify(usr));
    else localStorage.removeItem("authUser");
    setToken(tok || null);
    setUser(usr || null);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await api("post", "/login", { email, password }, { timeout: 60000, retries: 1 });
      if (res?.data?.token) {
        persist(res.data.token, res.data.user);
        return { ok: true, user: res.data.user };
      }
      return { ok: false, message: res?.message || "Invalid email or password" };
    },
    [persist]
  );

  const register = useCallback(async (payload) => {
    const res = await api("post", "/register", payload);
    return { ok: isOk(res), message: res?.message || "Registration failed" };
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user?.id) return null;
    const res = await api("get", "/user/", { id: user.id });
    if (res?.data?.user) {
      const merged = { ...user, ...res.data.user };
      persist(token, merged);
      return { records: res.data.user, treks: res.data.treks };
    }
    return null;
  }, [user, token, persist]);

  const logout = useCallback(() => persist(null, null), [persist]);

  const value = {
    token,
    user,
    role: user?.role,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    refreshUser,
    setUser: (u) => persist(token, u),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
