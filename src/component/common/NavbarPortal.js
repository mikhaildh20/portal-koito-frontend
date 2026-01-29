"use client";

import Image from "next/image";

export default function NavbarPortal() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger sticky-top shadow">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <Image
            src="/images/logoKoito.png" 
            alt="Logo"
            width={36}
            height={36}
            priority
          />
          <span className="fw-semibold">Portal Internal</span>
        </a>
      </div>
    </nav>
  );
}
