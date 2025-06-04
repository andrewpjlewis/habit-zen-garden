import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Load user data from localStorage on initial render
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      return { token, userId };
    }
    return null;
  });

  const isLoggedIn = Boolean(user && user.token);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userData.userId);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
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