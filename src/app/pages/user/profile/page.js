"use client";

import { useState, useCallback } from "react";
import Input from "@/component/common/Input";
import Button from "@/component/common/Button";
import { useRouter } from "next/navigation";
import { API_LINK } from "@/lib/constant";
import fetchData from "@/lib/fetch";
import Toast from "@/component/common/Toast";
import Breadcrumb from "@/component/common/Breadcrumb";
import withAuth from "@/component/withAuth";
import { useAuth } from "@/context/AuthContext";
import Label from "@/component/common/Label";

const maxLengthRules = {
    username: 30,
    name: 100,
    password: 50,
};

function ProfilePage() {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        username: user?.username || "",
        name: user?.name || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const router = useRouter();

    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));

            if (errors[name]) {
                setErrors((prev) => ({ ...prev, [name]: "" }));
            }
        },
        [errors]
    );

    const validateForm = useCallback(() => {
        const newErrors = {};

        // Jangan validate username dan name kalo force === 1
        if (user?.force !== 1) {
            // Validate username
            if (!formData.username || !formData.username.trim()) {
                newErrors.username = "Username is required.";
            } else {
                const username = formData.username.trim();
                const usernameRegex = /^(?!\.)(?!.*\.\.)([a-z0-9\.]{4,20})(?<!\.)$/;

                if (!usernameRegex.test(username)) {
                    newErrors.username =
                        "Username must be 4-20 characters, lowercase letters, numbers, dot only. No leading/trailing dot or double dots.";
                }
            }

            if (!formData.name || !formData.name.trim()) {
                newErrors.name = "Name is required.";
            }
        }

        if (!formData.currentPassword || !formData.currentPassword.trim()) {
            newErrors.currentPassword = "Current password is required.";
        }

        if (showPasswordFields) {
            if (!formData.newPassword || !formData.newPassword.trim()) {
                newErrors.newPassword = "New password is required.";
            } else if (formData.newPassword.length < 8) {
                newErrors.newPassword = "Password must be at least 8 characters.";
            }

            if (!formData.confirmPassword || !formData.confirmPassword.trim()) {
                newErrors.confirmPassword = "Password confirmation is required.";
            } else if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match.";
            }
        } else if (user?.force === 1) {
            // Kalo force === 1, password change wajib
            newErrors.newPassword = "You must change your password.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, showPasswordFields, user?.force]);

    const reset = useCallback(() => {
        setFormData({
            username: user?.username || "",
            name: user?.name || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setShowPasswordFields(false);
    }, [user]);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            if (!validateForm()) {
                Toast.error("Please fill in all required fields correctly.");
                return;
            }

            setLoading(true);

            try {
                const payload = {
                    username: formData.username,
                    name: formData.name,
                    currentPassword: formData.currentPassword,
                };

                if (showPasswordFields && formData.newPassword) {
                    payload.newPassword = formData.newPassword;
                }

                const response = await fetchData(
                    API_LINK + "User/UpdateProfile",
                    payload,
                    "PUT"
                );

                console.log(response);

                if (!response.error) {
                    Toast.success(response.message);

                    login(response.token, response.user);

                    reset();
                    router.push("/pages");
                } else {
                    Toast.error(response.message || "Error occurred while updating profile.");
                }
            } catch (err) {
                Toast.error("Failed to update profile! " + err.message);
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        },
        [validateForm, formData, showPasswordFields, router, reset, user, login]
    );

    const handleCancel = useCallback(() => {
        if (user?.force === 1) {
            Toast.warning("You must change your password before continuing.");
            return;
        }
        reset();
        router.back();
    }, [reset, router, user?.force]);

    return (
        <>
            <Breadcrumb
                title="Edit Profile"
                items={[
                    { label: "Preview", href: "/pages" },
                    { label: "Edit Profile" },
                ]}
            />
            
            {user?.force === 1 && (
                <div className="alert alert-warning border-0 shadow-sm mb-4" role="alert">
                    <div className="d-flex align-items-start">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="me-3 flex-shrink-0"
                        >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <div>
                            <h6 className="alert-heading mb-1">Password Change Required</h6>
                            <p className="mb-0">
                                You must change your password before accessing other features. 
                                Please check the "I want to change my password" option below and set a new secure password.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="card border-0 shadow-lg">
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-lg-6">
                                <Input
                                    label="Username"
                                    name="username"
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    error={errors.username}
                                    maxLength={maxLengthRules.username}
                                    disabled={user?.force === 1}
                                />
                            </div>
                            <div className="col-lg-6">
                                <Input
                                    label="Full Name"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                    maxLength={maxLengthRules.name}
                                    disabled={user?.force === 1}
                                />
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-12">
                                <hr />
                                <h6 className="mb-3">Security Settings</h6>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-6">
                                <Input
                                    label="Current Password"
                                    name="currentPassword"
                                    id="currentPassword"
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    error={errors.currentPassword}
                                    helpText="Required to save any changes"
                                    maxLength={maxLengthRules.password}
                                />
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="changePassword"
                                        checked={showPasswordFields}
                                        onChange={(e) => {
                                            setShowPasswordFields(e.target.checked);
                                            if (!e.target.checked) {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    newPassword: "",
                                                    confirmPassword: "",
                                                }));
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    newPassword: "",
                                                    confirmPassword: "",
                                                }));
                                            }
                                        }}
                                    />
                                    <Label 
                                        text="I want to change my password" 
                                        required={user?.force === 1}
                                    />
                                </div>
                            </div>
                        </div>

                        {showPasswordFields && (
                            <div className="row mt-3">
                                <div className="col-lg-6">
                                    <Input
                                        label="New Password"
                                        name="newPassword"
                                        id="newPassword"
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        error={errors.newPassword}
                                        helpText="Minimum 8 characters"
                                        maxLength={maxLengthRules.password}
                                    />
                                </div>
                                <div className="col-lg-6">
                                    <Input
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        error={errors.confirmPassword}
                                        helpText="Re-enter your new password"
                                        maxLength={maxLengthRules.password}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="row mt-4">
                            <div className="col-12">
                                <div className="d-flex justify-content-end gap-2">
                                    {user?.force !== 1 && (
                                        <Button
                                            classType="secondary"
                                            label="Cancel"
                                            onClick={handleCancel}
                                            type="button"
                                            isDisabled={loading}
                                        />
                                    )}
                                    <Button
                                        classType="success"
                                        iconName={loading ? "" : "save"}
                                        label={loading ? "Saving..." : "Save Changes"}
                                        type="submit"
                                        isDisabled={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default withAuth(ProfilePage, ["Super-Admin", "Content-Editor"]);