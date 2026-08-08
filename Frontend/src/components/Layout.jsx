import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="main-content">
      <Navbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} isOpen={isSidebarOpen} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;