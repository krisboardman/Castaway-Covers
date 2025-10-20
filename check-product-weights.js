// Script to check product weights in Shopify
// Run with: node check-product-weights.js

const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    envVars[key] = value;
  }
});

const SHOPIFY_DOMAIN = envVars.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const ADMIN_TOKEN = envVars.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_DOMAIN || !ADMIN_TOKEN) {
  console.error('Missing Shopify credentials in .env.local');
  console.error('Need: NEXT_PUBLIC_SHOPIFY_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN');
  process.exit(1);
}

async function checkWeights() {
  const query = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  sku
                  weight
                  weightUnit
                  requiresShipping
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return;
    }

    console.log('\n=== PRODUCT WEIGHTS REPORT ===\n');

    let totalProducts = 0;
    let productsWithWeight = 0;
    let productsWithoutWeight = 0;

    data.data.products.edges.forEach(({ node: product }) => {
      totalProducts++;

      console.log(`\n📦 ${product.title}`);
      console.log('─'.repeat(60));

      let hasWeight = false;

      product.variants.edges.forEach(({ node: variant }) => {
        const weight = variant.weight || 0;
        const weightDisplay = weight > 0 ? `${weight} ${variant.weightUnit}` : '❌ NO WEIGHT SET';
        const shipping = variant.requiresShipping ? '✅' : '❌';

        console.log(`  • ${variant.sku || 'No SKU'}`);
        console.log(`    Weight: ${weightDisplay}`);
        console.log(`    Requires Shipping: ${shipping}`);

        if (weight > 0) hasWeight = true;
      });

      if (hasWeight) {
        productsWithWeight++;
      } else {
        productsWithoutWeight++;
        console.log('  ⚠️  WARNING: No variants have weight set!');
      }
    });

    console.log('\n=== SUMMARY ===');
    console.log(`Total Products: ${totalProducts}`);
    console.log(`✅ Products with weights: ${productsWithWeight}`);
    console.log(`❌ Products without weights: ${productsWithoutWeight}`);

    if (productsWithoutWeight > 0) {
      console.log('\n⚠️  Products without weights will use default Shopify shipping rates.');
      console.log('   Set weights in Shopify Admin → Products → [Product] → Variants');
    }

    console.log('\n=== SHIPPING RECOMMENDATIONS ===');
    console.log('Typical cover weights by yards:');
    console.log('  • 2 yards: ~2-3 lbs');
    console.log('  • 4 yards: ~4-6 lbs');
    console.log('  • 6 yards: ~6-9 lbs');
    console.log('  • 8 yards: ~8-12 lbs');
    console.log('\n32oz marine vinyl ≈ 2 lbs per yard');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkWeights();
