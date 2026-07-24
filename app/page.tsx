import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhoWeAre from "@/components/WhoWeAre";
import WhyChooseUs from "@/components/WhyChooseUs";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getPublishedContent } from "@/lib/cms-service";
import { generateCmsMetadata } from "@/lib/cms-fetch";
import JsonLdScript from "@/components/JsonLdScript";

export const revalidate = 60;

export async function generateMetadata() {
  return generateCmsMetadata("/", {
    title: "Voltaria Global",
    description: "Voltaria Global - Premier Energy & Power Solutions",
  });
}

export default async function Home() {
  const [cms, navbarCms, footerCms] = await Promise.all([
    getPublishedContent("/"),
    getPublishedContent("[Global] Navbar"),
    getPublishedContent("[Global] Footer")
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-black">
      <JsonLdScript path="/" />
      {/* Header Navigation */}
      <Navbar cms={navbarCms} />
      
      {/* Simplified Core Home Sections */}
      <main className="flex-grow flex flex-col">
        {/* Section 1: Hero Banner */}
        <Hero cms={cms} />
        
        {/* Section 2: Who We Are */}
        <WhoWeAre cms={cms} />

        {/* Section 3: Why Choose Us */}
        <WhyChooseUs cms={cms} />

        {/* Section 4: What We Offer (Product Portfolio) */}
        <Services cms={cms} />

        {/* Section 4: Get in Touch (Contact Form) */}
        <Suspense fallback={
          <div className="text-center py-24 text-gray-500 font-bold uppercase tracking-widest animate-pulse text-sm">
            Initializing Contact Form...
          </div>
        }>
          <Contact cms={cms} />
        </Suspense>
      </main>
      
      {/* Footer Branding and Info */}
      <Footer cms={footerCms} />
    </div>
  );
}
