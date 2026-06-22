// src/app/admin/layout.js
"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminLayout from '@/components/Admin/AdminLayout';
import LoginPage from "./login/page";
import "./admin.css"

export default function Layout({ children }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
      setIsAuthenticated(!!token);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // The login page should never show the sidebar or admin layout
  if (pathname === "/admin/login") {
    return children;
  }

  if (isAuthenticated === null) return null;
  if (!isAuthenticated) return <LoginPage />;

  return <AdminLayout>{children}</AdminLayout>;
}