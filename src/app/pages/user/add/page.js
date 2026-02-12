"use client";

import { useState, useCallback, useEffect } from "react";
import Input from "@/component/common/Input";
import Button from "@/component/common/Button";
import DropDown from "@/component/common/Dropdown";
import { useRouter } from "next/navigation";
import { API_LINK } from "@/lib/constant";
import fetchData from "@/lib/fetch";
import Toast from "@/component/common/Toast";
import Breadcrumb from "@/component/common/Breadcrumb";
import withAuth from "@/component/withAuth";
import SweetAlert from "@/component/common/SweetAlert";

const maxLengthRules = {
    username: 30,
    name: 100,
}

function AddUserPage() {
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        roleId: "",
    });
    const [dataRoleList, setDataRoleList] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();

    useEffect (() => {
        const fetchRoleList = async () => {
            try{
                const response = await fetchData(
                    API_LINK + "User/GetList",
                    {},
                    "GET"
                );

                if(response.error){
                    throw new Error(response.message);
                }

                const dataJson = response.data || [];

                const mappedData = dataJson.map((item) => ({
                    Value: item.id,
                    Text: item.name,
                }));

                setDataRoleList(mappedData);
            }catch(err){
                Toast.error(err.message || "Failed to fetch role list.");
            }
        };

        fetchRoleList();
    },[]);

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
        const requiredFields = {
            username: "Username is required.",
            name: "Name is required.",
            roleId: "Role is required.",
        };

        for (const [field, message] of Object.entries(requiredFields)) {
            const value = formData[field];
            if (!value || (typeof value === "string" && !value.trim())) {
                newErrors[field] = message;
            }
        }

        if (formData.username) {
            const username = formData.username.trim();

            const usernameRegex = /^(?!\.)(?!.*\.\.)([a-z0-9\.]{4,20})(?<!\.)$/;

            if (!usernameRegex.test(username)) {
                newErrors.username =
                    "Username must be 4-20 characters, lowercase letters, numbers, dot only. No leading/trailing dot or double dots.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);


    const reset = useCallback(() => {
        setFormData({
            username: "",
            name: "",
            roleId: "",
        });
    },[]);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            if (!validateForm()) {
                Toast.error("Please fill in all required fields.");
                return;
            }

            setLoading(true);

            try {
                const response = await fetchData(
                    API_LINK + "User/CreateUser",
                    formData,
                    "POST"
                );

                if (!response.error) {
                    const { username, passwordHash } = response.data.data;

                    try {
                        await navigator.clipboard.writeText(passwordHash);
                    } catch (copyErr) {
                        console.warn("Clipboard copy failed:", copyErr);
                    }

                    await SweetAlert({
                        title: "User Credentials",
                        text:
                            `Username: ${username}\n\n` +
                            `Temporary Password: ${passwordHash}\n\n` +
                            `Password has been automatically copied to clipboard.\n` +
                            `Please store it securely and inform the user.\n` +
                            `User must change password on first login.`,
                        icon: "info"
                    });

                    reset();
                    router.push("/pages/user");
                } else {
                    Toast.error(response.message || "Error occurred while creating user.");
                }
            } catch (err) {
                Toast.error("Failed to create user! " + err.message);
            } finally {
                setLoading(false);
            }
        },
        [validateForm, formData, router, reset]
    );


    const handleCancel = useCallback(() => {
        reset();
        router.back();
    }, [reset, router]);

    return(
        <>
        <Breadcrumb
            title="Add User"
            items={[
            { label: "Users Management", href: "/pages/user" },
            { label: "Add user"},
            ]}
        />
        <div className="card border-0 shadow-lg">
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-lg-4">
                            <DropDown
                            arrData={dataRoleList}
                            label="Role"
                            name="roleId"
                            id="roleId"
                            value={formData.roleId}
                            onChange={handleChange}
                            error={errors.roleId}
                            />
                        </div>
                        <div className="col-lg-4">
                            <Input
                            label="Username"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                            maxLength={maxLengthRules.username}
                            />
                        </div>
                        <div className="col-lg-4">
                            <Input
                            label="Full Name"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            maxLength={maxLengthRules.name}
                            />
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="d-flex justify-content-end gap-2">
                            <Button
                                classType="secondary"
                                label="Cancel"
                                onClick={handleCancel}
                                type="button"
                                isDisabled={loading}
                            />
                            <Button
                                classType="success"
                                iconName={loading ? "" : "save"}
                                label={loading ? "Saving..." : "Save"}
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
};

export default withAuth(AddUserPage, ["Super-Admin"]);