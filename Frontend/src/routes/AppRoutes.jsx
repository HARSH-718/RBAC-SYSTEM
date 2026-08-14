import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Roles from "../pages/Roles";
import Permissions from "../pages/Permissions";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";

import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard
            Super Admin + Admin + User */}
        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute
              allowedRoles={["super_admin", "admin", "user"]}
            >
              <Dashboard />
            </RoleProtectedRoute>
          }
        />

        {/* Users
            Super Admin + Admin */}
        <Route
          path="/users"
          element={
            <RoleProtectedRoute
              allowedRoles={["super_admin", "admin"]}
            >
              <Users />
            </RoleProtectedRoute>
          }
        />

        {/* Roles
            Super Admin + Admin */}
        <Route
          path="/roles"
          element={
            <RoleProtectedRoute
              allowedRoles={["super_admin", "admin"]}
            >
              <Roles />
            </RoleProtectedRoute>
          }
        />

        {/* Permissions
            Only Super Admin */}
        <Route
          path="/permissions"
          element={
            <RoleProtectedRoute
              allowedRoles={["super_admin"]}
            >
              <Permissions />
            </RoleProtectedRoute>
          }
        />

        {/* Profile
            All logged-in users */}
        <Route
          path="/profile"
          element={
            <RoleProtectedRoute
              allowedRoles={["super_admin", "admin", "user"]}
            >
              <Profile />
            </RoleProtectedRoute>
          }
        />
      </Route>

      {/* Unauthorized */}
      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* Not Found */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default AppRoutes;