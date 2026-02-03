"use client";

export default function Footer() {
  return (
    <footer className="bg-white border-top py-3 px-4 mt-auto">
      <div className="d-flex justify-content-between align-items-center">
        <span className="text-muted small">
          © {new Date().getFullYear()} <strong>Portal PIK</strong>. All rights reserved.
        </span>
        <span className="text-muted small">
          Developed by Mikhail — Intern, Astra Polytechnic
        </span>
      </div>
    </footer>
  );
}