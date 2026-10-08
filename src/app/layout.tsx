import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.title} | Knowledge Inventory`,
    template: `%s | ${BRAND.title}`,
  },
  description: BRAND.subtitle,
  icons: {
    icon: [{ url: "/logo-kilap-kepri.png", type: "image/png" }],
    apple: "/logo-kilap-kepri.png",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
