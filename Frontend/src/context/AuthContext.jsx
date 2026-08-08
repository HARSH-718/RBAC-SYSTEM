import { createContext, useContext, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

function AuthProvider({ children }) {
const storedUser = localStorage.getItem("user");

const [user, setUser] = useState(() => {
  try {
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    localStorage.removeItem("user");
    return null;
  }
});

  // Login Function
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      return true;
    } catch (error) {
  console.log("Full Error:", error);
  console.log("Message:", error.message);
  console.log("Response:", error.response);
  console.log("Request:", error.request);
  return false;
}
  };

  // Logout Function
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;