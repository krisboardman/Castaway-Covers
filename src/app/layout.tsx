import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComingSoonRedirect from "@/components/ComingSoonRedirect";
import { CartProvider } from "@/providers/cart-provider";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-poppins'
});

const playfair = Playfair_Display({
  weight: ['400', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: "Castaway Covers - Premium Patio Furniture Protection",
  description: "Custom-fit covers for your outdoor furniture with marine-grade materials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <ComingSoonRedirect />
        <CartProvider>
          <Header />
          <main className="bg-gradient-to-b from-white via-[#FAF5ED] to-[#F5E6D3]/40">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
