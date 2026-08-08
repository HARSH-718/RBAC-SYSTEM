import DashboardCard from "../components/DashboardCard";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";
import LatestUsers from "../components/LatestUsers";
import { FiUsers, FiKey, FiUserCheck, FiShield } from "react-icons/fi";
import "./Dashboard.css";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState({
  totalUsers: 0,
  totalRoles: 0,
  totalPermissions: 0,
  activeUsers: 0,
});
  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const response = await getDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchDashboard();
}, []);

  return (
    <div className="dashboard">
   <h1>Welcome back, {user?.name} 👋</h1>

      <div className="cards">

        <DashboardCard
          title="Total Users"
         value={dashboard.totalUsers}
          icon={<FiUsers />}
          color="#2563eb"
        />

        <DashboardCard
          title="Total Roles"
         value={dashboard.totalRoles}
          icon={<FiShield />}
          color="#46c215"
        />

       <DashboardCard
  title="Permissions"
value={dashboard.totalPermissions}
  icon={<FiKey />}
  color="#dc2626"
/>

        <DashboardCard
          title="Active Users"
         value={dashboard.activeUsers}
          icon={<FiUserCheck />}
          color="#16a34a"
        />

      </div>

      <RecentActivity />

      <QuickActions />

      <LatestUsers />

    </div>
  );
}

export default Dashboard;