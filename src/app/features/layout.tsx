import { generateMetadata as generateMeta } from "@/lib/metadata";

export const metadata = generateMeta('features');

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
