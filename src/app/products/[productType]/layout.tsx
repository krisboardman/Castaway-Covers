import type { Metadata } from 'next';

// Product types that should not be indexed by search engines.
// /products/table-sets is a valid route but we're not actively selling
// table sets right now; this keeps Google from wasting crawl budget
// and from surfacing a thin product page. When we relaunch table sets,
// remove 'table-sets' from this set and add the URL back to sitemap.xml.
const NOINDEX_PRODUCT_TYPES = new Set(['table-sets']);

export async function generateMetadata(
  { params }: { params: Promise<{ productType: string }> | { productType: string } }
): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  if (NOINDEX_PRODUCT_TYPES.has(resolved.productType)) {
    return {
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    };
  }
  return {};
}

export default function ProductTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
