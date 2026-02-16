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
import { useAuth } from "@/context/AuthContext";

const maxLengthRules = {
  contentName: 55,
}

function AddContentPage() {
  const { user, getToken } = useAuth();
  const [formData, setFormData] = useState({
    tleId: "",
    contentName: "",
    contentLink: "",
    createdBy: user?.userId
  });
  const [file, setFile] = useState(null);

  const [dataTitleList, setDataTitleList] = useState([]);
  const [type, setType] = useState("News");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchTitleList = async () => {
      try{
        const response = await fetchData(
          API_LINK + "Content/GetList",
          {},
          "GET"
        );

        if(response.error){
          throw new Error(response.message);
        }

        const dataJson = response.data || [];

        const mappedData = dataJson.map((item) => ({
          Type: item.additional,
          Value: item.id,
          Text: item.name,
        }));

        setDataTitleList(mappedData);
      }catch(err){
        Toast.error(err.message || "Failed to fetch title list.");
      }
    };

    fetchTitleList();
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "tleId") {
        const selectedTitle = dataTitleList.find(
          (item) => item.Value === Number(value)
        );

        if (selectedTitle?.Type) {
          setType(selectedTitle.Type);
        }
      }

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [dataTitleList, errors]
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      const maxSize = 5 * 1024 * 1024;
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      
      if (selectedFile.size > maxSize) {
        Toast.error("File size exceeds 5MB limit");
        return;
      }
      
      if (!allowedTypes.includes(selectedFile.type)) {
        Toast.error("Only PDF and image files are allowed");
        return;
      }
    }
    
    setFile(selectedFile || null);
  };



  const validateForm = useCallback(() => {
    const newErrors = {};
    const requiredFields = {
      tleId: "Title is required.",
      contentName: "Content name is required.",
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      const value = formData[field];
      if (!value || (typeof value === "string" && !value.trim())) {
        newErrors[field] = message;
      }
    }

    if (type !== "News") {
      const link = formData.contentLink?.trim();
      
      if (!link) {
        newErrors.contentLink = "Content link is required.";
      } else {
        const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        
        if (!urlRegex.test(link)) {
          newErrors.contentLink = "Please enter a valid URL";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, type]);

  const reset = useCallback(() => {
    setFormData({
      tleId: "",
      contentName: "",
      contentLink: "",
    });
    setFile(null);
    setType("News");
  }, []);

  const uploadFile = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetchData(
      API_LINK + "Content/UploadFileContent",
      fd,
      "POST",
      true
    );

    if (res.error) {
      throw new Error(res.message || "Upload file failed");
    }

    return res;
  };



  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        Toast.error("Please fill in all required fields.");
        return;
      }

      setLoading(true);

      try {
        let finalLink = formData.contentLink;

        if (type === "News" && file) {
          const uploadResponse = await uploadFile(file);

          if(uploadResponse.error){
            throw new Error(uploadResponse.message)
          }

          finalLink = uploadResponse.data;
        }

        const payload = {
          ...formData,
          contentLink: finalLink ?? ""
        };

        console.log("Payload: ", payload);

        const res = await fetchData(
          API_LINK + "Content/CreateContent",
          payload,
          "POST"
        );

        if (!res.error) {
          Toast.success(res.message || "Content created successfully.");
          reset();
          setFile(null);
          router.push("/pages/content");
        } else {
          Toast.error(res.message || "Error occured while creating content.");
        }
      } catch (err) {
        Toast.error(err.message || "Failed to create content!");
      } finally {
        setLoading(false);
      }
    },
    [validateForm, formData, file, type, router, reset]
  );


  const handleCancel = useCallback(() => {
    reset();
    router.back();
  }, [reset, router]);

  return (
    <>
      <Breadcrumb
        title="Add Content"
        items={[
          { label: "Contents Management", href: "/pages/content" },
          { label: "Add Content"},
        ]}
      />
      <div className="card border-0 shadow-lg">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-4">
                { dataTitleList.length > 0 &&
                  <DropDown
                  arrData={dataTitleList}
                  label="Title"
                  name="tleId"
                  id="tleId"
                  value={formData.tleId ?? ""}
                  onChange={handleChange}
                  error={errors.tleId}
                />
                }
              </div>
              <div className="col-lg-4">
                <Input
                  label="Content Name"
                  name="contentName"
                  id="contentName"
                  value={formData.contentName ?? ""}
                  onChange={handleChange}
                  error={errors.contentName}
                  maxLength={maxLengthRules.contentName}
                />
              </div>
              <div className="col-lg-4">
                {type === "News" ? (
                  <Input
                    label="Attach File (Optional)"
                    type="file"
                    onChange={handleFileChange}
                  />
                ) : (
                  <Input
                    label="Content Link"
                    name="contentLink"
                    id="contentLink"
                    value={formData.contentLink ?? ""}
                    onChange={handleChange}
                    error={errors.contentLink}
                  />
                )}
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

export default withAuth(AddContentPage, ["Content-Editor", "Super-Admin"]);
