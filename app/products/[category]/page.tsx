import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublishedContent, getCmsVal } from "@/lib/cms-service";

export const dynamic = "force-dynamic";

interface ProductItem {
  name: string;
  model: string;
  image: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  moq: string;
  capacity: string;
  packaging: string;
  customization: string;
}

interface CategoryData {
  title: string;
  description: string;
  items: ProductItem[];
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const cms = await getPublishedContent(`/products/${category}`);
  const t = (val: string) => getCmsVal(cms, val);
  
  const defaultTitles: Record<string, string> = {
    fans: "PREMIUM AERODYNAMIC FANS",
    batteries: "DEEP-CYCLE TUBULAR BATTERIES",
    "fuses-breakers": "HIGH-SAFETY FUSES & BREAKERS",
    changeovers: "AUTOMATIC CHANGEOVERS (ATS)",
    inverters: "HYBRID SOLAR INVERTERS"
  };
  
  const title = t(defaultTitles[category] || "Category Not Found");
  
  return {
    title: `${title} | B2B Sourcing Portal | Voltaria Global`,
    description: t("B2B wholesale sourcing portal for premium electrical hardware."),
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cms = await getPublishedContent(`/products/${category}`);
  const navbarCms = await getPublishedContent("[Global] Navbar");
  const footerCms = await getPublishedContent("[Global] Footer");

  const t = (val: string) => getCmsVal(cms, val);

  const catalog: Record<string, CategoryData> = {
    fans: {
      title: t("PREMIUM AERODYNAMIC FANS"),
      description: t("Discover Voltaria's high-efficiency ceiling, pedestal, and exhaust fans. Direct-to-merchant factory supply in container-load sizes, with OEM custom branding available for retail chains and distributors."),
      items: [
        {
          name: t("Voltaria AeroBreeze Ceiling Fan"),
          model: t("AB-56C"),
          image: t("/images/voltaria-fan.png"),
          description: t("Aerodynamic high-speed ceiling fan with dual-shielded bearings and 100% copper motor, engineered for silent cooling."),
          features: [t("56-inch sweep size"), t("Whisper-quiet double-shielded bearings"), t("Energy efficient < 55W consumption"), t("Precision-engineered aluminum alloy blades")],
          specs: { [t("Sweep Size")]: t("1400mm (56\")"), [t("Motor Type")]: t("100% Pure Copper"), [t("Speed")]: t("380 RPM"), [t("Power")]: t("55W") },
          moq: t("50 Units"),
          capacity: t("10,000 Units / Month"),
          packaging: t("Wood Pallet (20 units/carton)"),
          customization: t("OEM Logo Printing Available")
        },
        {
          name: t("Voltaria WindStorm Pedestal Fan"),
          model: t("WS-16P"),
          image: t("/images/voltaria-pedestal-fan.png"),
          description: t("High-torque portable pedestal fan with telescoping height adjustments and wide-angle oscillation."),
          features: [t("16-inch high-velocity blade set"), t("3-speed remote control interface"), t("Thermal overload fuse protection"), t("Adjustable telescopic stand")],
          specs: { [t("Sweep Size")]: t("400mm (16\")"), [t("Speed Options")]: t("3-Speed Settings"), [t("Airflow Capacity")]: t("85 CMM"), [t("Power")]: t("60W") },
          moq: t("100 Units"),
          capacity: t("5,000 Units / Month"),
          packaging: t("Standard Cartons (1 unit/box)"),
          customization: t("OEM Housing Color Options")
        },
        {
          name: t("Voltaria Cyclone Exhaust Fan"),
          model: t("CY-12E"),
          image: t("/images/voltaria-exhaust-fan.png"),
          description: t("Heavy-duty rust-proof ventilation fan designed to rapidly clear air in kitchens, bathrooms, or workspaces."),
          features: [t("Automatic back-draft louvers"), t("Rust-proof ABS body construction"), t("High-velocity suction speed"), t("Easy mount wall installation framework")],
          specs: { [t("Sweep Size")]: t("300mm (12\")"), [t("Speed")]: t("1400 RPM"), [t("Suction Power")]: t("1200 m³/h"), [t("Power")]: t("45W") },
          moq: t("100 Units"),
          capacity: t("8,000 Units / Month"),
          packaging: t("Industrial Cartons (10 units/box)"),
          customization: t("Custom Grille Color Available")
        }
      ]
    },
    batteries: {
      title: t("DEEP-CYCLE TUBULAR BATTERIES"),
      description: t("Built to survive demanding power cycles and frequent utility failures. Palletized factory-direct shipping to battery distributors and solar dealerships."),
      items: [
        {
          name: t("Voltaria VoltaCell Tall Tubular"),
          model: t("VC-150T"),
          image: t("/images/voltaria-battery-tall.png"),
          description: t("Deep-cycle solar tall tubular battery designed to withstand frequent power outages and recover rapidly."),
          features: [t("150Ah nominal capacity"), t("Ultra-thick antimony grid structure"), t("Extra-long water refilling windows"), t("Low resistance micro-porous separators")],
          specs: { [t("Voltage")]: t("12V DC"), [t("Capacity")]: t("150Ah"), [t("Reserve Time")]: t("Up to 6 Hours"), [t("Lifespan")]: t("1500+ Cycles") },
          moq: t("24 Units (2 Pallets)"),
          capacity: t("5,000 Units / Month"),
          packaging: t("Palletized wood crates (12 units/pallet)"),
          customization: t("Standard custom merchant colors")
        },
        {
          name: t("Voltaria VoltaMax Tubular"),
          model: t("VM-200T"),
          image: t("/images/voltaria-battery-max.png"),
          description: t("Heavy-duty 200Ah battery engineered for high-surge inverter loads and reliable residential power backups."),
          features: [t("200Ah storage capacity"), t("Acid level indicator float caps included"), t("Highly resistant to thermal runs"), t("Leak-proof grid vent design")],
          specs: { [t("Voltage")]: t("12V DC"), [t("Capacity")]: t("200Ah"), [t("Reserve Time")]: t("Up to 8 Hours"), [t("Lifespan")]: t("1500+ Cycles") },
          moq: t("24 Units (2 Pallets)"),
          capacity: t("5,000 Units / Month"),
          packaging: t("Palletized wood crates (12 units/pallet)"),
          customization: t("Standard custom merchant colors")
        },
        {
          name: t("Voltaria VoltaSuper Max"),
          model: t("VS-230T"),
          image: t("/images/voltaria-battery-super.png"),
          description: t("Commercial-grade 230Ah tall tubular battery providing maximum backup capacity for servers and heavy inductive loads."),
          features: [t("230Ah ultra capacity"), t("Optimized active paste material"), t("5-year comprehensive coverage warranty"), t("Reinforced safety plastic handles")],
          specs: { [t("Voltage")]: t("12V DC"), [t("Capacity")]: t("230Ah"), [t("Reserve Time")]: t("Up to 10 Hours"), [t("Lifespan")]: t("1800+ Cycles") },
          moq: t("12 Units (1 Pallet)"),
          capacity: t("3,000 Units / Month"),
          packaging: t("Palletized wood crates (12 units/pallet)"),
          customization: t("Custom Terminal Caps Available")
        }
      ]
    },
    "fuses-breakers": {
      title: t("HIGH-SAFETY FUSES & BREAKERS"),
      description: t("Safeguard machinery and contractor stocks with Voltaria's high-speed circuit protection components. High-density casing optimized for electrical stores and wholesale supply houses."),
      items: [
        {
          name: t("Voltaria SafeGuard Single-Pole MCB"),
          model: t("SG-16MCB"),
          image: t("/images/voltaria-mcb-single.png"),
          description: t("High-accuracy miniature circuit breaker for overload and short-circuit protection in residential boards."),
          features: [t("16A current rating (C-curve)"), t("10,000A (10kA) breaking capacity"), t("Finger-safe IP20 insulated terminals"), t("Fast magnetic-thermal release")],
          specs: { [t("Rated Voltage")]: t("230V AC"), [t("Amperage")]: t("16A"), [t("Frequency")]: t("50/60Hz"), [t("Compliance")]: t("IEC 60898-1") },
          moq: t("500 Units"),
          capacity: t("50,000 Units / Month"),
          packaging: t("Cartons of 100 units (Inner boxes of 10)"),
          customization: t("Custom branding print available")
        },
        {
          name: t("Voltaria SafeGuard Double-Pole MCB"),
          model: t("SG-32MCB"),
          image: t("/images/voltaria-mcb-double.png"),
          description: t("Double-pole primary line isolation breaker with high thermal-magnetic tripping speed."),
          features: [t("32A main power breaker"), t("Flame-retardant polycarbonate casing"), t("Din-rail mounted convenience clip"), t("Dual-break contact safety systems")],
          specs: { [t("Rated Voltage")]: t("230V/400V AC"), [t("Amperage")]: t("32A"), [t("Poles")]: t("2-Pole (DP)"), [t("Breaking Capacity")]: t("10kA") },
          moq: t("500 Units"),
          capacity: t("50,000 Units / Month"),
          packaging: t("Cartons of 100 units (Inner boxes of 10)"),
          customization: t("Custom branding print available")
        },
        {
          name: t("Voltaria SafeGuard Distribution Board"),
          model: t("SG-8WYDB"),
          image: t("/images/voltaria-distribution-board.png"),
          description: t("Insulated 8-way distribution panel box with copper busbars and acrylic safety window."),
          features: [t("8-way Din-rail capacity"), t("Electrostatically coated metal box"), t("Integrated neutral and ground busbars"), t("Removable top and bottom gland plates")],
          specs: { [t("Capacity")]: t("8 Modules"), [t("Mounting")]: t("Flush / Surface"), [t("IP Rating")]: t("IP40 Protection"), [t("Material")]: t("Cold-Rolled Steel") },
          moq: t("100 Units"),
          capacity: t("10,000 Units / Month"),
          packaging: t("Individually boxed inside metal crates"),
          customization: t("OEM Grille Paint Customization")
        }
      ]
    },
    changeovers: {
      title: t("AUTOMATIC CHANGEOVERS (ATS)"),
      description: t("Eliminate transition power spikes with Voltaria smart ATS transfer panels. Supplying backup power manufacturers, generator builders, and industrial outlets with rapid changeover relays packed in secure crates."),
      items: [
        {
          name: t("Voltaria SmartATS 63A"),
          model: t("S-ATS63"),
          image: t("/images/voltaria-changeover-63a.png"),
          description: t("Dual-source smart automatic transfer panel with integrated under/over voltage protection parameters."),
          features: [t("63A current capacity"), t("Rapid transfer speed (< 0.5s)"), t("Clear LED diagnostics display screen"), t("Auto generator command start relay")],
          specs: { [t("Rated Voltage")]: t("220V/240V AC"), [t("Amperage")]: t("63A"), [t("Transfer Time")]: t("< 0.4s"), [t("Warranty")]: t("2 Years") },
          moq: t("20 Panels (2 Crates)"),
          capacity: t("2,000 Units / Month"),
          packaging: t("Crated cartons of 10 panels"),
          customization: t("OEM wiring setups available")
        },
        {
          name: t("Voltaria SmartATS 100A Heavy-Duty"),
          model: t("S-ATS100"),
          image: t("/images/voltaria-changeover-100a.png"),
          description: t("Industrial-grade ATS supporting generator startup triggers and heavy corporate air conditioner loads."),
          features: [t("100A high load support"), t("Integrated auxiliary contact ports"), t("External manual override key switch"), t("Flame-retardant arc grid sheets")],
          specs: { [t("Rated Voltage")]: t("400V AC Max"), [t("Amperage")]: t("100A"), [t("Poles")]: t("4-Pole"), [t("Warranty")]: t("2 Years") },
          moq: t("10 Panels (1 Crate)"),
          capacity: t("1,500 Units / Month"),
          packaging: t("Padded wooden crate (10 panels/crate)"),
          customization: t("OEM Custom Enclosure Labeling")
        }
      ]
    },
    inverters: {
      title: t("HYBRID SOLAR INVERTERS"),
      description: t("Pure sine wave hybrid solar inverters available in direct container loads. Offering backup system dealers, solar contractors, and installers factory-direct merchant pricing scales and part warranties."),
      items: [
        {
          name: t("Voltaria SolX Hybrid 1.5kVA"),
          model: t("SX-1.5H"),
          image: t("/images/voltaria-inverter-1.5kva.png"),
          description: t("Sleek wall-mounted hybrid solar inverter with integrated MPPT charge controller and pure sine wave voltage."),
          features: [t("1.5 kVA capacity"), t("Built-in 80A MPPT solar regulator"), t("Compatible with lead-acid & lithium cells"), t("Multi-stage battery management optimization")],
          specs: { [t("Capacity")]: t("1500VA / 1200W"), [t("Battery Voltage")]: t("12V DC Input"), [t("MPPT Voltage")]: t("120V - 450V DC"), [t("Output Wave")]: t("Pure Sine Wave") },
          moq: t("10 Inverters (2 Crates)"),
          capacity: t("3,000 Units / Month"),
          packaging: t("Padded wood crates (5 inverters/crate)"),
          customization: t("Merchant app dashboard integrations")
        },
        {
          name: t("Voltaria SolX Hybrid 3kVA"),
          model: t("SX-3.0H"),
          image: t("/images/voltaria-inverter-3kva.png"),
          description: t("High-performance hybrid solar inverter designed to power complete household loads and dual-battery packages."),
          features: [t("3.0 kVA capacity"), t("Intelligent battery charger optimizer"), t("Configurable solar/mains priority flow"), t("Backlit graphical configuration console")],
          specs: { [t("Capacity")]: t("3000VA / 2400W"), [t("Battery Voltage")]: t("24V DC Input"), [t("MPPT Voltage")]: t("120V - 450V DC"), [t("Output Wave")]: t("Pure Sine Wave") },
          moq: t("10 Inverters (2 Crates)"),
          capacity: t("3,000 Units / Month"),
          packaging: t("Padded wood crates (5 inverters/crate)"),
          customization: t("Merchant app dashboard integrations")
        },
        {
          name: t("Voltaria SolX Hybrid 5kVA Wi-Fi"),
          model: t("SX-5.0H"),
          image: t("/images/voltaria-inverter-5kva.png"),
          description: t("Premium commercial-grade hybrid inverter with built-in Wi-Fi logging and comprehensive mobile app dashboard."),
          features: [t("5.0 kVA capacity"), t("Zero-transfer bypass mode"), t("Parallel expansion options up to 30kVA"), t("Remote web console and Wi-Fi antennas")],
          specs: { [t("Capacity")]: t("5000VA / 4000W"), [t("Battery Voltage")]: t("48V DC Input"), [t("MPPT Voltage")]: t("120V - 450V DC"), [t("Output Wave")]: t("Pure Sine Wave") },
          moq: t("5 Inverters (1 Crate)"),
          capacity: t("2,000 Units / Month"),
          packaging: t("Padded wood crates (5 inverters/crate)"),
          customization: t("Dedicated wholesale app integrations")
        }
      ]
    }
  };

  const categoryData = catalog[category];

  if (!categoryData) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-black">
      {/* Header Navigation */}
      <Navbar cms={navbarCms} />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-gray-50 to-white pt-24 pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-red-600 uppercase tracking-widest mb-6 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="3">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {t("Back to B2B Catalog")}
          </Link>
          <span className="text-red-600 font-extrabold tracking-widest uppercase text-xs sm:text-sm block mb-4">
            {t("B2B WHOLESALE SOURCING PORTAL")}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tight uppercase leading-none mb-6">
            {categoryData.title}
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 text-sm sm:text-base leading-relaxed">
            {categoryData.description}
          </p>
        </div>
      </section>

      {/* Products Catalog List */}
      <main className="flex-grow">
        {categoryData.items.map((item, index) => {
          const isEven = index % 2 === 0;
          const bgClass = index % 2 === 1 ? "bg-gray-50/70 border-y border-gray-100/50" : "bg-white";
          
          return (
            <section key={index} className={`py-24 ${bgClass}`}>
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                  
                  {/* Content (Left on even index, Right on odd index) */}
                  <div className={`lg:col-span-7 order-2 ${isEven ? 'lg:order-1' : 'lg:order-2'} space-y-6`}>
                    {/* Model Badge */}
                    <div className="flex items-center gap-3">
                      <span className="bg-red-50 text-red-600 font-extrabold text-xs tracking-wider px-3.5 py-1.5 rounded-full uppercase shadow-sm">
                        {t("Model:")} {item.model}
                      </span>
                    </div>

                    {/* Title / Name */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase tracking-tight leading-tight">
                      {item.name}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {item.description}
                    </p>

                    {/* Bullet Highlights */}
                    <ul className="space-y-3 pt-2">
                      {item.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Technical Parameters Sub-table */}
                    <div className="pt-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        {t("Technical Parameters")}
                      </h4>
                      <div className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <table className="w-full text-left border-collapse text-xs">
                          <tbody>
                            {Object.entries(item.specs).map(([key, val], sIdx) => (
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

                    {/* Request Bulk Quote button */}
                    <div className="pt-6">
                      <Link
                        href={`/contact?inquiry=${encodeURIComponent(item.name + " (" + item.model + ") - Wholesale Bulk Inquiry")}`}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
                      >
                        {t("Request Bulk Quote")}
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="3">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Image (Right on even index, Left on odd index) */}
                  <div className={`lg:col-span-5 order-1 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-[5/6] rounded-[32px] overflow-hidden shadow-2xl border border-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-w-1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* Footer */}
      <Footer cms={footerCms} />
    </div>
  );
}
