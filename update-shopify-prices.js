#!/usr/bin/env node

/**
 * Bulk update Shopify variant prices from $50/yard to $45/yard
 * Usage: node update-shopify-prices.js
 */

require('dotenv').config({ path: '.env.local' });
const { createAdminApiClient } = require('@shopify/admin-api-client');

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_DOMAIN || !ADMIN_ACCESS_TOKEN) {
  console.error('❌ Missing Shopify credentials');
  console.error('Please set SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local');
  process.exit(1);
}

const client = createAdminApiClient({
  storeDomain: SHOPIFY_DOMAIN,
  apiVersion: '2024-01',
  accessToken: ADMIN_ACCESS_TOKEN,
});

// Fetch all products and their variants
async function getAllProducts() {
  const query = `
    query {
      products(first: 250) {
        edges {
          node {
            id
            title
            variants(first: 250) {
              edges {
                node {
                  id
                  title
                  price
                  sku
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await client.request(query);
    return response.data.products.edges;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Update a variant's price
async function updateVariantPrice(variantId, newPrice) {
  const mutation = `
    mutation productVariantUpdate($input: ProductVariantInput!) {
      productVariantUpdate(input: $input) {
        productVariant {
          id
          price
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      id: variantId,
      price: newPrice.toString()
    }
  };

  try {
    const response = await client.request(mutation, { variables });

    // Check if response has the expected structure
    if (!response || !response.data || !response.data.productVariantUpdate) {
      console.error('Unexpected response structure:', JSON.stringify(response, null, 2));
      return false;
    }

    if (response.data.productVariantUpdate.userErrors && response.data.productVariantUpdate.userErrors.length > 0) {
      console.error('Errors:', response.data.productVariantUpdate.userErrors);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error updating variant:', error.message || error);
    return false;
  }
}

// Main function
async function main() {
  console.log('🔍 Fetching all products and variants from Shopify...\n');

  const products = await getAllProducts();

  let variantsToUpdate = [];
  let totalVariants = 0;

  // Find all variants that need price updates
  products.forEach(({ node: product }) => {
    product.variants.edges.forEach(({ node: variant }) => {
      totalVariants++;
      const currentPrice = parseFloat(variant.price);

      // Check if this is a yard-based variant (price is multiple of 50)
      if (currentPrice % 50 === 0 && currentPrice > 0) {
        const yards = currentPrice / 50;
        const newPrice = yards * 45;

        variantsToUpdate.push({
          id: variant.id,
          title: variant.title,
          productTitle: product.title,
          sku: variant.sku,
          currentPrice: currentPrice,
          newPrice: newPrice,
          yards: yards
        });
      }
    });
  });

  console.log(`📊 Found ${totalVariants} total variants`);
  console.log(`💰 Found ${variantsToUpdate.length} variants to update (yard-based pricing)\n`);

  if (variantsToUpdate.length === 0) {
    console.log('✅ No variants need updating. All done!');
    return;
  }

  // Show what will be updated
  console.log('Preview of changes:');
  console.log('─'.repeat(80));
  variantsToUpdate.slice(0, 10).forEach(v => {
    console.log(`${v.productTitle} - ${v.title}`);
    console.log(`  $${v.currentPrice} → $${v.newPrice} (${v.yards} yards)`);
  });
  if (variantsToUpdate.length > 10) {
    console.log(`... and ${variantsToUpdate.length - 10} more variants`);
  }
  console.log('─'.repeat(80));
  console.log();

  // Ask for confirmation
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('⚠️  Proceed with updating all prices? (yes/no): ', async (answer) => {
    readline.close();

    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Update cancelled');
      return;
    }

    console.log('\n🚀 Starting bulk price update...\n');

    let updated = 0;
    let failed = 0;

    for (const variant of variantsToUpdate) {
      process.stdout.write(`Updating ${variant.productTitle} - ${variant.title}... `);

      const success = await updateVariantPrice(variant.id, variant.newPrice);

      if (success) {
        console.log('✅');
        updated++;
      } else {
        console.log('❌');
        failed++;
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    console.log('\n' + '═'.repeat(80));
    console.log(`✅ Updated: ${updated} variants`);
    if (failed > 0) {
      console.log(`❌ Failed: ${failed} variants`);
    }
    console.log('═'.repeat(80));
    console.log('\n🎉 Bulk price update complete!');
  });
}

main().catch(console.error);
