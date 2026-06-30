import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublishedContent, getCmsVal } from "@/lib/cms-service";
import ImageZoom from "@/components/ImageZoom";

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

  let categoryData: CategoryData | undefined;
  switch (category) {
    case 'fans':
      categoryData = require('./data/fans').default(t);
      break;
    case 'batteries':
      categoryData = require('./data/batteries').default(t);
      break;
    case 'fuses-breakers':
      categoryData = require('./data/fuses-breakers').default(t);
      break;
    case 'changeovers':
      categoryData = require('./data/changeovers').default(t);
      break;
    case 'inverters':
      categoryData = require('./data/inverters').default(t);
      break;
  }

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
                    <div className={`relative aspect-square sm:aspect-[4/3] lg:aspect-[5/6] ${['fans', 'changeovers', 'inverters'].includes(category) ? '' : 'rounded-[32px] overflow-hidden border border-gray-100'}`}>
                      <ImageZoom
                        src={item.image}
                        alt={item.name}
                        isZoomable={true}
                        objectFit={['fans', 'changeovers', 'inverters'].includes(category) ? 'contain' : 'cover'}
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
