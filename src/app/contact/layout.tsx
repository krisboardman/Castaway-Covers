import { generateMetadata as generateMeta } from "@/lib/metadata";

export const metadata = generateMeta('contact');

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
