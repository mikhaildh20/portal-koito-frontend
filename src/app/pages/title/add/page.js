"use client";

import { useState, useCallback } from "react";
import Input from "@/component/common/Input";
import Button from "@/component/common/Button";
import DropDown from "@/component/common/Dropdown";
import { useRouter } from "next/navigation";
import { API_LINK } from "@/lib/constant";
import fetchData from "@/lib/fetch";
import Toast from "@/component/common/Toast";
import Breadcrumb from "@/component/common/Breadcrumb";

const maxLengthRules = {
  titleName: 55,
}

export default function AddTitlePage() {
  const [formData, setFormData] = useState({
    secId: "",
    titleName: "",
    titleType: "",
    createdBy: 1,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const dataType = [
    { value: "News", Text: "News" },
    { value: "Link", Text: "Link" },
  ];

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
      secId: "Section is required.",
      titleName: "Title name is required.",
      titleType: "Title type is required.",
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
      secId: "",
      titleName: "",
      titleType: "",
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
          API_LINK + "Title/CreateTitle",
          formData,
          "POST"
        );

        if (!data.error) {
          Toast.success(data.message || "Title created successfully.");
          reset();
          router.push("/pages/title");
        } else {
          Toast.error(data.message || "Error occured while creating title.");
          setLoading(false);
        }
      } catch (err) {
        Toast.error("Failed to create title! " + err.message);
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
        items={[
          { label: "Titles Management", href: "/pages/title" },
          { label: "Add Title"},
        ]}
      />
      <div className="card border-0 shadow-lg">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-4">
                <DropDown
                  arrData={[]}
                  label="Section"
                  name="secId"
                  id="secId"
                  value={formData.secId}
                  onChange={handleChange}
                  error={errors.secId}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  label="Title Name"
                  name="titleName"
                  id="titleName"
                  value={formData.titleName}
                  onChange={handleChange}
                  error={errors.titleName}
                  maxLength={maxLengthRules.titleName}
                />
              </div>
              <div className="col-lg-4">
                <DropDown
                  arrData={dataType}
                  label="Title Type"
                  name="titleType"
                  id="titleType"
                  value={formData.titleType}
                  onChange={handleChange}
                  error={errors.titleType}
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
