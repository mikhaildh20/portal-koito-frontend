"use client";

import { useState, useCallback } from "react";
import Input from "@/component/common/Input";
import Button from "@/component/common/Button";
import { useRouter } from "next/navigation";
import { API_LINK } from "@/lib/constant";
import fetchData from "@/lib/fetch";
import Toast from "@/component/common/Toast";
import Breadcrumb from "@/component/common/Breadcrumb";

const maxLengthRules = {
  sectionName: 55,
}

export default function AddSectionPage() {
  const [formData, setFormData] = useState({
    sectionName: "",
    createdBy: 1,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
    const requiredFields = {
      sectionName: "Section name is required.",
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

  const reset = useCallback(() => {
    setFormData({
      sectionName: "",
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
        const data = await fetchData(
          API_LINK + "Section/CreateSection",
          formData,
          "POST"
        );

        if (!data.error) {
          Toast.success(data.messageDetail || "Section created successfully.");
          reset();
          router.push("/pages/section");
        } else {
          Toast.error(data.message || "Error occured while creating section.");
          setLoading(false);
        }
      } catch (err) {
        Toast.error("Failed to create section! " + err.message);
        setLoading(false);
      }
    },
    [validateForm, formData, router, reset]
  );

  const handleCancel = useCallback(() => {
    reset();
    router.back();
  }, [reset, router]);

  return (
  <>
    <Breadcrumb
      title="Add Section"
      items={[
        { label: "Sections Management", href: "/pages/section" },
        { label: "Add Section"},
      ]}
    />
    <div className="card border-0 shadow-lg">
      <div className="card-body p-4"> 
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-4">
              <Input
                label="Section Name"
                name="sectionName"
                id="sectionName"
                value={formData.sectionName}
                onChange={handleChange}
                error={errors.sectionName}
                maxLength={maxLengthRules.sectionName}
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
                    label={loading ? "Menyimpan..." : "Simpan"}
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
