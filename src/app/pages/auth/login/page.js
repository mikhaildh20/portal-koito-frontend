'use client';

import { useState } from 'react';
import Image from "next/image";
import Input from '@/component/common/Input';
import Button from '@/component/common/Button';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', formData);
      setIsLoading(false);
      // Add your login logic here
    }, 1500);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h4 className="fw-bold mb-2">Portal PIK</h4>
                  <div className="mb-3">
                    <Image
                      src="/images/logoKoito.png"
                      alt="Koito"
                      width={120}
                      height={32}
                      priority
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <p className="text-muted">Content Management System</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <Input
                      label="Username"
                      value={formData.username}
                      placeholder="Username"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <Input
                      label="Password"
                      value={formData.password}
                      placeholder="Password"
                      type="password"
                      onChange={handleChange}
                    />
                  </div>
                  <Button
                      classType="success w-100 py-2 fw-semibold"
                      iconName={isLoading ? "" : "login"}
                      label={isLoading ? "Logging..." : "Login"}
                      type="submit"
                      isDisabled={isLoading}
                  />

                </form>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-muted mt-4 small">
              © {new Date().getFullYear()} <strong>Portal PIK</strong>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}