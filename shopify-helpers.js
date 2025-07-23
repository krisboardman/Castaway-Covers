#!/usr/bin/env node

/**
 * Shopify Helper Scripts for Castaway Covers
 * 
 * These scripts help manage Shopify products, variants, and data
 */

const { GraphQLClient } = require('graphql-request');
const fs = require('fs');
const path = require('path');

// Configuration
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_DOMAIN) {
  console.error('❌ SHOPIFY_DOMAIN environment variable not set');
  console.log('Set it with: export SHOPIFY_DOMAIN=your-store.myshopify.com');
  process.exit(1);
}

// GraphQL Clients
const adminClient = ADMIN_ACCESS_TOKEN ? new GraphQLClient(
  `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/graphql.json`,
  {
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
    },
  }
) : null;

const storefrontClient = new GraphQLClient(
  `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`,
  {
    headers: {
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
  }
);

// Helper functions
const shopifyHelpers = {
  // List all products with variants
  async listProducts() {
    const query = `
      query {
        products(first: 100) {
          edges {
            node {
              id
              title
              handle
              variants(first: 20) {
                edges {
                  node {
                    id
                    title
                    sku
                    price
                    inventoryQuantity
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const data = await storefrontClient.request(query);
      const products = data.products.edges.map(edge => ({
        ...edge.node,
        variants: edge.node.variants.edges.map(v => v.node)
      }));

      console.log(`\n📦 Found ${products.length} products:\n`);
      
      products.forEach(product => {
        console.log(`\n${product.title} (${product.handle})`);
        console.log(`  Variants: ${product.variants.length}`);
        product.variants.forEach(variant => {
          console.log(`    - ${variant.title} | SKU: ${variant.sku} | Price: $${variant.price}`);
        });
      });

      return products;
    } catch (error) {
      console.error('❌ Error fetching products:', error.message);
      return [];
    }
  },

  // Check variant SKUs
  async checkVariantSKUs() {
    const products = await this.listProducts();
    const skuIssues = [];

    console.log('\n🔍 Checking SKU consistency...\n');

    products.forEach(product => {
      product.variants.forEach(variant => {
        // Check for expected SKU format
        const expectedPatterns = [
          /^Chaiselounges-\d+$/,
          /^sofas-loveseats-\d+$/,
          /^Ottomans-\d+$/,
          /^chairs\/recliners-\d+$/,
          /^tablesets-\d+$/,
          /^tables-\d+$/
        ];

        const matchesPattern = expectedPatterns.some(pattern => pattern.test(variant.sku));
        
        if (!matchesPattern && variant.sku) {
          skuIssues.push({
            product: product.title,
            variant: variant.title,
            sku: variant.sku,
            issue: 'Unexpected SKU format'
          });
        }

        if (!variant.sku) {
          skuIssues.push({
            product: product.title,
            variant: variant.title,
            sku: variant.sku,
            issue: 'Missing SKU'
          });
        }
      });
    });

    if (skuIssues.length > 0) {
      console.log('⚠️  SKU Issues Found:');
      skuIssues.forEach(issue => {
        console.log(`  ${issue.product} - ${issue.variant}: ${issue.issue} (${issue.sku || 'none'})`);
      });
    } else {
      console.log('✅ All SKUs follow expected patterns');
    }

    return skuIssues;
  },

  // Export products to CSV
  async exportToCSV(filename = 'shopify-export.csv') {
    const products = await this.listProducts();
    
    const headers = ['Product Title', 'Product Handle', 'Variant Title', 'SKU', 'Price', 'Inventory'];
    const rows = [headers];

    products.forEach(product => {
      product.variants.forEach(variant => {
        rows.push([
          product.title,
          product.handle,
          variant.title,
          variant.sku || '',
          variant.price,
          variant.inventoryQuantity || '0'
        ]);
      });
    });

    const csv = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    fs.writeFileSync(filename, csv);
    
    console.log(`\n✅ Exported ${rows.length - 1} variants to ${filename}`);
  },

  // Validate product data against expected structure
  async validateProducts() {
    const products = await this.listProducts();
    
    console.log('\n🔍 Validating product structure...\n');

    const expectedProducts = [
      'Chaise Lounge Covers',
      'Sofa/Loveseat Covers',
      'Ottoman Covers',
      'Chairs/Recliners Covers',
      'Table Covers',
      'Table Set Covers'
    ];

    const foundProducts = products.map(p => p.title);
    
    expectedProducts.forEach(expected => {
      const found = foundProducts.some(title => 
        title.toLowerCase().includes(expected.toLowerCase().replace(' covers', ''))
      );
      
      if (found) {
        console.log(`✅ ${expected} - Found`);
      } else {
        console.log(`❌ ${expected} - Missing`);
      }
    });

    // Check variant counts
    console.log('\n📊 Variant Counts:');
    products.forEach(product => {
      const yardsCount = product.variants.filter(v => 
        v.title && v.title.includes('yards')
      ).length;
      
      console.log(`  ${product.title}: ${yardsCount} yard variants (expected: 14)`);
      
      if (yardsCount !== 14) {
        console.log(`    ⚠️  Expected 14 variants (2-15 yards), found ${yardsCount}`);
      }
    });
  }
};

// CLI interface
const command = process.argv[2];

const printHelp = () => {
  console.log(`
Shopify Helper Commands for Castaway Covers

Usage: node shopify-helpers.js <command>

Commands:
  list         - List all products and variants
  check-skus   - Check for SKU format issues  
  export       - Export products to CSV
  validate     - Validate product structure

Environment Variables:
  SHOPIFY_DOMAIN                            - Your Shopify domain
  SHOPIFY_ADMIN_ACCESS_TOKEN               - Admin API token (optional)
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN - Storefront token

Example:
  export SHOPIFY_DOMAIN=your-store.myshopify.com
  export NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
  node shopify-helpers.js list
  `);
};

// Execute command
switch (command) {
  case 'list':
    shopifyHelpers.listProducts();
    break;
  case 'check-skus':
    shopifyHelpers.checkVariantSKUs();
    break;
  case 'export':
    shopifyHelpers.exportToCSV();
    break;
  case 'validate':
    shopifyHelpers.validateProducts();
    break;
  default:
    printHelp();
}