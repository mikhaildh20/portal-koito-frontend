"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/component/common/Button";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { logout } = useAuth();
  
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
                <h1 className="display-1 fw-bold text-danger mb-3">401</h1>
                <h2 className="h3 fw-semibold mb-3">Unauthorized Access</h2>
                <p className="text-muted mb-4">
                  Sorry, you don't have permission to access this page. Please
                  ensure you're logged in with the appropriate credentials.
                </p>

                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button
                    classType="outline-secondary px-4"
                    iconName="arrow-left"
                    label="Go Back"
                    onClick={() => router.push("/pages")}
                  />
                  
                  <Button
                    classType="danger px-4"
                    iconName="house-door"
                    label="Logout"
                    onClick={logout}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}