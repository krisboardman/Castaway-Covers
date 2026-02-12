import { generateMetadata as generateMeta } from "@/lib/metadata";

export const metadata = generateMeta('measurement');

export default function MeasurementServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
