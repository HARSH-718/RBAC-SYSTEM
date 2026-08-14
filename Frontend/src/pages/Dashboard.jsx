import DashboardCard from "../components/DashboardCard";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";
import LatestUsers from "../components/LatestUsers";

import { FiUsers, FiKey, FiUserCheck, FiShield, FiArrowUpRight } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

import { getDashboard } from "../services/dashboardService";
import { getRoles } from "../services/roleService";

function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalRoles: 0,
    totalPermissions: 0,
    activeUsers: 0,
  });

  // =========================
  // FETCH DASHBOARD
  // =========================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        setDashboard(response.data);
      } catch (error) {
        console.log("Dashboard error:", error);
      }
    };

    fetchDashboard();
  }, []);

  // =========================
  // USER PERMISSION COUNT
  // =========================
  const [permissionCount, setPermissionCount] = useState(0);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const response = await getRoles();
        const roles = response.data || [];

        const userRole =
          typeof user?.role === "object" ? user?.role?.name : user?.role;

        const currentRole = roles.find((role) => role.name === userRole);
        const count = currentRole?.permissions?.length || 0;

        setPermissionCount(count);
      } catch (error) {
        console.log("Permission count error:", error);
      }
    };

    if (user?.role) {
      fetchUserPermissions();
    }
  }, [user]);

  // =========================
  // CARDS
  // =========================
  const cards = [
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      icon: FiUsers,
      color: "#3454D1",
      trend: "+4.2%",
    },
    {
      title: "Total Roles",
      value: dashboard.totalRoles,
      icon: FiShield,
      color: "#0EA5A0",
      trend: "+1.1%",
    },
    {
      title: "Permissions",
      value: permissionCount,
      icon: FiKey,
      color: "#E11D48",
      trend: "+0.6%",
    },
    {
      title: "Active Users",
      value: dashboard.activeUsers,
      icon: FiUserCheck,
      color: "#16A34A",
      trend: "+2.8%",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome banner */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 px-6 py-8 sm:px-10 sm:py-10 shadow-lg shadow-black/20 transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-black/30">
        {/* grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] transition-opacity duration-300 group-hover:opacity-[0.09]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* soft glow accent that follows hover */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                {user?.name || "Admin"}
              </span>{" "}
              <span className="inline-block transition-transform duration-300 group-hover:rotate-12">
                👋
              </span>
            </h1>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              Here&apos;s what&apos;s happening across your workspace today.
            </p>
          </div>

          {/* <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400/50 hover:bg-slate-800 hover:text-white hover:shadow-lg hover:shadow-indigo-500/10 active:translate-y-0"
          >
            View Reports
            <FiArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button> */}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={card.title}
            className="group cursor-pointer animate-fade-in-up rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/20 focus-within:-translate-y-1.5"
            style={{
              animationDelay: `${i * 80}ms`,
              animationFillMode: "backwards",
            }}
            tabIndex={0}
          >
            <DashboardCard {...card} />
          </div>
        ))}
      </div>

      {/* Recent Activity + Latest Users */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-5 xl:col-span-2">
          <RecentActivity />
          <LatestUsers />
        </div>

        <QuickActions />
      </div>
    </div>
  );
}

export default Dashboard;