#!/usr/bin/env node

/**
 * Bulk update Shopify variant prices from $50/yard to $45/yard using REST API
 * Usage: node update-prices-rest.js
 */

require('dotenv').config({ path: '.env.local' });

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_DOMAIN || !ADMIN_ACCESS_TOKEN) {
  console.error('❌ Missing Shopify credentials');
  console.error('Please set SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local');
  process.exit(1);
}

const BASE_URL = `https://${SHOPIFY_DOMAIN}/admin/api/2025-01`;

// Fetch all products
async function getAllProducts() {
  const response = await fetch(`${BASE_URL}/products.json?limit=250`, {
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();
  return data.products;
}

// Update a variant's price
async function updateVariantPrice(variantId, newPrice) {
  const response = await fetch(`${BASE_URL}/variants/${variantId}.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variant: {
        id: variantId,
        price: newPrice.toString()
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed: ${error}`);
    return false;
  }

  return true;
}

// Main function
async function main() {
  console.log('🔍 Fetching all products and variants from Shopify...\n');

  const products = await getAllProducts();

  let variantsToUpdate = [];
  let totalVariants = 0;

  // Find all variants that need price updates
  products.forEach(product => {
    product.variants.forEach(variant => {
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
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '═'.repeat(80));
    console.log(`✅ Updated: ${updated} variants`);
    if (failed > 0) {
      console.log(`❌ Failed: ${failed} variants`);
    }
    console.log('═'.repeat(80));
    console.log('\n🎉 Bulk price update complete!');
    console.log('\n💡 Tip: You should also update the price in your calculator:');
    console.log('   File: src/components/MeasurementCalculator.tsx');
    console.log('   Line 264: const pricePerYard = 50; // Change to 45');
  });
}

main().catch(console.error);
