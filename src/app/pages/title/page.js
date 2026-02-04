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

export default function TitlePage() {
  const router = useRouter();
  const [dataTitle, setDataTitle] = useState([]);
  const [dataTitleRaw, setDataTitleRaw] = useState([]);
  const [dataOrderMap, setDataOrderMap] = useState({});
  const [loadingOrders, setLoadingOrders] = useState({});
  const [loading, setLoading] = useState(false);
  const orderRef = useRef();
  const sortRef = useRef();
  const statusRef = useRef();
  const [isClient, setIsClient] = useState(false);

  const dataFilterSort = [
    { Value: "sec_name asc", Text: "Section Name [↑]" },
    { Value: "sec_name desc", Text: "Section Name [↓]" },
    { Value: "tle_name asc", Text: "Title Name [↑]" },
    { Value: "tle_name desc", Text: "Title Name [↓]" },
    { Value: "tle_type asc", Text: "Title Type [↑]" },
    { Value: "tle_type desc", Text: "Title Type [↓]" },
    { Value: "tle_status asc", Text: "Title Status [↑]" },
    { Value: "tle_status desc", Text: "Title Status [↓]" },
    { Value: "tle_order asc", Text: "Title Order [↑]" },
    { Value: "tle_order desc", Text: "Title Order [↓]" },
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

  const getSectionIdByTitleId = useCallback((titleId) => {
    const rawItem = dataTitleRaw.find(item => item.id === titleId);
    return rawItem?.secId || null;
  }, [dataTitleRaw]);

  const fetchOrderBySection = useCallback(async (sectionId) => {
    if(dataOrderMap[sectionId]){
      return dataOrderMap[sectionId];
    }

    try{
      setLoadingOrders(prev => ({ ...prev, [sectionId]: true }));
      
      const response = await fetchData(
        API_LINK + "Title/GetOrder",
        {
          parentId: sectionId,
        },
        "POST"
      );

      console.log(response);

      if(response.error){
        throw new Error(response.message);
      }

      const dataArray = response.data || [];

      const mappedData = dataArray.map(num => ({
        Value: num,
        Text: `Order - ${num}`,
      }));

      setDataOrderMap(prev => ({
        ...prev,
        [sectionId]: mappedData
      }));

      return mappedData;
    }catch(err){
      Toast.error(`Failed to load order section: ${err.message}`);
      return [];
    } finally{
      setLoadingOrders(prev => ({ ...prev, [sectionId]: false }));
    }
  }, [dataOrderMap]);

  const loadOrdersForCurrentTitles = useCallback(async(titles) => {
    const sectionIds = [...new Set(titles.map(item => item.secId).filter(Boolean))];

    const fetchPromises = sectionIds.map(sectionId => fetchOrderBySection(sectionId));
    await Promise.all(fetchPromises);
  }, [fetchOrderBySection]);

  const handleOrderChange = async (titleId, newOrderValue) => {
        try {
            const sectionId = getSectionIdByTitleId(titleId);

            const response = await fetchData(
                API_LINK + "Title/UpdateOrder",
                {
                    orderId: titleId,
                    orderValue: newOrderValue
                },
                "POST"
            );

            Toast.success(response.message || "Order updated successfully");

            setDataOrderMap(prev => {
              const newMap = { ...prev };
              delete newMap[sectionId];
              return newMap;
            });

            loadData(currentPage, sortBy, search, sortStatus);
        } catch (err) {
            Toast.error(err.message || "Failed to update order");
        }
    };

  const loadData = useCallback(async (page, sort, cari, status) => {
    try{
      setLoading(true);

      const response = await fetchData(
        API_LINK + "Title/GetAllTitle",
        {
          Status: status,
          ...(cari === "" ? {} : { Search: cari }),
          Urut: sort,
          PageNumber: page,
          PageSize: pageSize,
        },
        "GET"
      );

      setDataTitleRaw(response.data || []);

      if(response.error){
        throw new Error(response.message);
      }

      const {data, totalData} = response;

      await loadOrdersForCurrentTitles(data);

      const pagedData = data.map((item, index) => ({
        No: (page - 1) * pageSize + index + 1,
        id: item.id,
        Section: item.sectionName,
        Title: item.titleName,
        Type: item.titleType,
        Status: item.titleStatus === 1 ? "Active" : "Inactive",
        Order: (
          <div className="d-flex justify-content-center align-items-center">
            <DropDown 
              arrData={dataOrderMap[item.secId] || []}
              type="choose"
              value={item.titleOrder || ""}
              onChange={(e) => handleOrderChange(item.id, e.target.value)}
              label="Order"
              showLabel={false}
              className="form-select w-auto text-center"
              isDisabled={loadingOrders[item.secId] || false}
            />
          </div>
        ),
        Action: ["Edit", "Toggle"],
        Alignment: ["center", "center", "center", "center", "center", "center"],
      }))

      setDataTitle(pagedData || []);
      setTotalData(totalData || 0);
      setCurrentPage(page);
    } catch (err) {
      Toast.error(err.message || "Failed to load data");
      setDataTitle([]);
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  },[pageSize, loadOrdersForCurrentTitles]);

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
      router.push("/pages/title/add");
  }, [router]);

  const handleEdit = useCallback(
    (id) =>
    router.push(`/pages/title/edit/${encryptIdUrl(id)}`),
    [router]
  );

  const handleToggle = useCallback(
        async (id) => {

        const title = dataTitleRaw.find(item => item.id === id);
        const isActive = title?.titleStatus === 1;
        
        if (isActive) {
            const result = await SweetAlert({
                title: "Disable Title",
                text: "Are you sure you want to disable this title?",
                icon: "warning",
                confirmText: "Yes, disable it!",
            });

            if (!result) return;
        }

        setLoading(true);

        try {
            const data = await fetchData(
            API_LINK + "Title/SetActive",
            {
                id: id,
            },
            "POST"
            );

            console.log("Toggle response data:", data);

            if (data.error) {
            throw new Error(data.message);
            }

            Toast.success(data.message || "Title status updated successfully");
            loadData(1, sortBy, search, sortStatus);
        } catch (err) {
            Toast.error(err.message);
        } finally {
            setLoading(false);
        }
        },
        [sortBy, search, sortStatus, loadData, dataTitleRaw]
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
        title="Title Management"
        items={[]}
      />
      <div>
        <Formsearch
            onSearch={handleSearch}
            onAdd={handleAdd}
            onFilter={handleFilterApply}
            searchPlaceholder="Search title data"
            addButtonText="Add"
            showExportButton={false}
            filterContent={filterContent}
        />
      </div>
      <div className="row align-items-center g-3">
          <div className="col-12">
              <Table
                  size="Small"
                  data={dataTitle}
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
