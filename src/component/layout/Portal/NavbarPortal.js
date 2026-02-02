"use client";

import Image from "next/image";

export default function NavbarPortal() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div className="container py-2" style={{ maxWidth: '1400px' }}>
        <div className="navbar-brand d-flex align-items-center gap-3">
          <Image
            src="/images/logoKoito.png"
            alt="Logo"
            width={100}
            height={40}
            priority
          />
          <span className="fw-bold text-dark fs-5">
            Indonesia Koito Portal Site
          </span>
        </div>
      </div>
    </nav>
  );
}