"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loading from "./common/Loading";

export default function withAuth(Component, allowedRoles = []) {
    return function ProtectedRoute(props) {
        const { user, loading, isAuthenticated } = useAuth();
        const router = useRouter();

        useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
            router.push("/pages/auth/login");
            } else if (allowedRoles.length > 0) {
            const hasPermission = allowedRoles.some(
                (role) => user?.role?.toLowerCase() === role.toLowerCase()
            );
            if (!hasPermission) {
                router.push("/pages/auth/unauthorized");
            }
            }
        }
        }, [user, loading, isAuthenticated, router]);

        if (loading) {
        return (
            <Loading loading={loading} message="Loading data..." />
        );
        }

        if (!isAuthenticated) {
        return null;
        }

        if (allowedRoles.length > 0) {
        const hasPermission = allowedRoles.some(
            (role) => user?.role?.toLowerCase() === role.toLowerCase()
        );
        if (!hasPermission) {
            return null;
        }
        }

        return <Component {...props} />;
    };
}