"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Paging from "@/component/common/Paging";
import Table from "@/component/common/Table";
import Toast from "@/component/common/Toast";
import DropDown from "@/component/common/Dropdown";
import Formsearch from "@/component/common/Formsearch";
import { useRouter } from "next/navigation";
import fetchData from "@/lib/fetch";
import { API_LINK } from "@/lib/constant";
import { encryptIdUrl } from "@/lib/encryptor";
import SweetAlert from "@/component/common/SweetAlert";
import Breadcrumb from "@/component/common/Breadcrumb";

export default function ContentPage() {
  const router = useRouter();
  const [dataContent, setDataContent] = useState([]);
  const [dataContentRaw, setDataContentRaw] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState({});
  const [loading, setLoading] = useState(false);
  const sortRef = useRef();
  const statusRef = useRef();
  const orderCacheRef = useRef({});
  const [orderVersion, setOrderVersion] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const dataFilterSort = [
    { Value: "tle_name asc", Text: "Title Name [↑]" },
    { Value: "tle_name desc", Text: "Title Name [↓]" },
    { Value: "cte_name asc", Text: "Content Name [↑]" },
    { Value: "cte_name desc", Text: "Content Name [↓]" },
    { Value: "cte_status asc", Text: "Content Status [↑]" },
    { Value: "cte_status desc", Text: "Content Status [↓]" },
    { Value: "cte_order asc", Text: "Content Order [↑]" },
    { Value: "cte_order desc", Text: "Content Order [↓]" },
  ];

  const dataFilterStatus = [
    { Value: "1", Text: "Active" },
    { Value: "0", Text: "Inactive" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(dataFilterSort[0].Value);
  const [sortStatus, setSortStatus] = useState(dataFilterStatus[0].Value);

  const loadData = useCallback(async (page, sort, cari, status) => {
    try{
      setLoading(true);

      const response = await fetchData(
        API_LINK + "Content/GetAllContent",
        {
          Status: status,
          ...(cari === "" ? {} : { Search: cari }),
          Urut: sortBy,
          PageNumber: page,
          PageSize: pageSize,
        },
        "GET"
      );

      console.log(response);

      setDataContentRaw(response.Data || []);

      if(response.error){
        throw new Error(response.message);
      }

      const {data, totalData} = response;

      const pagedData = data.map((item, index) => ({
        No: (page - 1) * pageSize + index + 1,
        id: item.id,
        Title: item.titleName,
        Content: item.contentName,
        Status: item.contentStatus === 1 ? "Active" : "Inactive",
        Order: item.contentOrder,
        Action: ["Edit", "Toggle"],
        Alignment: ["center", "center", "center", "center", "center"]
      }))

      setDataContent(pagedData || []);
      setTotalData(totalData || 0);
      setCurrentPage(page);
    }catch (err){
      Toast.error(err.message || "Failed to load data");
      setDataContent([]);
      setTotalData(0);
    }finally{
      setLoading(false);
    }
  }, [pageSize]);

  const handleSearch = useCallback((query) => {
      setSearch(query);
      loadData(1, sortBy, query, sortStatus);
  },[sortBy, sortStatus, loadData]);

  const handleFilterApply = useCallback(() => {
      const newSortBy = sortRef.current.value;
      const newStatus = statusRef.current.value;

      setSortBy(newSortBy);
      setSortStatus(newStatus);
      setCurrentPage(1);
      loadData(1, newSortBy, search, newStatus);
  }, [search, loadData]);

  const handleNavigation = useCallback((page) => {
      loadData(page, sortBy, search, sortStatus);
  },[sortBy, search, sortStatus, loadData]);

  const handleAdd = useCallback(() => {
      router.push("/pages/content/add");
  }, [router]);

  const handleEdit = useCallback(
    (id) =>
    router.push(`/pages/content/edit/${encryptIdUrl(id)}`),
    [router]
  );

  const handleToggle = useCallback(
        async (id) => {

        const content = dataContentRaw.find(item => item.id === id);
        const isActive = content?.contentStatus === 1;
        
        if (isActive) {
            const result = await SweetAlert({
                title: "Disable Content",
                text: "Are you sure you want to disable this content?",
                icon: "warning",
                confirmText: "Yes, disable it!",
            });

            if (!result) return;
        }

        setLoading(true);

        try {
            const data = await fetchData(
            API_LINK + "Content/SetActive",
            {
                id: id,
            },
            "POST"
            );

            if (data.error) {
            throw new Error(data.message);
            }

            Toast.success(data.message || "Content status updated successfully");
            loadData(1, sortBy, search, sortStatus);
        } catch (err) {
            Toast.error(err.message);
        } finally {
            setLoading(false);
        }
        },
        [sortBy, search, sortStatus, loadData, dataContentRaw]
    );

    useEffect(() => {
        setIsClient(true);

        // if (!ssoData) {
        //     Toast.error("Sesi anda habis. Silakan login kembali.");
        //     router.push("./auth/login");
        //     return;
        // }

        loadData(1, sortBy, search, sortStatus);
    },[router, loadData, search, sortBy, sortStatus]);

    const filterContent = useMemo(
      () => (
      <>
          <DropDown
          ref={sortRef}
          arrData={dataFilterSort}
          type="choose"
          label="Sorting"
          forInput="sortBy"
          defaultValue={sortBy}
          />
          <DropDown
          ref={statusRef}
          arrData={dataFilterStatus}
          type="choose"
          label="Status"
          forInput="sortStatus"
          defaultValue={sortStatus}
          />
      </>
      ),
      [sortBy, sortStatus]
    );

  return (
    <>
      <Breadcrumb
        title="Content Management"
        items={[]}
      />
      <div>
        <Formsearch
            onSearch={handleSearch}
            onAdd={handleAdd}
            onFilter={handleFilterApply}
            searchPlaceholder="Search content data"
            addButtonText="Add"
            showExportButton={false}
            filterContent={filterContent}
        />
      </div>
      <div className="row align-items-center g-3">
        <div className="col-12">
            <Table
                size="Small"
                data={dataContent}
                onEdit={handleEdit}
                onToggle={handleToggle}
            />
            {totalData > 0 && (
                <Paging
                    pageSize={pageSize}
                    pageCurrent={currentPage}
                    totalData={totalData}
                    navigation={handleNavigation}
                />
            )}
        </div>
    </div>
    </>
  );
}
