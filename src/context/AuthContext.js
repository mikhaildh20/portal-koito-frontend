"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { JWT_TOKEN_KEY, USER_DATA_KEY } from "@/lib/fetch";
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userData = Cookies.get(USER_DATA_KEY);
        if(userData){
            try{
                setUser(JSON.parse(userData));
            }catch(err){
                toast.error("Failed to parse user data: ");
                logout();
            }
        }
        setLoading(false);
    },[]);

    const login = (token, userData) => {
        Cookies.set(JWT_TOKEN_KEY, token, { expires: 7, secure: true });
        Cookies.set(USER_DATA_KEY, JSON.stringify(userData), { 
            expires: 7, 
            secure: true 
        });
        setUser(userData);
    };

    // const login = (token, userData) => {
    //     Cookies.set(JWT_TOKEN_KEY, token, {
    //         expires: 7,
    //         secure: process.env.NODE_ENV === "production",
    //         sameSite: "strict",
    //     });

    //     Cookies.set(USER_DATA_KEY, JSON.stringify(userData), {
    //         expires: 7,
    //         secure: process.env.NODE_ENV === "production",
    //         sameSite: "strict",
    //     });

    //     setUser(userData);
    // };



    const logout = () => {
        Cookies.remove(JWT_TOKEN_KEY);
        Cookies.remove(USER_DATA_KEY);
        setUser(null);
        router.push("/pages/auth/login");
    };

    const hasRole = (role) => {
        return user?.role?.toLowerCase() === role.toLowerCase();
    };

    const isSuperAdmin = () => hasRole("Super-Admin");
    const isEditor = () => hasRole("Content-Editor");

    return(
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                hasRole,
                isSuperAdmin,
                isEditor,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};