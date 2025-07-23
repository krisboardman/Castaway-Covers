import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/providers/cart-provider";

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
      <body className="antialiased">
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
