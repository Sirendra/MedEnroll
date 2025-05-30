import { useEffect, useState } from "react";
import { authContext as AuthContext } from "./authContext";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
      try {
        const decoded = jwtDecode(token);
        const userData = {
          userId: decoded.userId,
          fullName: decoded.fullName,
        };
        setUser(userData);
      } catch (err) {
        console.error("Invalid token:", err);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("token");
        if (
          location.pathname !== "/login" &&
          location.pathname !== "/register"
        ) {
          navigate("/login");
        }
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      if (location.pathname !== "/login" && location.pathname !== "/register") {
        navigate("/login");
      }
    }

    setLoading(false);
  }, [navigate, location.pathname]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    try {
      const decoded = jwtDecode(token);
      setUser({
        userId: decoded.userId,
        fullName: decoded.fullName,
      });
    } catch {
      setUser(null);
    }
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
