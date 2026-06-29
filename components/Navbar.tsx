"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { getCmsVal } from "@/lib/api-helper";

export default function Navbar({ cms }: { cms?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();

  const t = (val: string) => getCmsVal(cms, val);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src={t("/images/logo1.png")}
            alt={t("Voltaria Logo")}
            width={120}
            height={64}
            priority
            className="h-19 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "text-red-600 font-bold tracking-wider transition-colors"
                : "text-gray-600 hover:text-red-600 transition-colors"
            }
          >
            {t("Home")}
          </Link>
          <Link
            href="/about"
            className={
              pathname === "/about"
                ? "text-red-600 font-bold tracking-wider transition-colors"
                : "text-gray-600 hover:text-red-600 transition-colors"
            }
          >
            {t("About Us")}
          </Link>
          <div className="relative flex items-center">
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              type="button"
              className={`flex items-center focus:outline-none transition-colors cursor-pointer py-2 ${
                pathname && pathname.startsWith("/products")
                  ? "text-red-600 font-bold tracking-wider"
                  : "text-gray-600 hover:text-red-600"
              }`}
              aria-label="Toggle Products Menu"
            >
              <span>{t("Products")}</span>
              <span className={`p-1.5 transition-colors rounded-full ml-1 hover:bg-gray-50/50 ${
                pathname.startsWith("/products")
                  ? "text-red-600"
                  : "text-gray-400 hover:text-red-600"
              }`}>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {productsOpen && (
              <>
                {/* Overlay to close on clicking outside */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setProductsOpen(false)} 
                />
                
                {/* Dropdown menu */}
                <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-white border border-gray-100 shadow-xl py-2.5 z-20 animate-fade-in origin-top-left">
                  <Link
                    href="/products/fans"
                    onClick={() => setProductsOpen(false)}
                    className="block px-5 py-3 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 font-bold uppercase transition-colors"
                  >
                    {t("FANS")}
                  </Link>
                  {/* <Link
                    href="/products/batteries"
                    onClick={() => setProductsOpen(false)}
                    className="block px-5 py-3 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 font-bold uppercase transition-colors"
                  >
                    {t("BATTERIES")}
                  </Link> */}
                  <Link
                    href="/products/fuses-breakers"
                    onClick={() => setProductsOpen(false)}
                    className="block px-5 py-3 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 font-bold uppercase transition-colors"
                  >
                    {t("FUSES & BREAKERS")}
                  </Link>
                  <Link
                    href="/products/changeovers"
                    onClick={() => setProductsOpen(false)}
                    className="block px-5 py-3 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 font-bold uppercase transition-colors"
                  >
                    {t("CHANGEOVERS")}
                  </Link>
                  <Link
                    href="/products/inverters"
                    onClick={() => setProductsOpen(false)}
                    className="block px-5 py-3 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 font-bold uppercase transition-colors"
                  >
                    {t("INVERTERS")}
                  </Link>
                </div>
              </>
            )}
          </div>
          <Link
            href="/blogs"
            className={
              pathname && pathname.startsWith("/blogs")
                ? "text-red-600 font-bold tracking-wider transition-colors"
                : "text-gray-600 hover:text-red-600 transition-colors"
            }
          >
            {t("Blog")}
          </Link>
          <Link
            href="/contact"
            className={
              pathname === "/contact"
                ? "text-red-600 font-bold tracking-wider transition-colors"
                : "text-gray-600 hover:text-red-600 transition-colors"
            }
          >
            {t("Contact Us")}
          </Link>
        </nav>

        {/* Login Button */}
        <div className="hidden md:block">
          <Link
            href="/login"
            className="px-8 py-2.5 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 active:scale-95 transition-all shadow-md hover:shadow-lg inline-block"
          >
            {t("Login")}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-600"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden border-t border-gray-100 bg-white`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-4 py-4 pb-6">
          <Link
            href="/"
            className={`block rounded-md px-3 py-2 text-base ${
              pathname === "/"
                ? "font-bold text-red-600 hover:bg-gray-50"
                : "font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            {t("Home")}
          </Link>
          <Link
            href="/about"
            className={`block rounded-md px-3 py-2 text-base ${
              pathname === "/about"
                ? "font-bold text-red-600 hover:bg-gray-50"
                : "font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            {t("About Us")}
          </Link>
          <div>
            <div className="flex items-center justify-between rounded-md hover:bg-gray-50 pr-2">
              <button
                type="button"
                onClick={() => setProductsOpen(!productsOpen)}
                className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors focus:outline-none ${
                  pathname && pathname.startsWith("/products")
                    ? "font-bold text-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >{t("Products")}</button>
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                type="button"
                className="p-2.5 focus:outline-none text-gray-400 hover:text-red-600 cursor-pointer"
                aria-label="Toggle Products Menu"
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {productsOpen && (
              <div className="pl-6 pr-4 py-1 space-y-1 bg-gray-50/50 rounded-lg mt-1 border-l-2 border-red-500 animate-fade-in">
                <Link
                  href="/products/fans"
                  className="block rounded-md px-3 py-2 text-sm font-bold text-gray-700 hover:text-red-600 hover:bg-gray-50 uppercase"
                  onClick={() => {
                    setProductsOpen(false);
                    setIsOpen(false);
                  }}
                >
                  {t("FANS")}
                </Link>
                {/* <Link
                  href="/products/batteries"
                  className="block rounded-md px-3 py-2 text-sm font-bold text-gray-700 hover:text-red-600 hover:bg-gray-50 uppercase"
                  onClick={() => {
                    setProductsOpen(false);
                    setIsOpen(false);
                  }}
                >
                  {t("BATTERIES")}
                </Link> */}
                <Link
                  href="/products/fuses-breakers"
                  className="block rounded-md px-3 py-2 text-sm font-bold text-gray-700 hover:text-red-600 hover:bg-gray-50 uppercase"
                  onClick={() => {
                    setProductsOpen(false);
                    setIsOpen(false);
                  }}
                >
                  {t("FUSES & BREAKERS")}
                </Link>
                <Link
                  href="/products/changeovers"
                  className="block rounded-md px-3 py-2 text-sm font-bold text-gray-700 hover:text-red-600 hover:bg-gray-50 uppercase"
                  onClick={() => {
                    setProductsOpen(false);
                    setIsOpen(false);
                  }}
                >
                  {t("CHANGEOVERS")}
                </Link>
                <Link
                  href="/products/inverters"
                  className="block rounded-md px-3 py-2 text-sm font-bold text-gray-700 hover:text-red-600 hover:bg-gray-50 uppercase"
                  onClick={() => {
                    setProductsOpen(false);
                    setIsOpen(false);
                  }}
                >
                  {t("INVERTERS")}
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/blogs"
            className={`block rounded-md px-3 py-2 text-base ${
              pathname && pathname.startsWith("/blogs")
                ? "font-bold text-red-600 hover:bg-gray-50"
                : "font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            {t("Blog")}
          </Link>
          <Link
            href="/contact"
            className={`block rounded-md px-3 py-2 text-base ${
              pathname === "/contact"
                ? "font-bold text-red-600 hover:bg-gray-50"
                : "font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            {t("Contact Us")}
          </Link>
          <div className="pt-4 border-t border-gray-100">
            <Link
              href="/login"
              className="block w-full text-center px-4 py-2.5 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t("Login")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
