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

export default function SectionPage() {
    const router = useRouter();
    const [dataSection, setDataSection] = useState([]);
    const [dataSectionRaw, setDataSectionRaw] = useState([]);
    const [dataOrder, setDataOrder] = useState([]);
    const [isOrderDataReady, setIsOrderDataReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const orderRef = useRef();
    const sortRef = useRef();
    const statusRef = useRef();
    const [isClient, setIsClient] = useState(false);

    const dataFilterSort = [
        { Value: "sec_name asc", Text: "Section Name [↑]" },
        { Value: "sec_name desc", Text: "Section Name [↓]" },
        { Value: "sec_status asc", Text: "Section Status [↑]" },
        { Value: "sec_status desc", Text: "Section Status [↓]" },
        { Value: "sec_order asc", Text: "Section Order [↑]" },
        { Value: "sec_order desc", Text: "Section Order [↓]" },
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

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                setIsOrderDataReady(false);
                
                const response = await fetchData(
                    API_LINK + "Section/GetOrder",
                    {},
                    "GET"
                );

                if (response.error) {
                    throw new Error(response.message);
                }

                const dataArray = response.data || [];

                const mappedData = dataArray.map(num => ({
                    Value: num,
                    Text: `Order - ${num}`,
                }));

                setDataOrder(mappedData);
                setIsOrderDataReady(true);
            } catch (err) {
                Toast.error(err.message || "Failed to load order data");
                setIsOrderDataReady(true);
            } finally {
                setIsOrderDataReady(true);
            }
        };

        fetchOrderData();
    }, []);

    const handleOrderChange = async (sectionId, newOrderValue) => {
        try {
            const response = await fetchData(
                API_LINK + "Section/UpdateOrder",
                {
                    orderId: sectionId,
                    orderValue: newOrderValue
                },
                "POST"
            );

            Toast.success(response.message || "Order updated successfully");

            loadData(currentPage, sortBy, search, sortStatus);

        } catch (err) {
            Toast.error(err.message || "Failed to update order");
        }
    };


    const loadData = useCallback(async (page, sort, cari, status) => {
        try {
            setLoading(true);

            const response = await fetchData(
                API_LINK + "Section/GetAllSection",
                {
                    Status: status,
                    ...(cari === "" ? {} : { Search: cari }),
                    Urut: sort,
                    PageNumber: page,
                    PageSize: pageSize,
                },
                "GET"
            );

            setDataSectionRaw(response.data || []);

            if (response.error) {
                throw new Error(response.message);
            }

            const { data, totalData } = response;
            const pagedData = data.map((item, index) => ({
                No: (page - 1) * pageSize + index + 1,
                id: item.id,
                Name: item.sectionName,
                Status: item.sectionStatus === 1 ? "Active" : "Inactive",
                Order: (
                <div className="d-flex justify-content-center align-items-center">
                    <DropDown 
                    arrData={dataOrder || []}
                    type="choose"
                    value={item.sectionOrder || ""}
                    onChange={(e) => handleOrderChange(item.id, e.target.value)}
                    label="Order"
                    showLabel={false}
                    className="form-select w-auto text-center"
                    isDisabled={!isOrderDataReady}
                    />
                </div>
                ),
                Action: ["Edit", "Toggle"],
                Alignment: ["center", "center", "center", "center", "center"],
            }));

            setDataSection(pagedData || []);
            setTotalData(totalData || 0);
            setCurrentPage(page);
        } catch (err) {
            Toast.error(err.message || "Failed to load data");
            setDataSection([]);
            setTotalData(0);
        } finally {
            setLoading(false);
        }
    }, [pageSize, dataOrder, isOrderDataReady]);

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
        router.push("/pages/section/add");
    }, [router]);

    const handleEdit = useCallback(
        (id) =>
        router.push(`/pages/section/edit/${encryptIdUrl(id)}`),
        [router]
    );

    const handleToggle = useCallback(
        async (id) => {

        const section = dataSectionRaw.find(item => item.id === id);
        const isActive = section?.sectionStatus === 1;
        
        if (isActive) {
            const result = await SweetAlert({
                title: "Disable Section",
                text: "Are you sure you want to disable this section?",
                icon: "warning",
                confirmText: "Yes, disable it!",
            });

            if (!result) return;
        }

        setLoading(true);

        try {
            const data = await fetchData(
            API_LINK + "Section/SetActive",
            {
                id: id,
            },
            "POST"
            );

            console.log("Toggle response data:", data);

            if (data.error) {
            throw new Error(data.message);
            }

            Toast.success(data.message || "Section status updated successfully");
            loadData(1, sortBy, search, sortStatus);
        } catch (err) {
            Toast.error(err.message);
        } finally {
            setLoading(false);
        }
        },
        [sortBy, search, sortStatus, loadData, dataSectionRaw]
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

    return(
        <>
            <Breadcrumb
                title="Sections Management"
                items={[]}
            />
            <div>
                <Formsearch
                    onSearch={handleSearch}
                    onAdd={handleAdd}
                    onFilter={handleFilterApply}
                    searchPlaceholder="Search section data"
                    addButtonText="Add"
                    showExportButton={false}
                    filterContent={filterContent}
                />
            </div>
            <div className="row align-items-center g-3">
                <div className="col-12">
                    <Table
                        size="Small"
                        data={dataSection}
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
