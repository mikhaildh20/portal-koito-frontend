"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarPortal from '@/component/layout/Portal/NavbarPortal';
import FooterPortal from '@/component/layout/Portal/FooterPortal';
import PortalContent from '@/component/layout/Portal/PortalContent';

export default function Home() {
  return (
    <div className="bg-light min-vh-100">
      <NavbarPortal />

      <main className="container py-5" style={{ maxWidth: "1400px" }}>
        <div className="px-3">
          <PortalContent />
        </div>
      </main>

      <FooterPortal />
    </div>
  );
}

