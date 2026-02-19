import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Beauty Shop — Premium Cosmetics & Skincare",
    template: "%s | Beauty Shop",
  },
  description:
    "Discover premium cosmetics and skincare products curated for your unique beauty routine. Free shipping on orders over $50.",
  openGraph: {
    title: "Beauty Shop — Premium Cosmetics & Skincare",
    description:
      "Discover premium cosmetics and skincare products curated for your unique beauty routine.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
