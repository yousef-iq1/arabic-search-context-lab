import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arabic Search Context Lab",
  description: "Compare how the same Arabic search intent changes across local contexts using SerpApi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
