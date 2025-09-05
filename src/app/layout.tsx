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
  metadataBase: new URL('https://castawaycovers.com'),
  title: "Castaway Covers - Premium Patio Furniture Protection",
  description: "Custom-fit covers for your outdoor furniture with marine-grade materials",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://castawaycovers.com',
    siteName: 'Castaway Covers',
    title: 'Castaway Covers - Premium Patio Furniture Protection',
    description: 'Custom-fit covers for your outdoor furniture with marine-grade materials',
  },
  alternates: {
    canonical: 'https://castawaycovers.com'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WYV0497EK9"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WYV0497EK9');
            `,
          }}
        />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <CartProvider>
          <ComingSoonRedirect />
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
