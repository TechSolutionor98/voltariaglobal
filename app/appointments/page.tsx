import { getPublishedContent } from "@/lib/cms-service";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppointmentLinksView from "./AppointmentLinksView";
import { getDb } from "@/lib/mongodb";
import { generateCmsMetadata } from "@/lib/cms-fetch";
import JsonLdScript from "@/components/JsonLdScript";

export const revalidate = 60;

export async function generateMetadata() {
  return generateCmsMetadata('/appointments', {
    title: 'Book an Appointment - Voltaria Global',
    description: 'Schedule an appointment with Voltaria Global using our easy online booking system.',
  });
}

export default async function AppointmentsPublicPage() {
  const [navbarCms, footerCms] = await Promise.all([
    getPublishedContent("[Global] Navbar"),
    getPublishedContent("[Global] Footer")
  ]);

  let links = [];
  try {
    const db = await getDb();
    const doc = await db.collection('appointments').findOne({ _id: 'appointment_links' });
    links = doc?.links || [];
  } catch (err) {
    console.error('Error fetching appointment links:', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans antialiased text-black">
      <JsonLdScript path="/appointments" />
      {/* Header Navigation */}
      <Navbar cms={navbarCms} />

      <main className="flex-grow pt-10">
        <AppointmentLinksView links={links} />
      </main>

      {/* Footer Branding and Info */}
      <Footer cms={footerCms} />
    </div>
  );
}
