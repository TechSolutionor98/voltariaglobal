'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LogoutButton from '@/app/admin/components/LogoutButton';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { FiLock } from 'react-icons/fi';
import { IoIosLogOut } from "react-icons/io";

const ROLE_ALLOWED_ROUTES = {
  super_admin: ["*"],
  admin: [
    "/admin",
    "/admin/applications",
    "/admin/contact-submissions",
    "/admin/reviews",
    "/admin/settings",
    "/admin/pages",
    "/admin/seo",
    "/admin/redirects",
    "/admin/media",
    "/admin/activity",
    "/admin/blogs"
  ],
  client: [
    "/admin",
    "/admin/applications",
    "/admin/contact-submissions",
    "/admin/reviews",
    "/admin/settings",
    "/admin/pages",
    "/admin/seo",
    "/admin/redirects",
    "/admin/media",
    "/admin/blogs"
  ],
  blog: [
    "/admin",
    "/admin/blogs"
  ],
  seo: [
    "/admin",
    "/admin/pages",
    "/admin/seo",
    "/admin/redirects"
  ],
  editor: [
    "/admin",
    "/admin/pages",
    "/admin/redirects",
    "/admin/media"
  ],
  viewer: [
    "/admin",
    "/admin/pages",
    "/admin/seo",
    "/admin/redirects"
  ]
};

export default function AdminLayout({ children, title = '' }) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blogsOpen, setBlogsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          console.error("Failed to parse user details:", e);
        }
      } else {
        const token = localStorage.getItem("jwt");
        if (token) {
          setCurrentUser({ name: "Super Admin", role: "super_admin" });
        }
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (pathname && pathname.startsWith("/admin/blogs")) {
      setBlogsOpen(true);
    }
  }, [pathname]);

  const role = currentUser?.role || 'super_admin';

  const isRouteAllowed = (path) => {
    const allowed = ROLE_ALLOWED_ROUTES[role] || [];
    if (allowed.includes("*")) return true;
    return allowed.some(allowedPath => {
      if (allowedPath === "/admin") {
        return path === "/admin" || path === "/admin/";
      }
      return path.startsWith(allowedPath);
    });
  };

  const navLinks = [
    { href: "/admin/applications", label: "Job Applications", group: "Management", hidden: true },
    { href: "/admin/contact-submissions", label: "Contact Submissions", group: "Management" },
    { href: "/admin/reviews", label: "Reviews", group: "Management", hidden: true },
    { href: "/admin/settings", label: "Business Settings", group: "Management", hidden: true },
    { href: "/admin/pages", label: "Pages & Routes", group: "CMS" },
    { href: "/admin/seo", label: "SEO Manager", group: "CMS" },
    { href: "/admin/redirects", label: "URL Redirects", group: "CMS" },
    { href: "/admin/media", label: "Media Library", group: "CMS" },
    { href: "/admin/blogs", label: "List Blogs", group: "Blogs" },
    { href: "/admin/blogs/add", label: "Add Blog", group: "Blogs" },
    { href: "/admin/blogs/comments", label: "Comment List", group: "Blogs" },
    { href: "/admin/blogs/users", label: "Blog Users", group: "Blogs" },
    { href: "/admin/users", label: "Users", group: "Management" },
    { href: "/admin/activity", label: "Activity Logs", group: "Management" },
  ];

  const filteredLinks = navLinks.filter(link => !link.hidden && isRouteAllowed(link.href));

  const groupedLinks = filteredLinks.reduce((acc, link) => {
    const group = link.group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(link);
    return acc;
  }, {});

  const isAllowed = loading || isRouteAllowed(pathname);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-black relative">

      {/* Top-right Logout */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        {currentUser && (
          <span className="hidden md:inline-block text-xs text-gray-500 font-medium">
            Logged in as: <strong className="text-[#084032]">{currentUser.name}</strong> ({role.replace('_', ' ')})
          </span>
        )}
        <LogoutButton>
          <div className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#084032] text-white text-sm rounded hover:bg-[#0a5c48] transition-colors duration-200">
            <IoIosLogOut />
            <span>Logout</span>
          </div>
        </LogoutButton>
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 p-6 pt-16 md:pt-6 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div className="mb-6 flex justify-center">
          <Link href="/admin">
            <Image alt='Voltaria Logo' width={150} height={80} src="/images/logo1.png" className="h-14 w-auto object-contain" priority />
          </Link>
        </div>
        <hr className='bg-gray-400 text-gray-400 w-full h-[2px] mb-7' />
        <nav className="flex flex-col gap-1 text-sm">
          {Object.entries(groupedLinks).map(([group, links]) => {
            if (group === 'Blogs') {
              return (
                <div key={group} className="mb-3">
                  <button
                    onClick={() => setBlogsOpen(!blogsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-100 rounded transition duration-150 cursor-pointer text-sm font-bold text-gray-400 uppercase tracking-wider"
                  >
                    <span>Blogs</span>
                    <span className="text-gray-400">
                      {blogsOpen ? (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                      )}
                    </span>
                  </button>
                  {blogsOpen && (
                    <div className="mt-1 pl-2 ml-1 flex flex-col gap-0.5 border-l border-gray-150">
                      {links.map(link => {
                        const isActive = pathname === link.href;
                        return (
                          <Link key={link.href} href={link.href}>
                            <p
                              className={`px-3 py-2 text-sm rounded ${
                                isActive
                                  ? "bg-[#084032] text-white font-semibold"
                                  : "hover:bg-gray-100 text-gray-800"
                              }`}
                              style={isActive ? { cursor: "default" } : {}}
                            >
                              {link.label}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <div key={group} className="mb-3">
                <p className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{group}</p>
                {links.map(link => {
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.href} href={link.href}>
                      <p
                        className={`px-3 py-2 rounded ${
                          isActive
                            ? "bg-[#084032] text-white font-semibold"
                            : "hover:bg-gray-100"
                        }`}
                        style={isActive ? { cursor: "default" } : {}}
                      >
                        {link.label}
                      </p>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-6 overflow-x-hidden">
        <header className="mb-6 mt-10 md:mt-0">
          <h1 className="text-2xl font-semibold">{title}</h1>
        </header>
        <section>
          {isAllowed ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6 shadow-sm">
                <FiLock size={30} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
              <p className="text-gray-600 max-w-md mb-8">
                Your account role <span className="font-semibold text-[#084032] uppercase">({role.replace('_', ' ')})</span> does not have permission to view this section.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/admin" className="px-5 py-2.5 bg-[#084032] hover:bg-[#0a5c48] text-white font-semibold rounded-md transition shadow-md">
                  Go to Dashboard
                </Link>
                {role === 'seo' && (
                  <Link href="/admin/pages" className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-md transition">
                    Go to Pages & Routes
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
