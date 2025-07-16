import { createContext, useState, useContext, useEffect } from "react";
import { clearCache } from "../utils/useCachedFetch";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      return { token, userId };
    }
    return null;
  });

  const isLoggedIn = Boolean(user && user.token);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userId", userData.userId);

    // Clear and refresh any cached data
    clearCache(["dashboardData", "profileData", "plantData"]);

    // Notify components that a login occurred
    window.dispatchEvent(new Event("login"));
  };

const logout = () => {
  setUser(null);
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  clearCache([
    "habitData",
    "habitData_at",
    "dashboardData",
    "profileData",
    "plantData",
  ]);

  window.dispatchEvent(new Event("logout"));
};

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}