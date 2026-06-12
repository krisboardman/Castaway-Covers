import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MeasurementBanner from "@/components/MeasurementBanner";
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
  title: "Castaway Covers - Premium Custom Patio Furniture Covers",
  description: "Custom-fit covers for your outdoor furniture with marine-grade materials",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://castawaycovers.com',
    siteName: 'Castaway Covers',
    title: 'Castaway Covers - Premium Custom Patio Furniture Covers',
    description: 'Custom-fit covers for your outdoor furniture with marine-grade materials',
    images: [
      {
        url: 'https://castawaycovers.com/images-optimized/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Castaway Covers - Premium Patio Furniture Protection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Castaway Covers - Premium Custom Patio Furniture Covers',
    description: 'Custom-fit covers for your outdoor furniture with marine-grade materials',
    images: ['https://castawaycovers.com/images-optimized/og-image.jpg'],
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
      <body className={`${poppins.className} antialiased`}>
        <CartProvider>
          <MeasurementBanner />
          <Header />
          <main className="bg-gradient-to-b from-white via-[#FAF5ED] to-[#F5E6D3]/40">
            {children}
          </main>
          <Footer />
        </CartProvider>
        {/* Google Analytics — deferred with next/script lazyOnload so it
            doesn't compete for main-thread time during LCP. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WYV0497EK9"
          strategy="lazyOnload"
        />
        <Script id="ga-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WYV0497EK9');
          `}
        </Script>
        {/* Meta Pixel — tracks site visitors for Meta ad audience building
            and conversion measurement. afterInteractive ensures PageView
            fires once the page is ready without blocking initial paint. */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '987864550328554');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=987864550328554&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
