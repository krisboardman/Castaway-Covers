// Dynamic Shopify client that only loads on client-side
let ShopifyBuySDK: any = null;

export async function getShopifyClient() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!ShopifyBuySDK) {
    ShopifyBuySDK = await import('@shopify/buy-button-js');
  }

  const client = ShopifyBuySDK.default.buildClient({
    domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
    storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  });

  return client;
}