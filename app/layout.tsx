import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getDb } from "@/lib/mongodb";
import { Suspense } from "react";
import AnalyticsTracker from "@/components/Layout/AnalyticsTracker";
import CustomScripts from "@/components/Layout/CustomScripts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voltaria Global",
  description: "Voltaria Global",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  try {
    const db = await getDb();
    settings = await db.collection("settings").findOne({ _id: "website_settings" });
  } catch (err) {
    console.error("Failed to load settings in RootLayout:", err);
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        {settings?.googleTagManagerId && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `
                <iframe src="https://www.googletagmanager.com/ns.html?id=${settings.googleTagManagerId}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
              `
            }}
          />
        )}

        {/* Facebook Pixel (noscript) */}
        {settings?.facebookPixelId && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${settings.facebookPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}

        {/* Dynamic tracking pixel script loader and transition tracker */}
        <Suspense fallback={null}>
          <AnalyticsTracker settings={settings} />
        </Suspense>

        {/* Client side custom head & body scripts injector */}
        <CustomScripts settings={settings} />

        {children}
      </body>
    </html>
  );
}
