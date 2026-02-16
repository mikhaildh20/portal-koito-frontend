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
import Loading from "@/component/common/Loading";
import withAuth from "@/component/withAuth";
import CategoryBadge from "@/component/common/CategoryBadge";
import PortalContent from "@/component/layout/Portal/PortalContent";

function ContentPage() {
  const router = useRouter();
  const [dataContent, setDataContent] = useState([]);
  const [dataContentRaw, setDataContentRaw] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [showPreview, setShowPreview] = useState(false); 
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

  const getTitleByContentId = useCallback((contentId) => {
    const rawItem = dataContentRaw.find(item => item.id === contentId);
    return rawItem?.tleId || null;
  },[dataContentRaw]);

  const fetchOrderByTitle = useCallback(async (titleId) => {
    if(orderCacheRef.current[titleId]){
      return orderCacheRef.current[titleId];
    }

    try{
      setLoadingOrders(prev => ({...prev, [titleId]: true }));

      console.log(titleId);

      const response = await fetchData(
        API_LINK + "Content/GetOrder",
        { parentId: titleId },
        "POST"
      );

      if(response.error){
        throw new Error(response.message);
      }

      const mappedData = (response.data || []).map(num => ({
        Value: num,
        Text: `Order - ${num}`,
      }));

      orderCacheRef.current[titleId] = mappedData;
      setOrderVersion(v => v + 1);

      return mappedData;
    }catch (err){
      Toast.error(`Failed to load order title: ${err.message}`);
      return[];
    }finally{
      setLoadingOrders(prev => ({...prev, [titleId]: false }));
    }
  }, []);

  const loadOrdersForCurrentContents = useCallback(async (contents) => {
    const titleIds = [...new Set(contents.map(c => c.tleId).filter(Boolean))];
    await Promise.all(titleIds.map(fetchOrderByTitle));
  }, [fetchOrderByTitle]);

  const handleOrderChange = async (contentId, newOrderValue) => {
    try{
      const titleId = getTitleByContentId(contentId);

      const response = await fetchData(
        API_LINK + "Content/UpdateOrder",
        {
          orderId: contentId,
          orderValue: newOrderValue
        },
        "POST"
      );

      Toast.success(response.message || "Order updated");

      delete orderCacheRef.current[titleId];
      setOrderVersion(v => v + 1);

      await loadData(currentPage, sortBy, search, sortStatus);
      // ✅ Reload preview after order change
      setPreviewKey(prev => prev + 1);
    }catch(err){
      Toast.error(err.message || "Failed to update order");
    }
  };

  const loadData = useCallback(async (page, sort, cari, status) => {
    try{
      setLoading(true);

      const response = await fetchData(
        API_LINK + "Content/GetAllContent",
        {
          Status: status,
          ...(cari === "" ? {} : { Search: cari }),
          Urut: sort,
          PageNumber: page,
          PageSize: pageSize,
        },
        "GET"
      );

      setDataContentRaw(response.data || []);

      if(response.error){
        throw new Error(response.message);
      }

      const {data, totalData} = response;

      await loadOrdersForCurrentContents(data);

      const pagedData = data.map((item, index) => ({
        No: (page - 1) * pageSize + index + 1,
        id: item.id,
        Title: <CategoryBadge text={item.titleName} />,
        Content: item.contentName,
        Status: item.contentStatus === 1 ? "Active" : "Inactive",
        Order: (
          <div className="d-flex justify-content-center align-items-center">
            <DropDown
              arrData={orderCacheRef.current[item.tleId] || []}
              value={item.contentOrder || ""}
              onChange={(e) => handleOrderChange(item.id, e.target.value)}
              className="form-select w-auto text-center"
              isDisabled={loadingOrders[item.tleId]  || item.contentStatus == 0}
            />
          </div>
        ),
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
  }, [pageSize, loadOrdersForCurrentContents]);

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

  const handleTogglePreview = useCallback(() => {
      setShowPreview(prev => !prev);
  }, []);

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
            await loadData(1, sortBy, search, sortStatus);
            // ✅ Reload preview after toggle
            setPreviewKey(prev => prev + 1);
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
      <Loading loading={loading} message="Loading data..." />
      <Breadcrumb
        title="Contents Management"
        items={[]}
      />

      {/* ✅ Toggle Preview Button */}
      <div className="mb-3 d-flex justify-content-end">
        <button
          onClick={handleTogglePreview}
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
          style={{
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            fontWeight: "500"
          }}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {showPreview ? (
              // Eye Off Icon
              <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </>
            ) : (
              // Eye Icon
              <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </>
            )}
          </svg>
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

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

      {/* ✅ Side by Side Layout with conditional preview */}
      <div className="row g-3">
        {/* Left: Table */}
        <div className={`col-12 ${showPreview ? 'col-xl-6' : ''}`}>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <Table
                size="Small"
                data={dataContent}
                onEdit={handleEdit}
                onToggle={handleToggle}
              />
              {totalData > 0 && (
                <div className="p-3 border-top">
                  <Paging
                    pageSize={pageSize}
                    pageCurrent={currentPage}
                    totalData={totalData}
                    navigation={handleNavigation}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Real-time Preview - Conditional */}
        {showPreview && (
          <div className="col-12 col-xl-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex align-items-center justify-content-between">
                    <span className="badge bg-success-subtle text-success">
                        Real-time Preview
                    </span>
                </div>
              </div>
              <div 
                className="card-body p-0"
                style={{
                  maxHeight: "calc(100vh - 250px)",
                  overflow: "auto"
                }}
              >
                <PortalContent key={previewKey} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default withAuth(ContentPage, ["Content-Editor", "Super-Admin"]);