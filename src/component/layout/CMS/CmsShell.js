// /src/component/layout/cms/CmsShell.jsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function CmsShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto close sidebar di mobile, auto open di desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex min-vh-100 bg-light position-relative">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        <Navbar onToggleSidebar={toggleSidebar} />

        <main className="p-4 flex-grow-1">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}