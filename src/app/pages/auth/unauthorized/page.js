"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body text-center p-5">
                {/* Icon */}
                <div className="mb-4">
                  <svg
                    className="text-danger"
                    width="80"
                    height="80"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  </svg>
                </div>

                {/* Error Code */}
                <h1 className="display-1 fw-bold text-danger mb-3">401</h1>

                {/* Title */}
                <h2 className="h3 fw-semibold mb-3">Unauthorized Access</h2>

                {/* Description */}
                <p className="text-muted mb-4">
                  Sorry, you don't have permission to access this page. Please
                  ensure you're logged in with the appropriate credentials.
                </p>

                {/* Action Buttons */}
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <button
                    onClick={() => router.back()}
                    className="btn btn-outline-secondary px-4"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Go Back
                  </button>
                  <a href="/pages" className="btn btn-primary px-4">
                    <i className="bi bi-house-door me-2"></i>
                    Home Page
                  </a>
                  <a href="/pages/auth/login" className="btn btn-success px-4">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Login
                  </a>
                </div>

                {/* Additional Help */}
                <div className="mt-5 pt-4 border-top">
                  <p className="text-muted small mb-2">
                    Need assistance?
                  </p>
                  <a href="/contact" className="text-decoration-none">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}