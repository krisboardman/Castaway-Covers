import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon - Castaway Covers",
  description: "Premium patio furniture covers - launching soon!",
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple layout without header/footer for coming soon page
  return <>{children}</>;
}