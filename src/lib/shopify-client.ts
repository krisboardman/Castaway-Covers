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