// Dynamic Shopify client that only loads on client-side
let ShopifyBuySDK: any = null;

export async function getShopifyClient() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    if (!ShopifyBuySDK) {
      ShopifyBuySDK = await import('@shopify/buy-button-js');
    }

    const client = ShopifyBuySDK.default.buildClient({
      domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
      storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    });

    return client;
  } catch (error) {
    return null;
  }
}

interface VariantInfo {
  variantId: string;
  price: string;
  title: string;
  productTitle: string;
}

interface CachedVariantEntry {
  data: VariantInfo;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minute cache

// Cache for product queries to avoid repeated API calls
const productCache = new Map<string, CachedVariantEntry>();
let catalogFetchedAt: number | null = null;
let inFlightCatalogFetch: Promise<Map<string, VariantInfo>> | null = null;
let cacheEpoch = 0;

// Add a cache clear function for debugging
export function clearProductCache() {
  productCache.clear();
  catalogFetchedAt = null;
  inFlightCatalogFetch = null;
  cacheEpoch += 1;
}

async function fetchAndIndexCatalog(client: any): Promise<Map<string, VariantInfo>> {
  if (inFlightCatalogFetch) {
    return inFlightCatalogFetch;
  }

  const epoch = cacheEpoch;
  const fetchPromise = (async () => {
    const products = await client.product.fetchAll(250); // Fetch up to 250 products
    const indexed = new Map<string, VariantInfo>();

    for (const product of products ?? []) {
      for (const variant of product.variants ?? []) {
        if (!variant?.sku) continue;

        // Extract numeric ID from the base64 encoded variant ID
        // Shopify returns IDs like "gid://shopify/ProductVariant/1234567890"
        const variantIdString = variant.id.toString();
        const numericId = variantIdString.split('/').pop() || variantIdString;

        indexed.set(`variant-${variant.sku}`, {
          variantId: numericId,
          price: variant.price.amount,
          title: variant.title,
          productTitle: product.title,
        });
      }
    }

    if (epoch === cacheEpoch) {
      const now = Date.now();
      productCache.clear();
      for (const [key, data] of indexed) {
        productCache.set(key, { data, timestamp: now });
      }
      catalogFetchedAt = now;
    }

    return indexed;
  })().finally(() => {
    if (epoch === cacheEpoch) {
      inFlightCatalogFetch = null;
    }
  });

  inFlightCatalogFetch = fetchPromise;
  return fetchPromise;
}

export async function findVariantBySKU(sku: string) {
  const client = await getShopifyClient();
  if (!client) return null;

  try {
    // Check cache first - with TTL to prevent stale data
    const now = Date.now();
    const cacheKey = `variant-${sku}`;
    const cached = productCache.get(cacheKey);
    if (cached && cached.timestamp && now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    // If the full catalog was fetched within TTL, a missing SKU is a known miss
    if (catalogFetchedAt !== null && now - catalogFetchedAt < CACHE_TTL_MS) {
      return null;
    }

    const indexed = await fetchAndIndexCatalog(client);
    return indexed.get(cacheKey) ?? null;
  } catch (error) {
    return null;
  }
}