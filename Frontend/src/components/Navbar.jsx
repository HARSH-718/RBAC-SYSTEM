import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiBell, FiLogOut, FiShield, FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

function Navbar({ onMenuClick, isOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="flex lg:hidden cursor-pointer items-center justify-center w-9 h-9 rounded-lg text-slate-600 transition-colors duration-150 hover:bg-slate-100 shrink-0"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <div className="w-9 h-9 rounded-lg bg-[#3454D1] flex items-center justify-center text-white shrink-0 transition-transform duration-200 hover:scale-105">
          <FiShield size={16} />
        </div>

        <div className="min-w-0 hidden sm:block">
          <h2 className="font-display font-semibold text-slate-900 text-sm leading-tight truncate">
            RBAC System
          </h2>
          <span className="text-slate-500 text-xs truncate block">
            Role Based Access Control
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          type="button"
          className="relative flex cursor-pointer items-center justify-center w-9 h-9 rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <FiBell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>

        <div className="hidden sm:flex cursor-default items-center gap-2.5 pl-3 border-l border-slate-200">
          <FaUserCircle className="text-slate-300" size={32} />
          <div className="min-w-0 leading-tight">
            <h4 className="text-sm font-semibold text-slate-900 truncate">
              {user?.name}
            </h4>
            <span className="text-xs text-slate-500 truncate block">
              {user?.role}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-[#3454D1] text-white text-sm font-semibold transition-all duration-200 hover:bg-[#2c46b3] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#3454D1]/25 active:translate-y-0"
          onClick={handleLogout}
        >
          <FiLogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;