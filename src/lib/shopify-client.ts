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

export async function findVariantBySKU(sku: string) {
  const client = await getShopifyClient();
  if (!client) return null;

  try {
    // Check cache first
    const cacheKey = `variant-${sku}`;
    if (productCache.has(cacheKey)) {
      return productCache.get(cacheKey);
    }

    console.log(`Searching for variant with SKU: ${sku}`);
    
    // Fetch all products (you might want to filter by collection if you have many products)
    const products = await client.product.fetchAll(250); // Fetch up to 250 products
    
    // Search through all products and their variants
    for (const product of products) {
      for (const variant of product.variants) {
        if (variant.sku === sku) {
          console.log(`Found variant for SKU ${sku}:`, variant.id);
          
          // Extract numeric ID from the base64 encoded variant ID
          // Shopify returns IDs like "gid://shopify/ProductVariant/1234567890"
          const variantIdString = variant.id.toString();
          const numericId = variantIdString.split('/').pop() || variantIdString;
          
          console.log('Full variant ID:', variant.id);
          console.log('Extracted numeric ID:', numericId);
          
          // Cache the result
          const result = {
            variantId: numericId,
            price: variant.price.amount,
            title: variant.title,
            productTitle: product.title
          };
          productCache.set(cacheKey, result);
          
          return result;
        }
      }
    }
    
    console.warn(`No variant found for SKU: ${sku}`);
    return null;
  } catch (error) {
    console.error('Error finding variant by SKU:', error);
    return null;
  }
}