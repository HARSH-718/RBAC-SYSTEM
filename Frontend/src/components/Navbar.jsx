import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiBell, FiLogOut, FiShield } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";


function Navbar({ onMenuClick, isOpen }) {
  const { user } = useAuth();
  const navigate = useNavigate();
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate("/");
};
  return (
    
    <header className="navbar">
      <div className="navbar-brand">
        <button
          className={`menu-btn ${isOpen ? "active" : ""}`}
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <div className="menu-line"></div>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </button>

        <div className="logo-box">
          <FiShield />
        </div>

        <div className="brand-text">
          <h2>RBAC System</h2>
          <span>Role Based Access Control</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="notification">
          <FiBell />
          <span className="dot"></span>
        </div>

        <div className="user-profile">
          <FaUserCircle className="avatar" />
          <div className="user-details">
            <h4>{user?.name}</h4>
            <span>{user?.role}</span>
          </div>
        </div>

     <button
  className="logout-btn"
  onClick={handleLogout}
>
  <FiLogOut />
  <span>Logout</span>
</button>
      </div>
    </header>
  );
}

export default Navbar;
