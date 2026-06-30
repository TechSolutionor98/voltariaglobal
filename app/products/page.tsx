import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublishedContent, getCmsVal } from "@/lib/cms-service";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const cms = await getPublishedContent("/products");
  const navbarCms = await getPublishedContent("[Global] Navbar");
  const footerCms = await getPublishedContent("[Global] Footer");

  const t = (val: string) => getCmsVal(cms, val);

  const products = [
    {
      id: "fans",
      title: t("PREMIUM AERODYNAMIC FANS"),
      tag: t("BULK FANS SOURCING"),
      description: t("Direct factory supply of premium aerodynamic residential and commercial fans in wholesale cartons. Custom private labeling (OEM) and container-load shipping are fully available for registered retail store networks, regional distributors, and electronic merchandise chains."),
      image: t("/images/voltaria-fan.png"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
          <path d="M16 8l4-4M4 20l4-4M8 4l4 4M12 16l4 4" className="opacity-40" />
        </svg>
      ),
      features: [
        t("OEM branding & custom faceplates available for orders exceeding 500 units"),
        t("Aerodynamically balanced blades preventing micro-wobbles and noise"),
        t("Double-shielded ball bearings for seamless friction-free spin"),
        t("Fully compliant with international home ventilation safety standards")
      ],
      specs: {
        [t("Wholesale Format")]: t("Crated boxes of 20 units"),
        [t("Min. Order Qty (MOQ)")]: t("50 Units"),
        [t("Monthly Supply Cap")]: t("10,000 Units"),
        [t("Operating Speed")]: t("380 RPM"),
        [t("Factory Warranty")]: t("2 Years Direct Replacement Warranty")
      }
    },
    /* {
      id: "batteries",
      title: t("DEEP-CYCLE TUBULAR BATTERIES"),
      tag: t("ENERGY STORAGE SUPPLY"),
      description: t("Factory-direct tall tubular backup battery cells supplied on heavy-duty pallets. Engineered with low water loss grids to survive demanding discharge cycles, our batteries are optimized for regional backup power dealers, solar equipment merchants, and corporate purchasing networks."),
      image: t("/images/voltaria-battery.png"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
          <line x1="22" y1="11" x2="22" y2="13" />
          <line x1="6" y1="11" x2="10" y2="11" />
          <line x1="6" y1="13" x2="12" y2="13" />
        </svg>
      ),
      features: [
        t("Palletized delivery with anti-acid venting caps"),
        t("Low water evaporation rate for extended maintenance-free windows"),
        t("Anti-corrosive grid structure designed to prevent active plate peeling"),
        t("Tiered pricing structures for verified battery distributors")
      ],
      specs: {
        [t("Wholesale Format")]: t("Palletized wood crates (12 units/pallet)"),
        [t("Min. Order Qty (MOQ)")]: t("24 Units (2 Pallets)"),
        [t("Capacity Selection")]: t("150Ah / 200Ah / 230Ah"),
        [t("Life Expectancy")]: t("1500+ Cycles at 80% Depth of Discharge"),
        [t("Factory Warranty")]: t("5 Years Direct Merchant Warranty")
      }
    }, */
    {
      id: "fuses-breakers",
      title: t("HIGH-SAFETY FUSES"),
      tag: t("OVERCURRENT PROTECTION WHOLESALE"),
      description: t("Safeguard retail shelves and commercial contractor stocks with Voltaria's high-speed circuit protection components. Our thermal-magnetic MCBs, fuses, and DB boxes are packed in high-density cases for electrical merchants and wholesale supply houses."),
      image: t("/images/voltaria-fuse-breaker.png"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <path d="M7 7l10 10" className="opacity-40" />
        </svg>
      ),
      features: [
        t("Ultra-fast tripping mechanisms certified to IEC 60898-1 standards"),
        t("High short-circuit breaking rating up to 10,000 Amps (10kA)"),
        t("Flame-retardant polycarbonate housing with high heat resistance"),
        t("Retail-ready barcode packaging or bulk industrial casing")
      ],
      specs: {
        [t("Wholesale Format")]: t("Cartons of 100 units (Inner boxes of 10)"),
        [t("Min. Order Qty (MOQ)")]: t("500 Units"),
        [t("Current Ratings")]: t("6A, 10A, 16A, 25A, 32A, 63A, 100A, 125A"),
        [t("Standards Compliance")]: t("IEC / CE Certified"),
        [t("Factory Warranty")]: t("3 Years Direct Warranty")
      }
    },
    {
      id: "changeovers",
      title: t("AUTOMATIC CHANGEOVERS (ATS)"),
      tag: t("POWER MANAGEMENT PANELS"),
      description: t("Eliminate transition power spikes with Voltaria smart ATS transfer panels. Supplying backup power manufacturers, generator builders, and industrial supply outlets with rapid changeover relays packed in secure crates."),
      image: t("/images/voltaria-changeover.png"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3L21 7L17 11" />
          <path d="M3 7H21" />
          <path d="M7 21L3 17L7 13" />
          <path d="M21 17H3" />
        </svg>
      ),
      features: [
        t("Rapid transfer speed (< 0.5s) preventing server/fridge restart cycles"),
        t("Integrated low-voltage and high-voltage auto-cutoff guards"),
        t("LED diagnostic parameters and auxiliary contacts for remote alarms"),
        t("Sturdy IP30 wall mount metallic housings")
      ],
      specs: {
        [t("Wholesale Format")]: t("Crated boxes of 10 panels"),
        [t("Min. Order Qty (MOQ)")]: t("20 Panels (2 Crates)"),
        [t("Max Current Rating")]: t("32A / 63A / 100A / 150A Options"),
        [t("Transfer Delay")]: t("< 0.5 Seconds"),
        [t("Factory Warranty")]: t("2 Years Direct replacement coverage")
      }
    },
    {
      id: "inverters",
      title: t("HYBRID SOLAR INVERTERS"),
      tag: t("POWER CONVERSION LOTS"),
      description: t("Pure sine wave hybrid solar inverters available in direct container loads. Offering backup system dealers, installers, and solar contractors factory-direct pricing scales, dedicated dealer parts support, and robust replacement coverage."),
      image: t("/images/voltaria-inverter.png"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      features: [
        t("Pure Sine Wave Output safeguarding sensitive computer circuitry"),
        t("Built-in MPPT controller optimizing solar array capture"),
        t("Sleek visual Circular LED dashboard panel displays"),
        t("Optional Wi-Fi integration for real-time fleet telematics mapping")
      ],
      specs: {
        [t("Wholesale Format")]: t("Protected wood crates of 5 inverters"),
        [t("Min. Order Qty (MOQ)")]: t("10 Inverters (2 Crates)"),
        [t("Capacity Selection")]: t("1.5 kVA / 3.0 kVA / 5.0 kVA"),
        [t("MPPT Solar Input")]: t("120V - 450V DC"),
        [t("Factory Warranty")]: t("2 Years Direct Manufacturer Warranty")
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-black">
      {/* Header Navigation */}
      <Navbar cms={navbarCms} />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-gray-50 to-white pt-24 pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-red-600 font-extrabold tracking-widest uppercase text-xs sm:text-sm block mb-4">
            {t("FACTORY DIRECT DISTRIBUTION")}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tight uppercase leading-none mb-6">
            {t("Products & Services")}
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed">
            {t("Voltaria Global is a direct B2B factory manufacturer and supplier. We do not sell retail. All product inventories are supplied exclusively in bulk orders, crates, and pallets to registered distributors, merchants, electrical stores, and dealer networks.")}
          </p>
        </div>
      </section>

      {/* Main Alternating Content */}
      <main className="flex-grow">
        {products.map((product, index) => {
          const isEven = index % 2 === 0;
          const bgClass = index % 2 === 1 ? "bg-gray-50/70 border-y border-gray-100/50" : "bg-white";
          
          return (
            <section key={index} id={product.id} className={`py-24 ${bgClass}`}>
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                  
                  {/* Content (Left on even index, Right on odd index) */}
                  <div className={`lg:col-span-7 order-2 ${isEven ? 'lg:order-1' : 'lg:order-2'} space-y-6`}>
                    {/* Category Tag & Icon */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                        {product.icon}
                      </div>
                      <span className="text-red-600 font-bold tracking-wider uppercase text-xs">
                        {product.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase tracking-tight leading-tight">
                      {product.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {product.description}
                    </p>

                    {/* Bullet Features */}
                    <ul className="space-y-3 pt-2">
                      {product.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Technical Specifications Sub-table */}
                    <div className="pt-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        {t("Technical Specifications")}
                      </h4>
                      <div className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <table className="w-full text-left border-collapse text-xs">
                          <tbody>
                            {Object.entries(product.specs).map(([key, val], sIdx) => (
                              <tr 
                                key={sIdx} 
                                className={`border-b last:border-0 border-gray-150 ${
                                  sIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                }`}
                              >
                                <td className="py-3 px-4 font-bold text-gray-500 uppercase tracking-wide w-2/5">
                                  {key}
                                </td>
                                <td className="py-3 px-4 font-bold text-gray-900">
                                  {val}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="pt-6">
                      <Link
                        href={`/products/${product.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
                      >
                        {t("View Full Range")}
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="3">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Image (Right on even index, Left on odd index) */}
                  <div className={`lg:col-span-5 order-1 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-[5/6] rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 group">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-w-1024px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* CTA Section */}
      <section className="py-24 bg-red-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <span className="text-white/80 font-black tracking-widest uppercase text-xs sm:text-sm block">
            {t("BECOME A REGISTERED DISTRIBUTOR")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight">
            {t("DIRECT FACTORY MERCHANT RATES")}
          </h2>
          <p className="max-w-xl mx-auto text-white/90 text-sm sm:text-base leading-relaxed">
            {t("Register your dealership, store, or reseller chain with Voltaria Global to access private catalogs, pallet pricing brackets, and direct-to-port container logistics.")}
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-block px-10 py-4 bg-white text-red-600 font-extrabold uppercase text-xs sm:text-sm rounded-full tracking-wider hover:bg-gray-100 active:scale-95 transition-all shadow-lg hover:shadow-2xl"
            >
              {t("Apply for Dealership Account")}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer cms={footerCms} />
    </div>
  );
}
