"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const company = localStorage.getItem("company");
    const branch = localStorage.getItem("branch");
    const batch = localStorage.getItem("batch");
    const cgpa = localStorage.getItem("cgpa");
    if (token) setUser({ token, role, name, company, branch, batch, cgpa });
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("name", userData.name);
    localStorage.setItem("company", userData.company || "");
    localStorage.setItem("branch", userData.branch || "");
    localStorage.setItem("batch", userData.batch || "");
    localStorage.setItem("cgpa", userData.cgpa || "");
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}