import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://arabic-search-context-lab-prod.onrender.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Arabic Search Context Lab",
  description:
    "A small Next.js project comparing the same Arabic search across Baghdad, Riyadh, Cairo and Casablanca with SerpApi.",
  openGraph: {
    title: "Arabic Search Context Lab",
    description:
      "A small Next.js project comparing the same Arabic search across four cities with SerpApi.",
    url: SITE_URL,
    siteName: "Arabic Search Context Lab",
    type: "website",
    images: ["/walkthrough-poster.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arabic Search Context Lab",
    description:
      "A small Next.js project comparing the same Arabic search across four cities with SerpApi.",
    images: ["/walkthrough-poster.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
