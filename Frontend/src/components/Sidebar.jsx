import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      roles: ["super_admin", "admin", "user"],
    },
    {
      title: "Users",
      path: "/users",
      icon: <FiUsers />,
      roles: ["super_admin", "admin"],
    },
    {
      title: "Roles",
      path: "/roles",
      icon: <FiShield />,
      roles: ["super_admin", "admin"],
    },
    {
      title: "Permissions",
      path: "/permissions",
      icon: <FiKey />,
      roles: ["super_admin"],
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <FiUser />,
      roles: ["super_admin", "admin", "user"],
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-[#0B1220] flex flex-col z-40 transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5 relative">
          <div className="w-10 h-10 rounded-lg bg-[#3454D1] flex items-center justify-center text-white shrink-0">
            <FiShield size={18} />
          </div>

          <div className="min-w-0">
            <h2 className="text-white font-display font-semibold text-base leading-tight truncate">
              RBAC
            </h2>
            <span className="text-slate-500 text-[11px] truncate block">
              Permission System
            </span>
          </div>

          <button
            className="ml-auto text-slate-400 hover:text-white transition-colors lg:hidden"
            onClick={onClose}
            type="button"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 px-3 py-5 overflow-y-auto">
          {menuItems
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#3454D1] text-white shadow-sm shadow-[#3454D1]/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <span className="text-[17px]">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>
            ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;