"use client";

import { useState, useCallback, useEffect } from "react";
import Input from "@/component/common/Input";
import Button from "@/component/common/Button";
import { useRouter, useParams } from "next/navigation";
import { API_LINK } from "@/lib/constant";
import fetchData from "@/lib/fetch";
import Toast from "@/component/common/Toast";
import Breadcrumb from "@/component/common/Breadcrumb";
import { decryptIdUrl } from "@/lib/encryptor";

const maxLengthRules = {
  roleName: 30,
  roleDesc: 100,
}

export default function EditRolePage() {
  const path = useParams();
  const router = useRouter();
  const id = decryptIdUrl(path.id);
  const [formData, setFormData] = useState({
    roleName: "",
    roleDesc: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetchData(
        `${API_LINK}Role/GetRoleDetail/${id}`,
        {},
        "GET"
      );

      const data = response.data;

      if (response) {
        setFormData({
          id: id,
          roleName: data.roleName || "",
          roleDesc: data.roleDesc || ""
        });
      } else {
        throw new Error("Role data not found.");
      }
    } catch (err) {
      Toast.error("Failed to load data: " + err.message);
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, loadData]);

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
      roleName: "Role name is required.",
      roleDesc: "Role desc is required",
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      const value = formData[field];
      if (!value || (typeof value === "string" && !value.trim())) {
        newErrors[field] = message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  },[formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        Toast.error("Please fill in all required fields.");
        return;
      }

      setLoading(true);

      try {
        const data = await fetchData(
          API_LINK + "Role/UpdateRole",
          formData,
          "PUT"
        );

        if (!data.error) {
          Toast.success(data.message || "Role updated successfully.");
          router.push("/pages/role");
        } else {
          Toast.error(data.message || "Error occured while updating role.");
          setLoading(false);
        }
      } catch (err) {
        Toast.error("Failed to update role! " + err.message);
        setLoading(false);
      }
    },
    [validateForm, formData, router]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return(
    <>
    <Breadcrumb
      title="Edit Role"
      items={[
        { label: "Roles Management", href: "/pages/role" },
        { label: "Edit Role"},
      ]}
    />
    <div className="card border-0 shadow-lg">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-4">
              <Input
                label="Role Name"
                name="roleName"
                id="roleName"
                value={formData.roleName}
                onChange={handleChange}
                error={errors.roleName}
                maxLength={maxLengthRules.roleName}
              />
            </div>
            <div className="col-lg-4">
              <Input
                label="Role Desc"
                name="roleDesc"
                id="roleDesc"
                value={formData.roleDesc}
                onChange={handleChange}
                error={errors.roleDesc}
                maxLength={maxLengthRules.roleDesc}
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
}
