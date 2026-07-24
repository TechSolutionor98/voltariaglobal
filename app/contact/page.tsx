import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import AppointmentSection from "@/components/AppointmentSection";
import { getPublishedContent, getCmsVal } from "@/lib/cms-service";
import { getDb } from "@/lib/mongodb";
import { generateCmsMetadata } from "@/lib/cms-fetch";
import JsonLdScript from "@/components/JsonLdScript";

export const revalidate = 60;

export async function generateMetadata() {
  return generateCmsMetadata("/contact", {
    title: "Contact Us - Voltaria Global",
    description: "Get in touch with Voltaria Global for bulk product inquiries, dealership applications, and corporate support.",
  });
}

export default async function ContactPage() {
  const [cms, navbarCms, footerCms] = await Promise.all([
    getPublishedContent("/contact"),
    getPublishedContent("[Global] Navbar"),
    getPublishedContent("[Global] Footer")
  ]);

  const t = (val: string) => getCmsVal(cms, val);

  // Fetch appointment links directly from database
  let appointmentLinks = [];
  try {
    const db = await getDb();
    const doc = await db.collection("appointments").findOne({ _id: "appointment_links" });
    appointmentLinks = doc?.links || [];
  } catch (err) {
    console.error("Failed to load appointment links:", err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans antialiased text-black">
      <JsonLdScript path="/contact" />
      {/* Header Navigation */}
      <Navbar cms={navbarCms} />

      {/* Page Header */}
      <div className="text-center pt-20 pb-4">
        <h1 className="text-5xl md:text-7xl font-black text-red-600 tracking-wider uppercase">
          {t("CONTACT US")}
        </h1>
      </div>

      {/* Contact Section Form */}
      <main className="flex-grow">
        <Suspense fallback={
          <div className="text-center py-24 text-gray-500 font-bold uppercase tracking-widest animate-pulse text-sm">
            Initializing Contact Form...
          </div>
        }>
          <Contact cms={cms} />
        </Suspense>

        {/* Book an Appointment Banner */}
        <AppointmentSection links={appointmentLinks} />
      </main>

      {/* Footer Branding and Info */}
      <Footer cms={footerCms} />
    </div>
  );
}
