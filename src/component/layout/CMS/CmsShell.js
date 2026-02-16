"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Loading from "@/component/common/Loading";

export default function CmsShell({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const isAuthPage = [
    '/pages/auth/login',
    '/pages/auth/unauthorized',
  ].includes(pathname);

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

  if (!hasMounted) {
    return <Loading loading={!hasMounted} message="Loading data..." />;
  }

  // Kalo auth page, render children aja tanpa shell
  if (isAuthPage) {
    return (
      <>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </>
    );
  }

  // Render normal dengan shell
  return (
    <>
      <div className="d-flex min-vh-100 bg-light position-relative">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div 
          className="flex-grow-1 d-flex flex-column" 
          style={{ 
            minWidth: 0,
            // ✅ Add margin untuk push content ke kanan pas desktop
            marginLeft: typeof window !== 'undefined' && isSidebarOpen && window.innerWidth >= 992 ? '260px' : '0',
            transition: 'margin-left 0.3s ease-in-out',
            width: '100%'
          }}
        >
          <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

          <main className="p-4 flex-grow-1" style={{ 
            overflow: 'auto',
            maxWidth: '100%'
          }}>
            {children}
          </main>

          <Footer />
        </div>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}