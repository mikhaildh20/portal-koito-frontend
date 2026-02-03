export default function FooterPortal() {
  return (
    <footer className="bg-light border-top mt-auto">
      <div className="container py-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        {/* Left */}
        <div className="text-muted small">
          © {new Date().getFullYear()} <strong>Portal PIK</strong>. All rights reserved.
        </div>

        {/* Right */}
        <div className="text-muted small">
          Version <strong>1.0.0</strong> · Developed by Mikhail — Intern, Astra Polytechnic
        </div>
      </div>
    </footer>
  );
}
