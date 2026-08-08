import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/HasPermission";
import {
  FiHome,
  FiUsers,
  FiShield,
  FiKey,
  FiUser,
  FiX,
} from "react-icons/fi";

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <FiHome />,
      permission: "dashboard",
    },
    {
      title: "Users",
      path: "/users",
      icon: <FiUsers />,
      permission: "users",
    },
    {
      title: "Roles",
      path: "/roles",
      icon: <FiShield />,
      permission: "roles",
    },
    {
      title: "Permissions",
      path: "/permissions",
      icon: <FiKey />,
      permission: "permissions",
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <FiUser />,
      permission: "profile",
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
        ></div>
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <FiShield />
          </div>

          <div className="logo-text">
            <h2>RBAC</h2>
            <span>Permission System</span>
          </div>

          <button className="sidebar-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems
            .filter((item) => hasPermission(user, item.permission))
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
                onClick={onClose}
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;