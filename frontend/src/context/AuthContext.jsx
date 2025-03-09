import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setUser(res.data.user))
        .catch(() => logout());
    }
  }, []);

  const login = async (credentials) => {
    try {
      const res = await API.post("/user/login", credentials);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      toast.success("Login Successful");
      navigate(res.data.user.userType === "ADMIN" ? "/admin" : "/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged Out");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
