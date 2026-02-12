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

function UserPage(){
    const router = useRouter();
    const [dataUser, setDataUser] = useState([]);
    const [dataUserRaw, setDataUserRaw] = useState([]);
    const [loading, setLoading] = useState(false);
    const sortRef = useRef();
    const statusRef = useRef();
    const [isClient, setIsClient] = useState(false);

    const dataFilterSort = [
        { Value: "user_name asc", Text: "User Name [↑]" },
        { Value: "user_name desc", Text: "User Name [↓]" },
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

    const loadData = useCallback(async (page, sort, cari, status) =>{
        try{
            setLoading(true);

            const response = await fetchData(
            API_LINK + "User/GetAllUser",
            {
                Status: status,
                ...(cari === "" ? {} : { Search: cari }),
                Urut: sort,
                PageNumber: page,
                PageSize: pageSize,
            },
            "GET"
            );

            if (response.error) {
                throw new Error(response.message);
            }

            setDataUserRaw(response.data || []);

            const { data, totalData } = response;

            const pagedData = data.map((item, index) => ({
                No: (page - 1) * pageSize + index + 1,
                id: item.userId,
                Username: item.userName,
                "Full Name": item.name,
                Role: item.role,
                Status: item.userStatus === 1 ? "Active" : "Inactive",
                Action: ["Reset","Toggle"],
                Alignment: ["center", "center", "center", "center", "center"],
            }));

            setDataUser(pagedData);
            setTotalData(totalData || 0);
            setCurrentPage(page);
        }catch (err){
            Toast.error(err.message || "Failed to load data");
            setDataUser([]);
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
        router.push("/pages/user/add");
    }, [router]);

    const handleEdit = useCallback(
        (id) =>
        router.push(`/pages/user/edit/${encryptIdUrl(id)}`),
        [router]
    );

    const handleToggle = useCallback(
        async (id) => {
            
            const user = dataUserRaw.find(item => item.userId == id);
            const isActive = user?.userStatus === 1;

            if (isActive) {
                const result = await SweetAlert({
                    title: "Disable User",
                    text: "Are you sure you want to disable this user?",
                    icon: "warning",
                    confirmText: "Yes, disable it!",
                });

                if (!result) return;
            }

            setLoading(true);

            try {
                const data = await fetchData(
                API_LINK + "User/SetActive",
                {
                    id: id,
                },
                "POST"
                );

                if (data.error) {
                throw new Error(data.message);
                }

                Toast.success(data.message || "User status updated successfully");
                loadData(1, sortBy, search, sortStatus);
            } catch (err) {
                Toast.error(err.message);
            } finally {
                setLoading(false);
            }
        },
        [sortBy, search, sortStatus, loadData, dataUserRaw]
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
            <Loading loading={loading} message="Loading data..." />
            <Breadcrumb
            title="Users Management"
            items={[]}
            />
            <div>
                <Formsearch
                onSearch={handleSearch}
                onAdd={handleAdd}
                onFilter={handleFilterApply}
                searchPlaceholder="Search user data"
                addButtonText="Add"
                showExportButton={false}
                filterContent={filterContent}
                />
            </div>
            <div className="row align-items-center g-3">
                <div className="col-12">
                <Table 
                    size="small"
                    data={dataUser}
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

export default withAuth(UserPage, ["Super-Admin"]);