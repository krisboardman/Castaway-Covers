# Calculator Auto-Population Guide

## Overview
Your HTML calculators can now automatically populate with order data from Shopify! This eliminates the need to manually re-enter measurements for production.

## What Was Updated

All calculator HTML files now accept URL parameters:

- ✅ `chair_chaise_cover_calculator.html` (chairs, recliners & chaise lounges)
- ✅ `couch_cover_calculator.html` (sofas & loveseats)
- ✅ `ottoman_table_cover_calculator.html` (ottomans & tables)
- ✅ `table_set_cover_calculator.html` (table sets)

## How to Use

### Method 1: Using the Helper Tool (Easiest)

1. **Open the helper file**:
   - Open `order-to-calculator.html` in your browser
   - This file is located in your project folder

2. **Copy order data from Shopify**:
   - Go to your Shopify Admin → Orders
   - Open an order
   - Find the custom attributes section (measurements data)
   - Copy the data in this format:
     ```
     productType: chairs-recliners
     width: 28
     length: 27
     height: 26
     backrestDepth: 4
     armrestHeight: 24
     ```

3. **Paste and generate**:
   - Paste the order data into the helper tool
   - Click "Generate Calculator Links"
   - Click the generated link to open the calculator with all values filled!

### Method 2: Manual URL Building

You can also manually create URLs by adding parameters:

**Chair/Chaise Example:**
```
file:///path/to/chair_chaise_cover_calculator.html?W=28&D=27&H=26&BR=4&F2A=24&WB=25
```

**Sofa Example:**
```
file:///path/to/couch_cover_calculator.html?W=84&D=36&H=34&BR=4&F2A=24
```

**Ottoman/Table Example:**
```
file:///path/to/ottoman_table_cover_calculator.html?W=28&L=40&H=18
```

## Parameter Mappings

### Chairs/Recliners/Chaise Lounges
| Order Field | Calculator Param | Description |
|------------|------------------|-------------|
| width | W | Width |
| length | D | Depth (length) |
| height | H | Height |
| backrestDepth | BR | Backrest thickness |
| armrestHeight | F2A | Floor to Armrest |
| backWidth | WB | Back width |

### Sofas/Loveseats
| Order Field | Calculator Param | Description |
|------------|------------------|-------------|
| width | W | Width arm-to-arm |
| length | D | Depth/arm length |
| height | H | Height |
| backrestDepth | BR | Backrest thickness |
| armrestHeight | F2A | Floor to Armrest |

### Ottomans/Tables/Table Sets
| Order Field | Calculator Param | Description |
|------------|------------------|-------------|
| width | W | Width |
| length | L | Length |
| height | H | Height |

## Advanced: Bookmarklet (Optional)

For even faster workflow, you can create a browser bookmarklet:

1. Create a new bookmark in your browser
2. Name it "Open Calculator"
3. Set the URL to this JavaScript code (all on one line):

```javascript
javascript:(function(){const data=prompt('Paste order data:');if(!data)return;const p={};data.split('\n').forEach(l=>{const m=l.match(/^\s*([^:]+):\s*(.+)\s*$/);if(m)p[m[1].trim()]=m[2].trim()});const t=p.productType||'';let f='',u=new URLSearchParams();if(t.includes('chair')){f='chair_cover_calculator_unified_v2.html';if(p.width)u.append('W',p.width);if(p.length)u.append('D',p.length);if(p.height)u.append('H',p.height);if(p.backrestDepth)u.append('BR',p.backrestDepth);if(p.armrestHeight)u.append('F2A',p.armrestHeight);}else if(t.includes('sofa')){f='couch_cover_calculator.html';if(p.width)u.append('W',p.width);if(p.length)u.append('D',p.length);if(p.height)u.append('H',p.height);if(p.backrestDepth)u.append('BR',p.backrestDepth);if(p.armrestHeight)u.append('F2A',p.armrestHeight);}else if(t.includes('ottoman')||t.includes('table')){f='table_ottoman_cover_calculator.html';if(p.width)u.append('W',p.width);if(p.length)u.append('L',p.length);if(p.height)u.append('H',p.height);}if(f)window.open('./'+f+'?'+u.toString(),'_blank');else alert('Could not determine product type');})();
```

Then:
1. Go to any Shopify order page
2. Click the bookmarklet
3. Paste the order data
4. Calculator opens with values filled!

## Tips

- 💡 Keep all calculator HTML files in the same folder
- 💡 The helper tool (`order-to-calculator.html`) should be in the same folder
- 💡 You can bookmark commonly used calculator URLs with specific values
- 💡 Values are automatically calculated when the page loads
- 💡 You can still manually adjust any values after they load

## Troubleshooting

**Calculator doesn't populate:**
- Make sure you're using the correct parameter names (see tables above)
- Check that the URL has `?` before parameters and `&` between them
- Verify the calculator HTML file has been updated with the new code

**Wrong calculator opens:**
- Check the `productType` value in your order data
- Use the helper tool to ensure correct mapping

**Values don't match:**
- Website uses: width, length, height
- Chairs calculator uses: W, D (depth), H
- Ottoman calculator uses: W, L (length), H
- The helper tool handles this mapping automatically

## Questions?

If you need help or want to customize the auto-population behavior, the code is in each calculator HTML file in the `loadFromURL()` function.
