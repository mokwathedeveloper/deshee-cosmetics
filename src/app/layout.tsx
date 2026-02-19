
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MorganShop — Premium Cosmetics & Skincare",
    template: "%s | MorganShop",
  },
  description:
    "Discover premium cosmetics and skincare products curated for your unique beauty routine. Free shipping on orders over $50.",
  openGraph: {
    title: "MorganShop — Premium Cosmetics & Skincare",
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
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
