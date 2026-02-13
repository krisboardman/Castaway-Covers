#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createAdminApiClient } = require('@shopify/admin-api-client');

const client = createAdminApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
  apiVersion: '2025-01',
  accessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
});

async function testUpdate() {
  // Test with one variant first using productSet mutation
  const mutation = `
    mutation productSet($input: ProductSetInput!) {
      productSet(input: $input) {
        product {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Using a test variant - 2 yards table cover
  const variables = {
    input: {
      variants: [{
        id: "gid://shopify/ProductVariant/42328282087521",
        price: "90"
      }]
    }
  };

  try {
    console.log('Testing price update...');
    const response = await client.request(mutation, { variables });
    console.log('Full response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testUpdate();
