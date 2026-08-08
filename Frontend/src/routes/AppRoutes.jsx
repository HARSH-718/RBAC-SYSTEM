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

      {/* Protected Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute permission="dashboard">
              <Dashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <RoleProtectedRoute permission="users">
              <Users />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/roles"
          element={
            <RoleProtectedRoute permission="roles">
              <Roles />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/permissions"
          element={
            <RoleProtectedRoute permission="permissions">
              <Permissions />
            </RoleProtectedRoute>
          }
        />
        <Route
  path="/profile"
  element={
    <ProtectedRoute permission="dashboard">
      <Profile />
    </ProtectedRoute>
  }
/>

      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;