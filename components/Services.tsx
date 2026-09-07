"use client";

import Image from "next/image";
import Link from "next/link";
import { getCmsVal } from "@/lib/api-helper";

export default function Services({ cms }: { cms?: any }) {
  const t = (val: string) => getCmsVal(cms, val);

  const offerings = [
    {
      title: t("PREMIUM FANS"),
      link: "/products/fans",
      image: t("/images/custom-fan.png"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-600 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
          <path d="M16 8l4-4M4 20l4-4M8 4l4 4M12 16l4 4" className="opacity-40" />
        </svg>
      ),
      description: t("Ceiling, pedestal, and exhaust fan models. Engineered with heavy-copper coils and aerodynamic blades for silent, high-output air circulation.")
    },
    {
      title: t("PEDESTAL AC DC FAN"),
      link: "/products/fans",
      image: t("/images/custom-pedestal-fan.png"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-600 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
          <path d="M16 8l4-4M4 20l4-4M8 4l4 4M12 16l4 4" className="opacity-40" />
        </svg>
      ),
      description: t("High-efficiency AC/DC pedestal fans. Portable cooling solutions designed for low power consumption and optimal airflow in any space.")
    },
    {
      title: t("HIGH-SAFETY FUSES"),
      link: "/products/fuses-breakers",
      image: t("/images/voltaria-fuse-breaker.png"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-600 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <path d="M7 7l10 10" className="opacity-40" />
        </svg>
      ),
      description: t("Fast-acting fuses, distribution boards, and thermal-magnetic circuit breakers designed to instantly isolate over-current surges.")
    },
    {
      title: t("AUTOMATIC CHANGEOVERS"),
      link: "/products/changeovers",
      image: t("/images/custom-changeover.png"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-600 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3L21 7L17 11" />
          <path d="M3 7H21" />
          <path d="M7 21L3 17L7 13" />
          <path d="M21 17H3" />
        </svg>
      ),
      description: t("Smart automatic transfer switches (ATS). Seamlessly flips your load from mains grid to generator/UPS backup with zero human intervention.")
    },
    {
      title: t("HYBRID INVERTERS"),
      link: "/products/inverters",
      image: t("/images/custom-inverter.png"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-600 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      description: t("Pure sine wave solar-ready and smart grid-tied hybrid inverters. Smooth power conversion safeguarding your computer systems and fridge motors.")
    },
    {
      title: t("DC SOLAR WATER PUMP"),
      link: "/products/solar-water-pump",
      image: t("/images/dc-solar-water-pump.png"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-600 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v6" />
          <path d="M12 18v4" />
          <path d="M4.93 4.93l4.24 4.24" />
          <path d="M14.83 14.83l4.24 4.24" />
          <path d="M2 12h6" />
          <path d="M18 12h4" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
      description: t("High-efficiency DC solar surface water pumps with MPPT controller and pure copper PMSM motor for agricultural irrigation and water transfer.")
    }
  ];

  return (
    <section className="py-24 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-red-600 font-bold tracking-widest uppercase text-sm block mb-3">{t("WHAT WE OFFER")}</span>
          <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tight leading-tight">{t("Voltaria Global offers")}</h2>
          <p className="mt-4 text-gray-500 text-sm md:text-base leading-relaxed">{t("Voltaria Global manufactures a reliable catalog of electrical products designed to stabilize and safeguard power delivery for any property.")}</p>
        </div>

        {/* Offerings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerings.map((item, index) => (
            <div 
              key={index}
              className="group flex flex-col justify-between p-6 rounded-3xl border border-gray-100 bg-white hover:shadow-2xl hover:border-red-100 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div>
                {/* Image Container */}
                {item.image && (
                  <div className="w-full h-48 mb-6 relative rounded-2xl overflow-hidden bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill 
                      sizes="(max-w-768px) 100vw, 33vw"
                      unoptimized
                      className="object-contain p-4 mix-blend-multiply" 
                    />
                  </div>
                )}
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-950 tracking-wide mb-3 uppercase flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                    {item.icon}
                  </span>
                  {item.title}
                </h3>
                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Configure CTA */}
              <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 group-hover:text-red-600 transition-colors uppercase tracking-wider">{t("Industrial Grade")}</span>
                <Link
                  href={item.link}
                  className="text-xs font-bold text-red-600 flex items-center gap-1 hover:text-red-700 uppercase tracking-widest"
                >
                  {t("View Details")}
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="3">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
