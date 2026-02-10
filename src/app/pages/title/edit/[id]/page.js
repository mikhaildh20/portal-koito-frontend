"use client";

import { useState, useCallback, useEffect } from "react";
import Input from "@/component/common/Input";
import Button from "@/component/common/Button";
import DropDown from "@/component/common/Dropdown";
import { useRouter, useParams } from "next/navigation";
import { API_LINK } from "@/lib/constant";
import fetchData from "@/lib/fetch";
import Toast from "@/component/common/Toast";
import Breadcrumb from "@/component/common/Breadcrumb";
import { decryptIdUrl } from "@/lib/encryptor";
import withAuth from "@/component/withAuth";

const maxLengthRules = {
  titleName: 55,
}

function EditTitlePage() {
  const path = useParams();
  const id = decryptIdUrl(path.id);
  const [formData, setFormData] = useState({
    secId: "",
    titleName: "",
    titleType: "",
  });
  const [dataSectionList, setDataSectionList] = useState({});

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const dataType = [
    { Value: "News", Text: "News" },
    { Value: "Link", Text: "Link" },
  ];

  const loadData = useCallback(async () => {
    try{
      setLoading(true);

      const response = await fetchData(
        `${API_LINK}Title/GetTitleDetail/${id}`,
        {},
        "GET"
      );

      const data = response.data;

      if(response){
        setFormData({
          id: id,
          secId: data.secId || "",
          titleName: data.titleName || "",
          titleType: data.titleType || "",
        });
      }else{
        throw new Error("Title data not found.");
      }
    }catch(err){
      Toast.error("Failed to load data: " + err.message);
      router.back();
    }finally{
      setLoading(false);
    }
  },[id, router]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, loadData]);

  useEffect(() => {
    const fetchSectionList = async () => {
      try{
        const response = await fetchData(
          API_LINK + "Title/GetList",
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

        setDataSectionList(mappedData);
      }catch(err){
        Toast.error(err.message || "Failed to fetch section list.");
      }
    };

    fetchSectionList();
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
          API_LINK + "Title/UpdateTitle",
          formData,
          "PUT"
        );

        if (!data.error) {
          Toast.success(data.message || "Title updated successfully.");
          router.push("/pages/title");
        } else {
          Toast.error(data.message || "Error occured while updating title.");
          setLoading(false);
        }
      } catch (err) {
        Toast.error("Failed to update title! " + err.message);
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
        title="Edit Title"
        items={[
          { label: "Titles Management", href: "/pages/title" },
          { label: "Edit Title"},
        ]}
      />
      <div className="card border-0 shadow-lg">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-4">
                <DropDown
                  arrData={dataSectionList}
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

export default withAuth(EditTitlePage, ["Content-Editor"]);