"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import fetchData from "@/lib/fetch";
import Section from "@/component/layout/Portal/Section";
import { API_LINK } from "@/lib/constant";
import NavbarPortal from '@/component/layout/Portal/NavbarPortal';
import FooterPortal from '@/component/layout/Portal/FooterPortal';

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(API_LINK + "portal", {}, "GET")
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setData(res.data);
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <NavbarPortal />

      <main className="container py-5" style={{ maxWidth: "1400px" }}>
        <div className="px-3">

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-3 text-muted">loading data...</p>
            </div>
          )}

          {!loading && data.length === 0 && (
            <p className="text-center text-muted">
              data tidak tersedia
            </p>
          )}

          {!loading &&
            data.map(section => (
              <Section key={section.secId} section={section} />
            ))}
        </div>
      </main>

      <FooterPortal />
    </div>
  );
}
