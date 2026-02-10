"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import fetchData from "@/lib/fetch";
import Section from "@/component/layout/Portal/Section";
import { API_LINK } from "@/lib/constant";
import Loading from '@/component/common/Loading';

export default function PortalContent() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData(API_LINK + "portal", {}, "GET")
        .then(res => {
            if (res.success && Array.isArray(res.data)) {
            setData(res.data);
            }
        })
        .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
        <Loading loading={loading} message="Loading data..." />
        );
    }

    if (!data.length) {
        return (
        <p className="text-center text-muted">content not available</p>
        );
    }

    return (
        <>
        {data.map(section => (
            <Section key={section.secId} section={section} />
        ))}
        </>
    );
}
