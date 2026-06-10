"use client";

import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedType, setSubmittedType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessType: "",
    otherBusinessType: "",
    companyName: "",
    businessInfo: "", // handles website, location, or license
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedType(formData.businessType);
    setSubmitted(true);
    console.log("Form Submitted:", formData);
    
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
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Contact info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-red-600 font-bold tracking-widest uppercase text-sm block mb-3">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tight leading-tight">
                Connect with our Engineers
              </h2>
              <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                Whether you need a custom solar microgrid layout or a standard residential PV package, our consulting engineers are ready to support your setup.
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
                  <h4 className="text-xs font-bold text-gray-950 uppercase tracking-widest">Global HQ</h4>
                  <p className="text-sm text-gray-600 mt-1">Stadthausbrücke 8, 20355 Hamburg, Germany</p>
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
                  <h4 className="text-xs font-bold text-gray-950 uppercase tracking-widest">Call Center</h4>
                  <p className="text-sm text-gray-600 mt-1">+49 (0) 40 1234-5678</p>
                  <p className="text-xs text-gray-400 mt-0.5">Mon - Fri: 8:00 AM - 6:00 PM CET</p>
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
                  <h4 className="text-xs font-bold text-gray-950 uppercase tracking-widest">Support Desk</h4>
                  <p className="text-sm text-gray-600 mt-1">support@voltariaglobal.com</p>
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
                    ? "B2B Request Received!"
                    : submittedType === "Contractor" || submittedType === "Builder"
                    ? "Spec Sheet Logged!"
                    : submittedType === "Retailer" || submittedType === "Electrical Store"
                    ? "Retail Inquiry Logged!"
                    : "Message Transmitted!"}
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                  {submittedType === "Wholesaler" || submittedType === "Distributor" || submittedType === "Reseller" || submittedType === "Dealer"
                    ? "Thank you. Our partnership development team will verify your dealer details and reach out within 24 hours with catalog pricing."
                    : submittedType === "Contractor" || submittedType === "Builder"
                    ? "Thank you for your submission. An integration engineer will review your project details and contact you within 24 hours."
                    : submittedType === "Retailer" || submittedType === "Electrical Store"
                    ? "Thank you. A retail support specialist will contact you with wholesale pricing lists and merchant accounts within 24 hours."
                    : "Thank you for connecting. A representative from our project engineering desk will contact you within 24 hours."}
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
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (() => {
              // Dynamic labels and placeholders based on businessType
              let companyLabel = "Company Name";
              let companyPlaceholder = "e.g. Solar Tech Solutions Ltd.";
              
              let infoLabel = "Business Website / URL";
              let infoPlaceholder = "e.g. www.solartech.com";

              if (formData.businessType === "Retailer" || formData.businessType === "Electrical Store") {
                companyLabel = "Store / Shop Name";
                companyPlaceholder = "e.g. Voltaria Retail Hamburg";
                
                infoLabel = "Store Location (City, Country) or Website";
                infoPlaceholder = "e.g. www.store-site.com or Hamburg, DE";
              } else if (formData.businessType === "Contractor" || formData.businessType === "Builder") {
                companyLabel = "Company / Firm Name";
                companyPlaceholder = "e.g. Apex Builders Inc.";
                
                infoLabel = "License Number / Website";
                infoPlaceholder = "e.g. www.contractor-site.com or Lic #12345";
              }

              // Dynamic message placeholder
              let messagePlaceholder = "Provide details about your average energy consumption, property size, or custom microgrid requirements...";
              if (formData.businessType === "Wholesaler" || formData.businessType === "Distributor" || formData.businessType === "Reseller") {
                messagePlaceholder = "Describe your bulk purchase needs, product line interests, and standard order volumes...";
              } else if (formData.businessType === "Contractor" || formData.businessType === "Builder") {
                messagePlaceholder = "Provide details about your upcoming construction projects, structural load specs, and required solar capacities...";
              } else if (formData.businessType === "Dealer" || formData.businessType === "Electrical Store") {
                messagePlaceholder = "Provide details about your showroom or retail inventory needs and target delivery timelines...";
              } else if (formData.businessType === "Retailer") {
                messagePlaceholder = "Please describe your storefront details, target customer base, and volume requirements...";
              }

              return (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name field */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold text-gray-950 uppercase tracking-widest">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-black font-medium"
                      />
                    </div>

                    {/* Email field */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold text-gray-950 uppercase tracking-widest">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. john@company.com"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-black font-medium"
                      />
                    </div>
                  </div>

                  {/* Business Type field */}
                  <div className="space-y-2">
                    <label htmlFor="businessType" className="text-xs font-bold text-gray-950 uppercase tracking-widest">
                      Business Type
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
                        <option value="">Select Business Type</option>
                        <option value="Retailer">Retailer</option>
                        <option value="Dealer">Dealer</option>
                        <option value="Distributor">Distributor</option>
                        <option value="Wholesaler">Wholesaler</option>
                        <option value="Contractor">Contractor</option>
                        <option value="Builder">Builder</option>
                        <option value="Reseller">Reseller</option>
                        <option value="Electrical Store">Electrical Store</option>
                        <option value="Other">Other</option>
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
                        Specify Business Type
                      </label>
                      <input
                        id="otherBusinessType"
                        type="text"
                        required
                        value={formData.otherBusinessType}
                        onChange={(e) => setFormData({ ...formData, otherBusinessType: e.target.value })}
                        placeholder="e.g. Solar Consultant, Energy Auditor"
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
                      Detailed Message
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

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-red-600 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-red-700 active:scale-[0.99] transition-all shadow-md hover:shadow-lg text-sm cursor-pointer"
                  >
                    Transmit Request
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
