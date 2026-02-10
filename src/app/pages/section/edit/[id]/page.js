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
import withAuth from "@/component/withAuth";

const maxLengthRules = {
  sectionName: 55,
}

function EditSectionPage() {
  const path = useParams();
  const router = useRouter();
  const id = decryptIdUrl(path.id);
  const [formData, setFormData] = useState({
    sectionName: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetchData(
        `${API_LINK}Section/GetSectionDetail/${id}`,
        {},
        "GET"
      );

      const data = response.data;

      if (response) {
        setFormData({
          id: id,
          sectionName: data.sectionName || "",
        });
      } else {
        throw new Error("Section data not found.");
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
          API_LINK + "Section/UpdateSection",
          formData,
          "PUT"
        );

        if (!data.error) {
          Toast.success(data.message || "Section updated successfully.");
          router.push("/pages/section");
        } else {
          Toast.error(data.message || "Error occured while updating section.");
          setLoading(false);
        }
      } catch (err) {
        Toast.error("Failed to update section! " + err.message);
        setLoading(false);
      }
    },
    [validateForm, formData, router]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <>
      <Breadcrumb
        title="Edit Section"
        items={[
          { label: "Sections Management", href: "/pages/section" },
          { label: "Edit Section"},
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

export default withAuth(EditSectionPage, ["Content-Editor"]);