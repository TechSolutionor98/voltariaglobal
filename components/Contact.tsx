"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getCmsVal } from "@/lib/api-helper";

export default function Contact({ cms }: { cms?: any }) {
  const searchParams = useSearchParams();
  const inquiry = searchParams.get("inquiry") || "";

  const [submitted, setSubmitted] = useState(false);
  const [submittedType, setSubmittedType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessType: "",
    otherBusinessType: "",
    companyName: "",
    businessInfo: "", // handles website, location, or license
    message: ""
  });

  const t = (val: string) => getCmsVal(cms, val);

  // Prefill message if inquiry parameter is present
  useEffect(() => {
    if (inquiry) {
      setFormData(prev => ({
        ...prev,
        message: `I am interested in requesting a quote/information for: ${inquiry}. Please provide pricing details and product catalogs.`
      }));
    }
  }, [inquiry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      
      setSubmittedType(formData.businessType);
      setSubmitted(true);
      
      // Auto reset after 8 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          businessType: "",
          otherBusinessType: "",
          companyName: "",
          businessInfo: "",
          message: ""
        });
        setSubmittedType("");
      }, 8000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Contact info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-red-600 font-bold tracking-widest uppercase text-sm block mb-3">{t("GET IN TOUCH")}</span>
              <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tight leading-tight">
                {t("Let's Discuss Your Requirements")}
              </h2>
              <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                {t("Whether you're seeking product information, wholesale pricing, or a dependable distribution partner, Voltaria Global is committed to delivering reliable solutions, consistent supply, and professional support for businesses of every scale.")}
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5">
                    <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-950 uppercase tracking-widest">{t("Head Office")}</h4>
                  <p className="text-sm text-gray-600 mt-1">{t("Al Jahra Building, 2nd floor, 18th St – Al Raffa – Dubai")}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-950 uppercase tracking-widest">{t("Call Center")}</h4>
                  <p className="text-sm text-gray-600 mt-1">{t("+971 4 354 0566")}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t("Mon - Sun: 8:00 AM - 6:00 PM")}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-950 uppercase tracking-widest">{t("Support Desk")}</h4>
                  <p className="text-sm text-gray-600 mt-1">{t("info@voltariaglobal.com")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7 w-full bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-lg">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center scale-110 animate-bounce">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-950 uppercase tracking-wide">
                  {submittedType === "Wholesaler" || submittedType === "Distributor" || submittedType === "Reseller" || submittedType === "Dealer"
                    ? t("B2B Request Received!")
                    : submittedType === "Contractor" || submittedType === "Builder"
                    ? t("Spec Sheet Logged!")
                    : submittedType === "Retailer" || submittedType === "Electrical Store"
                    ? t("Retail Inquiry Logged!")
                    : t("Message Transmitted!")}
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                  {submittedType === "Wholesaler" || submittedType === "Distributor" || submittedType === "Reseller" || submittedType === "Dealer"
                    ? t("Thank you. Our partnership development team will verify your dealer details and reach out within 24 hours with catalog pricing.")
                    : submittedType === "Contractor" || submittedType === "Builder"
                    ? t("Thank you for your submission. An integration engineer will review your project details and contact you within 24 hours.")
                    : t("Thank you. A retail support specialist will contact you with wholesale pricing lists and merchant accounts within 24 hours.")}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        businessType: "",
                        otherBusinessType: "",
                        companyName: "",
                        businessInfo: "",
                        message: ""
                      });
                      setSubmittedType("");
                    }}
                    className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:text-black font-semibold text-xs rounded-xl hover:bg-gray-50 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    {t("Send Another Message")}
                  </button>
                </div>
              </div>
            ) : (() => {
              // Dynamic labels and placeholders based on businessType
              let companyLabel = t("Company Name");
              let companyPlaceholder = t("e.g. Solar Tech Solutions Ltd.");
              
              let infoLabel = t("Business Website / URL");
              let infoPlaceholder = t("e.g. www.solartech.com");

              if (formData.businessType === "Retailer" || formData.businessType === "Electrical Store") {
                companyLabel = t("Store / Shop Name");
                companyPlaceholder = t("e.g. Voltaria Retail Hamburg");
                
                infoLabel = t("Store Location (City, Country) or Website");
                infoPlaceholder = t("e.g. www.store-site.com or Hamburg, DE");
              } else if (formData.businessType === "Contractor" || formData.businessType === "Builder") {
                companyLabel = t("Company / Firm Name");
                companyPlaceholder = t("e.g. Apex Builders Inc.");
                
                infoLabel = t("License Number / Website");
                infoPlaceholder = t("e.g. www.contractor-site.com or Lic #12345");
              }

              // Dynamic message placeholder
              let messagePlaceholder = t("Provide details about your average energy consumption, property size, or custom microgrid requirements...");
              if (formData.businessType === "Wholesaler" || formData.businessType === "Distributor" || formData.businessType === "Reseller") {
                messagePlaceholder = t("Describe your bulk purchase needs, product line interests, and standard order volumes...");
              } else if (formData.businessType === "Contractor" || formData.businessType === "Builder") {
                messagePlaceholder = t("Provide details about your upcoming construction projects, structural load specs, and required solar capacities...");
              } else if (formData.businessType === "Dealer" || formData.businessType === "Electrical Store") {
                messagePlaceholder = t("Provide details about your showroom or retail inventory needs and target delivery timelines...");
              } else if (formData.businessType === "Retailer") {
                messagePlaceholder = t("Please describe your storefront details, target customer base, and volume requirements...");
              }

              return (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name field */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold text-gray-950 uppercase tracking-widest">
                        {t("Full Name")}
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t("Enter your full name...")}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-black font-medium"
                      />
                    </div>

                    {/* Email field */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold text-gray-950 uppercase tracking-widest">
                        {t("Email Address")}
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t("Enter your email address")}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-black font-medium"
                      />
                    </div>
                  </div>

                  {/* Business Type field */}
                  <div className="space-y-2">
                    <label htmlFor="businessType" className="text-xs font-bold text-gray-950 uppercase tracking-widest">
                      {t("Business Type")}
                    </label>
                    <div className="relative">
                      <select
                        id="businessType"
                        required
                        value={formData.businessType}
                        onChange={(e) => {
                          const newType = e.target.value;
                          setFormData({
                            ...formData,
                            businessType: newType,
                            otherBusinessType: newType === "Other" ? formData.otherBusinessType : "",
                            companyName: newType ? formData.companyName : "",
                            businessInfo: newType ? formData.businessInfo : ""
                          });
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-black font-medium appearance-none pr-10"
                      >
                        <option value="">{t("Select Business Type")}</option>
                        <option value="Retailer">{t("Retailer")}</option>
                        <option value="Dealer">{t("Dealer")}</option>
                        <option value="Distributor">{t("Distributor")}</option>
                        <option value="Wholesaler">{t("Wholesaler")}</option>
                        <option value="Contractor">{t("Contractor")}</option>
                        <option value="Builder">{t("Builder")}</option>
                        <option value="Reseller">{t("Reseller")}</option>
                        <option value="Electrical Store">{t("Electrical Store")}</option>
                        <option value="Other">{t("Other")}</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Conditional field for Other Business Type */}
                  {formData.businessType === "Other" && (
                    <div className="space-y-2 animate-fade-in">
                      <label htmlFor="otherBusinessType" className="text-xs font-bold text-gray-950 uppercase tracking-widest">
                        {t("Specify Business Type")}
                      </label>
                      <input
                        id="otherBusinessType"
                        type="text"
                        required
                        value={formData.otherBusinessType}
                        onChange={(e) => setFormData({ ...formData, otherBusinessType: e.target.value })}
                        placeholder={t("e.g. Solar Consultant, Energy Auditor")}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-black font-medium"
                      />
                    </div>
                  )}

                  {/* Conditional fields for Business Details */}
                  {formData.businessType && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                      {/* Company Name field */}
                      <div className="space-y-2">
                        <label htmlFor="companyName" className="text-xs font-bold text-gray-950 uppercase tracking-widest">
                          {companyLabel}
                        </label>
                        <input
                          id="companyName"
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder={companyPlaceholder}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-black font-medium"
                        />
                      </div>

                      {/* Business Website/Location field */}
                      <div className="space-y-2">
                        <label htmlFor="businessInfo" className="text-xs font-bold text-gray-950 uppercase tracking-widest">
                          {infoLabel}
                        </label>
                        <input
                          id="businessInfo"
                          type="text"
                          required
                          value={formData.businessInfo}
                          onChange={(e) => setFormData({ ...formData, businessInfo: e.target.value })}
                          placeholder={infoPlaceholder}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-black font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {/* Message field */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold text-gray-950 uppercase tracking-widest">
                      {t("Detailed Message")}
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={messagePlaceholder}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-black font-medium resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="text-red-600 text-sm font-semibold bg-red-50 p-3 rounded-xl border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-red-600 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-red-700 active:scale-[0.99] transition-all shadow-md hover:shadow-lg text-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? t("Transmitting...") : t("Transmit Request")}
                  </button>
                </form>
              );
            })()}
          </div>

        </div>
      </div>
    </section>
  );
}
