import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import roles from "../data/roles";

function RoleProtectedRoute({ permission, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const role = user.role.toLowerCase().replace(/\s+/g, "_");

  const hasAccess = roles[role]?.includes(permission);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleProtectedRoute;
