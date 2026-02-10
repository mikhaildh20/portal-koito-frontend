'use client';

import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/component/common/Input';
import Button from '@/component/common/Button';
import toast from 'react-hot-toast';
import fetchData from '@/lib/fetch';
import { API_LINK } from '@/lib/constant';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
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

    try {
      const response = await fetchData(
        API_LINK + "Auth/Login",
        {
          username: formData.username,
          password: formData.password,
        },
        "POST"
      );

      console.log(response);

      if (response.error) {
        toast.error(response.message || "Login failed");
        setIsLoading(false);
        return;
      }

      // Assuming backend returns: { token, userId, username, role }
      const { token, userId, username: userName, role } = response;
      
      login(
        token, 
        {
          userId,
          username: userName,
          role,
        }
      );

      toast.success("Login successful!");
      router.push("/pages");
    } catch (err) {
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
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
                      name="username"
                      value={formData.username}
                      placeholder="Username"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <Input
                      label="Password"
                      name="password"
                      value={formData.password}
                      placeholder="Password"
                      type="password"
                      onChange={handleChange}
                    />
                  </div>
                  
                  <Button
                    classType="success w-100 py-2 fw-semibold"
                    iconName={isLoading ? "" : "box-arrow-in-right"}
                    label={isLoading ? "Logging in..." : "Login"}
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