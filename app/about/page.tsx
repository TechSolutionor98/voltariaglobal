import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublishedContent, getCmsVal } from "@/lib/cms-service";
import { generateCmsMetadata } from "@/lib/cms-fetch";
import JsonLdScript from "@/components/JsonLdScript";

export const revalidate = 60;

export async function generateMetadata() {
  return generateCmsMetadata("/about", {
    title: "About Us - Voltaria Global",
    description: "Voltaria is a modern power and home comfort brand dedicated to delivering reliable, efficient, and high-quality energy products.",
  });
}

export default async function AboutPage() {
  const [cms, navbarCms, footerCms] = await Promise.all([
    getPublishedContent("/about"),
    getPublishedContent("[Global] Navbar"),
    getPublishedContent("[Global] Footer")
  ]);

  const t = (val: string) => getCmsVal(cms, val);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-black">
      <JsonLdScript path="/about" />
      {/* Header Navigation */}
      <Navbar cms={navbarCms} />

      {/* Title */}
      <div className="text-center pt-20 pb-12">
        <h1 className="text-5xl md:text-7xl font-black text-red-600 tracking-wider uppercase">
          {t("ABOUT US")}
        </h1>
      </div>

      {/* Section 1: Powering Everyday Life (Dual Column) */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl md:text-4xl font-black text-black leading-tight tracking-wide uppercase">
              {t("POWERING EVERYDAY LIFE WITH SMART ENERGY SOLUTIONS")}
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {t("Voltaria is a modern power and home comfort brand dedicated to delivering reliable, efficient, and high-quality energy products for homes, offices, and commercial spaces. We specialize in batteries, inverters, fans, and smart home solutions designed to improve everyday comfort and provide dependable performance during all conditions.")}
            </p>
          </div>
          {/* Right: Meeting Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border border-gray-100">
              <Image
                src={t("/images/about-meeting.png")}
                alt={t("Collaborative meeting at Voltaria Global")}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Quote Box / Key Portrait Banner */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative">
          
          {/* Wavy Horizontal Accent Track Layout */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent pointer-events-none z-0" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center bg-red-600 rounded-[40px] md:rounded-r-[80px] md:rounded-l-[120px] p-4 md:p-6 shadow-2xl text-white border border-red-700">
            {/* Portrait Cutout */}
            <div className="flex-shrink-0 w-36 h-36 md:w-44 md:h-44 rounded-full border-8 border-white bg-white shadow-xl overflow-hidden relative -mt-16 md:-mt-0 md:-ml-12 z-10">
              <Image
                src={t("/images/about-man.png")}
                alt={t("Voltaria Global Executive")}
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Quote Text */}
            <div className="flex-grow py-6 px-6 md:px-12 text-center md:text-left">
              <blockquote className="text-base md:text-2xl font-black uppercase tracking-wider leading-tight">
                {t("“QUALITY YOU CAN TRUST PERFORMANCE YOU CAN RELY ON ENERGY SOLUTIONS FOR MODERN LIVING”")}
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Our Story (Dark Background) */}
      <section className="bg-[#0c0c0c] text-white py-24 border-t border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 text-center md:text-left space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-red-600 tracking-tight uppercase">
            {t("OUR STORY")}
          </h2>
          <div className="space-y-6 text-zinc-300 text-sm md:text-base leading-relaxed font-medium">
            <p>
              {t("Voltaria was created with a vision to solve everyday power challenges faced by homes and businesses. In a world where uninterrupted electricity and energy efficiency are becoming more important than ever, we wanted to build products that people could truly depend on.")}
            </p>
            <p>
              {t("From durable batteries with long backup times to energy-efficient fans and intelligent inverters, every Voltaria product is designed with performance, quality, and customer satisfaction in mind.")}
            </p>
            <p>
              {t("Over time, Voltaria has grown into a trusted brand focused on innovation, reliability, and modern technology while maintaining affordable pricing for customers.")}
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Our Mission (Dual Column) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Office Image */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border border-gray-100">
              <Image
                src={t("/images/about-office.png")}
                alt={t("Voltaria team workflow")}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Mission parameters */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
            <div className="bg-red-600 rounded-[32px] p-8 md:p-12 text-white shadow-2xl border border-red-700">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">
                {t("OUR MISSION")}
              </h3>
              <p className="text-white text-base md:text-lg leading-relaxed font-bold uppercase">
                {t("Our mission is to provide innovative and dependable energy solutions that improve comfort, productivity, and everyday living while maintaining the highest standards of quality and performance.")}
              </p>
            </div>

            <p className="text-gray-700 text-sm md:text-base font-semibold leading-relaxed md:pl-4">
              {t("We aim to build long-term trust with customers through durable products, honest service, and continuous improvement.")}
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Our Vision (With Wavy Dashed Background Lines) */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background wavy dashed lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 300 C 300 100, 500 500, 900 300 C 1100 200, 1300 400, 1600 250" stroke="black" strokeWidth="2.5" strokeDasharray="8 8" />
            <path d="M-100 350 C 300 150, 500 550, 900 350 C 1100 250, 1300 450, 1600 300" stroke="black" strokeWidth="2.5" strokeDasharray="8 8" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tight">
            {t("OUR VISION")}
          </h2>
          <p className="text-gray-900 text-lg md:text-2xl font-black leading-relaxed max-w-3xl mx-auto uppercase">
            {t("To become a leading and trusted name in energy and home comfort sectors by delivering products that combine technology, efficiency, durability, and modern design.")}
          </p>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            {t("We envision a future where every home and business has access to reliable and smart energy solutions powered by voltaria.")}
          </p>
        </div>
      </section>

      {/* Section 6: Why Choose Voltaria */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tight">
              {t("WHY CHOOSE VOLTARIA")}
            </h2>
          </div>

          {/* 2x2 Red Grid Card */}
          <div className="bg-red-600 rounded-[40px] md:rounded-[60px] p-8 md:p-16 text-white shadow-2xl border border-red-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {/* Box 1 */}
              <div className="space-y-3">
                <h3 className="text-xl font-black uppercase tracking-wider">
                  {t("RELIABLE PERFORMANCE")}
                </h3>
                <p className="text-red-50 text-sm md:text-base leading-relaxed font-semibold">
                  {t("Our products are tested for consistent and dependable performance in real-world conditions.")}
                </p>
              </div>

              {/* Box 2 */}
              <div className="space-y-3">
                <h3 className="text-xl font-black uppercase tracking-wider">
                  {t("PREMIUM QUALITY")}
                </h3>
                <p className="text-red-50 text-sm md:text-base leading-relaxed font-semibold">
                  {t("We use only high-quality materials, strong build standards, and long-lasting durability.")}
                </p>
              </div>

              {/* Box 3 */}
              <div className="space-y-3">
                <h3 className="text-xl font-black uppercase tracking-wider">
                  {t("ENERGY EFFICIENCY")}
                </h3>
                <p className="text-red-50 text-sm md:text-base leading-relaxed font-semibold">
                  {t("Voltaria products are designed to reduce power consumption while maintaining performance.")}
                </p>
              </div>

              {/* Box 4 */}
              <div className="space-y-3">
                <h3 className="text-xl font-black uppercase tracking-wider">
                  {t("MODERN INNOVATION")}
                </h3>
                <p className="text-red-50 text-sm md:text-base leading-relaxed font-semibold">
                  {t("We continuously improve our products with smart technology and modern design trends.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding and Info */}
      <Footer cms={footerCms} />
    </div>
  );
}
