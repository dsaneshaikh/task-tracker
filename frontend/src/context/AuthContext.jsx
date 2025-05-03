import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await api.get("/auth/me");
          setUser(data);
        }
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/dashboard");
      return data;
    } catch (err) {
      localStorage.removeItem("token");
      throw new Error(err.response?.data?.error || "Login failed");
    }
  };

  const signup = async (userData) => {
    try {
      const { data } = await api.post("/auth/signup", userData);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/dashboard");
      return data;
    } catch (err) {
      localStorage.removeItem("token");
      throw new Error(err.response?.data?.error || "Signup failed");
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
