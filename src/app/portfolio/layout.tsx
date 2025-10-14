import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KBOps.dev - Freelance Web Development",
  description: "Professional freelance web development services by Kristen Boardman. Specializing in Next.js, React, TypeScript, and e-commerce solutions.",
  keywords: "web development, freelance, Next.js, React, TypeScript, e-commerce, Shopify, Vercel",
  authors: [{ name: "Kristen Boardman" }],
  openGraph: {
    title: "KBOps.dev - Freelance Web Development",
    description: "Professional freelance web development services. Building beautiful, performant web experiences.",
    type: "website",
    url: "https://kbops.dev",
    siteName: "KBOps.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "KBOps.dev - Freelance Web Development",
    description: "Professional freelance web development services. Building beautiful, performant web experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}