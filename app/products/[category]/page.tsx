import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const catalog: Record<string, CategoryData> = {
  fans: {
    title: "PREMIUM AERODYNAMIC FANS",
    description: "Discover Voltaria's high-efficiency ceiling, pedestal, and exhaust fans. Direct-to-merchant factory supply in container-load sizes, with OEM custom branding available for retail chains and distributors.",
    items: [
      {
        name: "Voltaria AeroBreeze Ceiling Fan",
        model: "AB-56C",
        image: "/images/voltaria-fan.png",
        description: "Aerodynamic high-speed ceiling fan with dual-shielded bearings and 100% copper motor, engineered for silent cooling.",
        features: ["56-inch sweep size", "Whisper-quiet double-shielded bearings", "Energy efficient < 55W consumption", "Precision-engineered aluminum alloy blades"],
        specs: { "Sweep Size": "1400mm (56\")", "Motor Type": "100% Pure Copper", "Speed": "380 RPM", "Power": "55W" },
        moq: "50 Units",
        capacity: "10,000 Units / Month",
        packaging: "Wood Pallet (20 units/carton)",
        customization: "OEM Logo Printing Available"
      },
      {
        name: "Voltaria WindStorm Pedestal Fan",
        model: "WS-16P",
        image: "/images/voltaria-fan.png",
        description: "High-torque portable pedestal fan with telescoping height adjustments and wide-angle oscillation.",
        features: ["16-inch high-velocity blade set", "3-speed remote control interface", "Thermal overload fuse protection", "Adjustable telescopic stand"],
        specs: { "Sweep Size": "400mm (16\")", "Speed Options": "3-Speed Settings", "Airflow Capacity": "85 CMM", "Power": "60W" },
        moq: "100 Units",
        capacity: "5,000 Units / Month",
        packaging: "Standard Cartons (1 unit/box)",
        customization: "OEM Housing Color Options"
      },
      {
        name: "Voltaria Cyclone Exhaust Fan",
        model: "CY-12E",
        image: "/images/voltaria-fan.png",
        description: "Heavy-duty rust-proof ventilation fan designed to rapidly clear air in kitchens, bathrooms, or workspaces.",
        features: ["Automatic back-draft louvers", "Rust-proof ABS body construction", "High-velocity suction speed", "Easy mount wall installation framework"],
        specs: { "Sweep Size": "300mm (12\")", "Speed": "1400 RPM", "Suction Power": "1200 m³/h", "Power": "45W" },
        moq: "100 Units",
        capacity: "8,000 Units / Month",
        packaging: "Industrial Cartons (10 units/box)",
        customization: "Custom Grille Color Available"
      }
    ]
  },
  batteries: {
    title: "DEEP-CYCLE TUBULAR BATTERIES",
    description: "Built to survive demanding power cycles and frequent utility failures. Palletized factory-direct shipping to battery distributors and solar dealerships.",
    items: [
      {
        name: "Voltaria VoltaCell Tall Tubular",
        model: "VC-150T",
        image: "/images/voltaria-battery.png",
        description: "Deep-cycle solar tall tubular battery designed to withstand frequent power outages and recover rapidly.",
        features: ["150Ah nominal capacity", "Ultra-thick antimony grid structure", "Extra-long water refilling windows", "Low resistance micro-porous separators"],
        specs: { "Voltage": "12V DC", "Capacity": "150Ah", "Reserve Time": "Up to 6 Hours", "Lifespan": "1500+ Cycles" },
        moq: "24 Units (2 Pallets)",
        capacity: "5,000 Units / Month",
        packaging: "Palletized wood crates (12 units/pallet)",
        customization: "Standard custom merchant colors"
      },
      {
        name: "Voltaria VoltaMax Tubular",
        model: "VM-200T",
        image: "/images/voltaria-battery.png",
        description: "Heavy-duty 200Ah battery engineered for high-surge inverter loads and reliable residential power backups.",
        features: ["200Ah storage capacity", "Acid level indicator float caps included", "Highly resistant to thermal runs", "Leak-proof grid vent design"],
        specs: { "Voltage": "12V DC", "Capacity": "200Ah", "Reserve Time": "Up to 8 Hours", "Lifespan": "1500+ Cycles" },
        moq: "24 Units (2 Pallets)",
        capacity: "5,000 Units / Month",
        packaging: "Palletized wood crates (12 units/pallet)",
        customization: "Standard custom merchant colors"
      },
      {
        name: "Voltaria VoltaSuper Max",
        model: "VS-230T",
        image: "/images/voltaria-battery.png",
        description: "Commercial-grade 230Ah tall tubular battery providing maximum backup capacity for servers and heavy inductive loads.",
        features: ["230Ah ultra capacity", "Optimized active paste material", "5-year comprehensive coverage warranty", "Reinforced safety plastic handles"],
        specs: { "Voltage": "12V DC", "Capacity": "230Ah", "Reserve Time": "Up to 10 Hours", "Lifespan": "1800+ Cycles" },
        moq: "12 Units (1 Pallet)",
        capacity: "3,000 Units / Month",
        packaging: "Palletized wood crates (12 units/pallet)",
        customization: "Custom Terminal Caps Available"
      }
    ]
  },
  "fuses-breakers": {
    title: "HIGH-SAFETY FUSES & BREAKERS",
    description: "Safeguard machinery and contractor stocks with Voltaria's high-speed circuit protection components. High-density casing optimized for electrical stores and wholesale supply houses.",
    items: [
      {
        name: "Voltaria SafeGuard Single-Pole MCB",
        model: "SG-16MCB",
        image: "/images/voltaria-fuse-breaker.png",
        description: "High-accuracy miniature circuit breaker for overload and short-circuit protection in residential boards.",
        features: ["16A current rating (C-curve)", "10,000A (10kA) breaking capacity", "Finger-safe IP20 insulated terminals", "Fast magnetic-thermal release"],
        specs: { "Rated Voltage": "230V AC", "Amperage": "16A", "Frequency": "50/60Hz", "Compliance": "IEC 60898-1" },
        moq: "500 Units",
        capacity: "50,000 Units / Month",
        packaging: "Cartons of 100 units (Inner boxes of 10)",
        customization: "Custom branding print available"
      },
      {
        name: "Voltaria SafeGuard Double-Pole MCB",
        model: "SG-32MCB",
        image: "/images/voltaria-fuse-breaker.png",
        description: "Double-pole primary line isolation breaker with high thermal-magnetic tripping speed.",
        features: ["32A main power breaker", "Flame-retardant polycarbonate casing", "Din-rail mounted convenience clip", "Dual-break contact safety systems"],
        specs: { "Rated Voltage": "230V/400V AC", "Amperage": "32A", "Poles": "2-Pole (DP)", "Breaking Capacity": "10kA" },
        moq: "500 Units",
        capacity: "50,000 Units / Month",
        packaging: "Cartons of 100 units (Inner boxes of 10)",
        customization: "Custom branding print available"
      },
      {
        name: "Voltaria SafeGuard Distribution Board",
        model: "SG-8WYDB",
        image: "/images/voltaria-fuse-breaker.png",
        description: "Insulated 8-way distribution panel box with copper busbars and acrylic safety window.",
        features: ["8-way Din-rail capacity", "Electrostatically coated metal box", "Integrated neutral and ground busbars", "Removable top and bottom gland plates"],
        specs: { "Capacity": "8 Modules", "Mounting": "Flush / Surface", "IP Rating": "IP40 Protection", "Material": "Cold-Rolled Steel" },
        moq: "100 Units",
        capacity: "10,000 Units / Month",
        packaging: "Individually boxed inside metal crates",
        customization: "OEM Grille Paint Customization"
      }
    ]
  },
  changeovers: {
    title: "AUTOMATIC CHANGEOVERS (ATS)",
    description: "Eliminate transition power spikes with Voltaria smart ATS transfer panels. Supplying backup power manufacturers, generator builders, and industrial outlets with rapid changeover relays packed in secure crates.",
    items: [
      {
        name: "Voltaria SmartATS 63A",
        model: "S-ATS63",
        image: "/images/voltaria-changeover.png",
        description: "Dual-source smart automatic transfer panel with integrated under/over voltage protection parameters.",
        features: ["63A current capacity", "Rapid transfer speed (< 0.5s)", "Clear LED diagnostics display screen", "Auto generator command start relay"],
        specs: { "Rated Voltage": "220V/240V AC", "Amperage": "63A", "Transfer Time": "< 0.4s", "Warranty": "2 Years" },
        moq: "20 Panels (2 Crates)",
        capacity: "2,000 Units / Month",
        packaging: "Crated cartons of 10 panels",
        customization: "OEM wiring setups available"
      },
      {
        name: "Voltaria SmartATS 100A Heavy-Duty",
        model: "S-ATS100",
        image: "/images/voltaria-changeover.png",
        description: "Industrial-grade ATS supporting generator startup triggers and heavy corporate air conditioner loads.",
        features: ["100A high load support", "Integrated auxiliary contact ports", "External manual override key switch", "Flame-retardant arc grid sheets"],
        specs: { "Rated Voltage": "400V AC Max", "Amperage": "100A", "Poles": "4-Pole", "Warranty": "2 Years" },
        moq: "10 Panels (1 Crate)",
        capacity: "1,500 Units / Month",
        packaging: "Padded wooden crate (10 panels/crate)",
        customization: "OEM Custom Enclosure Labeling"
      }
    ]
  },
  inverters: {
    title: "HYBRID SOLAR INVERTERS",
    description: "Pure sine wave hybrid solar inverters available in direct container loads. Offering backup system dealers, solar contractors, and installers factory-direct merchant pricing scales and part warranties.",
    items: [
      {
        name: "Voltaria SolX Hybrid 1.5kVA",
        model: "SX-1.5H",
        image: "/images/voltaria-inverter.png",
        description: "Sleek wall-mounted hybrid solar inverter with integrated MPPT charge controller and pure sine wave voltage.",
        features: ["1.5 kVA capacity", "Built-in 80A MPPT solar regulator", "Compatible with lead-acid & lithium cells", "Multi-stage battery management optimization"],
        specs: { "Capacity": "1500VA / 1200W", "Battery Voltage": "12V DC Input", "MPPT Voltage": "120V - 450V DC", "Output Wave": "Pure Sine Wave" },
        moq: "10 Inverters (2 Crates)",
        capacity: "3,000 Units / Month",
        packaging: "Padded wood crates (5 inverters/crate)",
        customization: "Merchant app dashboard integrations"
      },
      {
        name: "Voltaria SolX Hybrid 3kVA",
        model: "SX-3.0H",
        image: "/images/voltaria-inverter.png",
        description: "High-performance hybrid solar inverter designed to power complete household loads and dual-battery packages.",
        features: ["3.0 kVA capacity", "Intelligent battery charger optimizer", "Configurable solar/mains priority flow", "Backlit graphical configuration console"],
        specs: { "Capacity": "3000VA / 2400W", "Battery Voltage": "24V DC Input", "MPPT Voltage": "120V - 450V DC", "Output Wave": "Pure Sine Wave" },
        moq: "10 Inverters (2 Crates)",
        capacity: "3,000 Units / Month",
        packaging: "Padded wood crates (5 inverters/crate)",
        customization: "Merchant app dashboard integrations"
      },
      {
        name: "Voltaria SolX Hybrid 5kVA Wi-Fi",
        model: "SX-5.0H",
        image: "/images/voltaria-inverter.png",
        description: "Premium commercial-grade hybrid inverter with built-in Wi-Fi logging and comprehensive mobile app dashboard.",
        features: ["5.0 kVA capacity", "Zero-transfer bypass mode", "Parallel expansion options up to 30kVA", "Remote web console and Wi-Fi antennas"],
        specs: { "Capacity": "5000VA / 4000W", "Battery Voltage": "48V DC Input", "MPPT Voltage": "120V - 450V DC", "Output Wave": "Pure Sine Wave" },
        moq: "5 Inverters (1 Crate)",
        capacity: "2,000 Units / Month",
        packaging: "Padded wood crates (5 inverters/crate)",
        customization: "Dedicated wholesale app integrations"
      }
    ]
  }
};

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const categoryData = catalog[category];
  
  if (!categoryData) {
    return {
      title: "Category Not Found | Voltaria Global",
    };
  }

  return {
    title: `${categoryData.title} | B2B Sourcing Portal | Voltaria Global`,
    description: categoryData.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryData = catalog[category];

  if (!categoryData) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-black">
      {/* Header Navigation */}
      <Navbar />

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
            Back to B2B Catalog
          </Link>
          <span className="text-red-600 font-extrabold tracking-widest uppercase text-xs sm:text-sm block mb-4">
            B2B WHOLESALE SOURCING PORTAL
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
      <main className="flex-grow py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="divide-y divide-gray-100">
            {categoryData.items.map((item, index) => (
              <div 
                key={index} 
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-16 group"
              >
                {/* Column 1: Image (4 cols) */}
                <div className="lg:col-span-4 flex flex-col lg:h-full">
                  {/* Product Image */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100/60 shadow-inner flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                    <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-red-600 text-white font-extrabold text-xxs tracking-wider rounded-full uppercase shadow-md z-10">
                      Model: {item.model}
                    </span>
                  </div>
                </div>

                {/* Column 2: Title, Description & Highlights (4 cols) */}
                <div className="lg:col-span-4 flex flex-col lg:h-full space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-950 uppercase tracking-tight leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Product Highlights */}
                  <ul className="space-y-2">
                    {item.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-gray-700">
                        <svg className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Technical Parameters & Button (4 cols) */}
                <div className="lg:col-span-4 flex flex-col justify-between lg:h-full space-y-6">
                  {/* Specifications sub-table */}
                  <div className="space-y-2">
                    <h4 className="text-xxs font-black text-gray-400 uppercase tracking-widest">
                      Technical Parameters
                    </h4>
                    <div className="border border-gray-150/80 rounded-xl overflow-hidden text-xxs bg-white shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          {Object.entries(item.specs).map(([key, val], sIdx) => (
                            <tr key={sIdx} className="border-b last:border-0 border-gray-100">
                              <td className="py-2.5 px-3.5 font-extrabold text-gray-400 uppercase tracking-wide">
                                {key}
                              </td>
                              <td className="py-2.5 px-3.5 font-bold text-gray-800">
                                {val}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* CTA Request Button */}
                  <div>
                    <Link
                      href={`/contact?inquiry=${encodeURIComponent(item.name + " (" + item.model + ") - Wholesale Bulk Inquiry")}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-98 cursor-pointer"
                    >
                      Request Bulk Quote
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="3">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
