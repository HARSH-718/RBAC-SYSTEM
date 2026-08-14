import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      localStorage.removeItem("user");
      return null;
    }
  });

  // Latest Permissions Update karne ka Function
const fetchLatestUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const response = await api.get("/auth/me");

    const updatedUser = response.data.user;

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  } catch (error) {
    console.log("Fetch user error:", error);

    if (error.response?.status === 401) {
      logout();
    }
  }
};

  // Jab application render ho, live DB sync run karo
  useEffect(() => {
    fetchLatestUser();
  }, []);

  // Check Permission Helper Function for Frontend Components
  const hasPermission = (permissionName) => {
    if (!user || !user.permissions) return false;
    // SuperAdmin ke paas sabhi rights
    if (user.role === "super_admin") return true; 

    return user.permissions.some(
      (perm) => perm.name === permissionName || perm === permissionName
    );
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return true;
    } catch (error) {
      console.log("Login Error:", error);
      return false;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasPermission,
        refreshPermissions: fetchLatestUser, // Agar button click/route change par permissions reload karni ho
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;