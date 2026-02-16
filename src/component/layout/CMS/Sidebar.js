// /src/component/layout/cms/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar({ isOpen, onToggle }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const menu = [
    { 
      name: "Preview", 
      path: "/pages",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
      roles: ["Super-Admin", "Content-Editor"]
    },
    { 
      name: "Section", 
      path: "/pages/section",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
      ),
      roles: ["Super-Admin", "Content-Editor"] // Fixed: Added Super-Admin
    },
    { 
      name: "Title", 
      path: "/pages/title",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="9" x2="20" y2="9"></line>
          <line x1="4" y1="15" x2="20" y2="15"></line>
          <line x1="10" y1="3" x2="8" y2="21"></line>
          <line x1="16" y1="3" x2="14" y2="21"></line>
        </svg>
      ),
      roles: ["Super-Admin", "Content-Editor"] // Fixed: Added Super-Admin
    },
    { 
      name: "Content", 
      path: "/pages/content",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      roles: ["Super-Admin", "Content-Editor"] // Fixed: Added Super-Admin
    },
    // { 
    //   name: "Role", 
    //   path: "/pages/role",
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //       <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
    //       <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
    //     </svg>
    //   ),
    //   roles: ["Super-Admin"]
    // },
    { 
      name: "User", 
      path: "/pages/user",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      roles: ["Super-Admin"]
    },
  ];

  // ✅ Filter menu berdasarkan role user
  const visibleMenu = menu.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={onToggle}
        />
      )}

      <aside
        className="bg-dark text-white position-fixed position-lg-relative h-100 d-flex flex-column"
        style={{
          width: "260px",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1050,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)"
        }}
      >
        {/* Header */}
        <div className="p-4 border-bottom border-secondary">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold text-white">Koito</h5>
              <small className="text-secondary">Portal System</small>
            </div>
            
            {/* Close button untuk mobile */}
            <button
              className="btn btn-sm btn-dark d-lg-none"
              onClick={onToggle}
              style={{ 
                width: "32px", 
                height: "32px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Menu - ✅ Hanya tampilkan menu yang sesuai role */}
        <nav className="flex-grow-1 overflow-auto p-3">
          <ul className="nav flex-column gap-1">
            {visibleMenu.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path} className="nav-item">
                  <Link
                    href={item.path}
                    className={`nav-link d-flex align-items-center gap-3 rounded ${
                      isActive
                        ? "bg-danger text-white"
                        : "text-white-50 hover-bg-secondary"
                    }`}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "all 0.2s ease",
                      fontWeight: isActive ? "500" : "400"
                    }}
                    onClick={() => {
                      if (window.innerWidth < 992) {
                        onToggle();
                      }
                    }}
                  >
                    <span style={{ 
                      opacity: isActive ? 1 : 0.7,
                      transition: "opacity 0.2s"
                    }}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-top border-secondary pt-3">
          <div className="text-center pb-3">
            <small className="text-secondary d-block">Version 1.0.0</small>
          </div>
        </div>
      </aside>

      {/* Spacer untuk desktop */}
      {isOpen && (
        <div className="d-none d-lg-block" style={{ width: "260px" }} />
      )}

      <style jsx>{`
        .hover-bg-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
        }
        
        /* Custom scrollbar untuk menu */
        nav::-webkit-scrollbar {
          width: 6px;
        }
        
        nav::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
}