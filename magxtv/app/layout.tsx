import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://magxtv.click"),
  title: {
    default: "MAGXTV.CLICK — Live Scores, Fixtures & Predictions",
    template: "%s | MAGXTV.CLICK"
  },
  description:
    "Live scores, match insights, fixtures and sports predictions across football, cricket, basketball, tennis and more — all in one place.",
  openGraph: {
    title: "MAGXTV.CLICK — Every Match. Every Moment.",
    description:
      "Live scores, match insights, fixtures and sports predictions in one place.",
    url: "https://magxtv.click",
    siteName: "MAGXTV.CLICK",
    type: "website"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${rajdhani.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Script src="https://capitalhospitals.org/1/065a4aeb141732d2377d870b801e6716" strategy="afterInteractive" data-cfasync="false" />
        <Script src="https://czernik.org/14/a9f1126ba784784a6dd6a6f3e68dd0e9" strategy="afterInteractive" data-cfasync="false" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
