import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  // Login nahi hai
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // User ka role allowed nahi hai
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Access allowed
  return children;
}

export default RoleProtectedRoute;