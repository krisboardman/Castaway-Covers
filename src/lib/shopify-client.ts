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

// Cache for product queries to avoid repeated API calls
const productCache = new Map();

// Add a cache clear function for debugging
export function clearProductCache() {
  productCache.clear();
}

export async function findVariantBySKU(sku: string) {
  const client = await getShopifyClient();
  if (!client) return null;

  try {
    // Check cache first - but add a timestamp to prevent stale data
    const cacheKey = `variant-${sku}`;
    const cached = productCache.get(cacheKey);
    if (cached && cached.timestamp && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minute cache
      return cached.data;
    }

    // Fetch all products (you might want to filter by collection if you have many products)
    const products = await client.product.fetchAll(250); // Fetch up to 250 products
    
    // Log all available SKUs for debugging
    const allSKUs: string[] = [];
    
    // Search through all products and their variants
    for (const product of products) {
      for (const variant of product.variants) {
        allSKUs.push(variant.sku);

        if (variant.sku === sku) {
          // Extract numeric ID from the base64 encoded variant ID
          // Shopify returns IDs like "gid://shopify/ProductVariant/1234567890"
          const variantIdString = variant.id.toString();
          const numericId = variantIdString.split('/').pop() || variantIdString;
          
          // Cache the result with timestamp
          const result = {
            variantId: numericId,
            price: variant.price.amount,
            title: variant.title,
            productTitle: product.title
          };
          productCache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          });
          
          return result;
        }
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}