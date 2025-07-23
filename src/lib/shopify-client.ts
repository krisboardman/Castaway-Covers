// Dynamic Shopify client that only loads on client-side
let ShopifyBuySDK: any = null;

export async function getShopifyClient() {
  if (typeof window === 'undefined') {
    console.log('getShopifyClient: Running on server, returning null');
    return null;
  }

  try {
    if (!ShopifyBuySDK) {
      console.log('Loading Shopify SDK...');
      ShopifyBuySDK = await import('@shopify/buy-button-js');
    }

    const client = ShopifyBuySDK.default.buildClient({
      domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
      storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    });

    console.log('Shopify client initialized successfully');
    return client;
  } catch (error) {
    console.error('Error initializing Shopify client:', error);
    return null;
  }
}

// Cache for product queries to avoid repeated API calls
const productCache = new Map();

// Add a cache clear function for debugging
export function clearProductCache() {
  productCache.clear();
  console.log('Product cache cleared');
}

export async function findVariantBySKU(sku: string) {
  const client = await getShopifyClient();
  if (!client) return null;

  try {
    // Check cache first - but add a timestamp to prevent stale data
    const cacheKey = `variant-${sku}`;
    const cached = productCache.get(cacheKey);
    if (cached && cached.timestamp && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minute cache
      console.log(`Found cached variant for SKU: ${sku}`);
      return cached.data;
    }

    console.log(`Searching for variant with SKU: ${sku}`);
    
    // Fetch all products (you might want to filter by collection if you have many products)
    const products = await client.product.fetchAll(250); // Fetch up to 250 products
    console.log(`Fetched ${products.length} products from Shopify`);
    
    // Log all available SKUs for debugging
    const allSKUs: string[] = [];
    
    // Search through all products and their variants
    for (const product of products) {
      for (const variant of product.variants) {
        allSKUs.push(variant.sku);
        
        if (variant.sku === sku) {
          console.log(`Found variant for SKU ${sku}:`, variant.id);
          console.log(`Product: ${product.title}, Variant: ${variant.title}`);
          
          // Extract numeric ID from the base64 encoded variant ID
          // Shopify returns IDs like "gid://shopify/ProductVariant/1234567890"
          const variantIdString = variant.id.toString();
          const numericId = variantIdString.split('/').pop() || variantIdString;
          
          console.log('Full variant ID:', variant.id);
          console.log('Extracted numeric ID:', numericId);
          
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
    
    // If not found, log available SKUs for debugging
    console.warn(`No variant found for SKU: ${sku}`);
    console.log('Looking for product type:', sku.split('-')[0]);
    console.log('All available SKUs:', allSKUs);
    console.log('Filtered SKUs containing product type:', allSKUs.filter(s => s && s.toLowerCase().includes(sku.split('-')[0].toLowerCase())));
    return null;
  } catch (error) {
    console.error('Error finding variant by SKU:', error);
    return null;
  }
}