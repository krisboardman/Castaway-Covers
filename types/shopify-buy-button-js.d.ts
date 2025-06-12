declare module '@shopify/buy-button-js' {
  interface Config {
    domain: string;
    storefrontAccessToken: string;
  }

  interface Client {
    checkout: {
      create(): Promise<any>;
      addLineItems(checkoutId: string, lineItems: any[]): Promise<any>;
    };
    product: {
      fetch(id: string): Promise<any>;
      fetchAll(): Promise<any>;
    };
  }

  export function buildClient(config: Config): Client;
  
  const ShopifyBuy: {
    buildClient: typeof buildClient;
  };
  
  export default ShopifyBuy;
}