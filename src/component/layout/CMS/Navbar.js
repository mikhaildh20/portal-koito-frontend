// /src/component/layout/cms/Navbar.jsx
"use client";

import SweetAlert from "@/component/common/SweetAlert";
import toast from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  const username = user?.username?.toUpperCase() || "";

  const initials = username
    .split(" ")
    .filter(Boolean)
    .map(word => word[0])
    .slice(0, 2)
    .join("");


  const handleLogout = async (e) => {
    const result = await SweetAlert({
      title: "Logout",
      text: "Are you sure want to logout?",
      icon: "warning",
      confirmText: "Yes, please."
    });

    if(!result) return;

    logout();
    toast.success("Logout successfully.");
  };

  return (
    <nav 
      className="navbar navbar-light bg-white border-bottom px-4 sticky-top"
      style={{ 
        boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
        zIndex: 1030
      }}
    >
      <div className="d-flex align-items-center gap-3">
        {/* Hamburger Button - Styled */}
        <button
          className="btn btn-light border-0"
          onClick={onToggleSidebar}
          style={{
            width: "40px",
            height: "40px",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        <div className="d-flex align-items-center gap-2">
          <Image
            src="/images/logoKoito.png"
            alt="Koito"
            width={100}
            height={32}
            priority
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* User Info */}
        <div className="d-none d-md-flex align-items-center gap-3">
          <div className="text-end">
            <div className="fw-semibold" style={{ fontSize: "0.875rem" }}>{username}</div>
            <small className="text-muted">{user?.role}</small>
          </div>
          <div 
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px", fontSize: "0.875rem", fontWeight: "600" }}
          >
            {initials || "?"}
          </div>
        </div>

        {/* Divider */}
        <div className="vr d-none d-md-block" style={{ height: "40px" }}></div>

        {/* Logout Button - Styled */}
        <button 
          className="btn btn-outline-danger btn-sm"
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1.25rem",
            borderRadius: "6px",
            fontWeight: "500",
            transition: "all 0.2s ease"
          }}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="me-1"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
}