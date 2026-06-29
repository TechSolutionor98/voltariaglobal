"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getCmsVal } from "@/lib/api-helper";

export default function Footer({ cms }: { cms?: any }) {
  const [email, setEmail] = useState("");
  const t = (val: string) => getCmsVal(cms, val);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Subscribed: ${email}`);
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#FFFEFE] border-t border-b border-gray-200 mt-auto py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        
        {/* Brand & Socials Column */}
        <div className="lg:col-span-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src={t("/images/logo1.png")}
              alt={t("Voltaria Logo")}
              width={120}
              height={64}
              className="h-19 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Follow Us */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-950 uppercase tracking-wide">{t("Follow Us")}</h4>
            
            {/* Social Icons (Black squircles containing white icons) */}
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a 
                href="#" 
                className="w-11 h-11 bg-black rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
                  <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3h-4V6.5c0-.8.2-1.1 1-1.1H15V2h-3C9.7 2 9 3.2 9 5.5V8z"/>
                </svg>
              </a>
              {/* X (formerly Twitter) */}
              <a 
                href="#" 
                className="w-11 h-11 bg-black rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white">
                  <path d="M18.2 2.4h3.3L14.3 11l8.5 11.3H16.2l-5.2-6.8-5.9 6.8H1.8l7.6-8.7L1.2 2.4h6.8l4.7 6.2 5.5-6.2zm-1.2 17.6h1.8L7.1 4.2H5.1l11.9 15.8z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a 
                href="#" 
                className="w-11 h-11 bg-black rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 text-white" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a 
                href="#" 
                className="w-11 h-11 bg-black rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>

            <p className="text-zinc-500 text-xs font-semibold tracking-wide mt-3">{t("Stay updated with our latest news and offers")}</p>

            {/* Newsletter Input Box */}
            <form onSubmit={handleSubscribe} className="flex items-center bg-[#e5e7eb] rounded-xl w-full max-w-[280px] p-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Enter your email")}
                className="bg-transparent border-none outline-none text-xs px-3 py-2 flex-grow text-gray-800 placeholder-gray-500 font-bold"
              />
              <button
                type="submit"
                className="bg-red-600 text-white w-10 h-10 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors shrink-0"
                aria-label="Subscribe"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Our Products Column */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-lg font-black text-black uppercase tracking-wider">{t("OUR PRODUCTS")}</h4>
          <div className="w-full h-[3px] bg-red-600 mt-2" />
          
          <ul className="list-disc pl-5 space-y-3.5 text-black font-semibold text-sm pt-4">
            <li>
              <Link href="/products/fans" className="hover:text-red-600 transition-colors">{t("FANS")}</Link>
            </li>
            {/* <li>
              <Link href="/products/batteries" className="hover:text-red-600 transition-colors">{t("BATTERIES")}</Link>
            </li> */}
            <li>
              <Link href="/products/fuses-breakers" className="hover:text-red-600 transition-colors">{t("FUSES & BREAKERS")}</Link>
            </li>
            <li>
              <Link href="/products/changeovers" className="hover:text-red-600 transition-colors">{t("CHANGEOVERS")}</Link>
            </li>
            <li>
              <Link href="/products/inverters" className="hover:text-red-600 transition-colors">{t("INVERTERS")}</Link>
            </li>
          </ul>
        </div>

        {/* Company Column */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-lg font-black text-black uppercase tracking-wider">{t("COMPANY")}</h4>
          <div className="w-full h-[3px] bg-red-600 mt-2" />

          <ul className="list-disc pl-5 space-y-3.5 text-black font-semibold text-sm pt-4">
            <li>
              <Link href="/" className="hover:text-red-600 transition-colors">{t("Home")}</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-red-600 transition-colors">{t("About Us")}</Link>
            </li>
            {/* <li>
              <Link href="/products" className="hover:text-red-600 transition-colors">{t("Products")}</Link>
            </li> */}
            <li>
              <Link href="/blogs" className="hover:text-red-600 transition-colors">{t("Blog")}</Link>
            </li>
            <li>
              <Link href="/career" className="hover:text-red-600 transition-colors">{t("Career")}</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-red-600 transition-colors">{t("Contact Us")}</Link>
            </li>
          </ul>
        </div>

        {/* Get In Touch Column */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-lg font-black text-black uppercase tracking-wider">{t("GET IN TOUCH")}</h4>
          <div className="w-full h-[3px] bg-red-600 mt-2" />

          <div className="space-y-4 text-sm text-black font-bold pt-4">
            <p>
              {t("Phone:")} <span className="font-semibold text-gray-700 ml-1">{t("+971 4 354 0566")}</span>
            </p>
            <p>
              {t("Email:")} <span className="font-semibold text-gray-700 ml-1">{t("info@voltariaglobal.com")}</span>
            </p>
            <p>
              {t("Head Office:")} <span className="font-semibold text-gray-700 ml-1">{t("Al Jahra Building, 2nd floor, 18th St – Al Raffa – Dubai")}</span>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
