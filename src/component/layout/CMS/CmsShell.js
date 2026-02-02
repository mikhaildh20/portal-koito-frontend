// /src/component/layout/cms/CmsShell.jsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function CmsShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const handleResize = () => {
      if (window.innerWidth < 992) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Jangan render UI sampai client mount
  if (!hasMounted) return null;

  return (
    <div className="d-flex min-vh-100 bg-light position-relative">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-4 flex-grow-1">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
