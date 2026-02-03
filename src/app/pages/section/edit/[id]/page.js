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
  sectionName: 55,
}

const initialFormData = {
  id: 0,
  sectionName: "",
  createdBy: 1,
};

export default function EditSectionPage() {
  const path = useParams();
  const router = useRouter();
  const id = decryptIdUrl(path.id);
  const [formData, setFormData] = useState(initialFormData);
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

      if (response) {
        setFormData(prev => ({
          ...prev,
          id: id,
          sectionName: response.sectionName || "",
        }));
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

  return <div>Edit section page for ID: {path.id}</div>;
}
