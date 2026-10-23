// Per-yard cover pricing by furniture type. This is the price the website
// shows and puts in the cart; Shopify variant prices are NOT used for covers.
// Rates target a ~40-50% margin (see calculators/profit_calculator.html).
export const PRICE_PER_YARD = {
  table: 65,
  ottoman: 65,
  chair: 70,
  chaise: 70,
  sofa: 70,
  tableSet: 70,
} as const;

// Orders below this are billed at the minimum.
export const ORDER_MINIMUM = 350;

export function pricePerYard(productType: string, coverType?: 'table' | 'set' | 'grill'): number {
  switch (productType) {
    case 'chairs-recliners': return PRICE_PER_YARD.chair;
    case 'sofas-loveseats': return PRICE_PER_YARD.sofa;
    case 'chaise-lounge':
    case 'chaise-lounges': return PRICE_PER_YARD.chaise;
    case 'ottomans': return PRICE_PER_YARD.ottoman;
    case 'table-sets': return PRICE_PER_YARD.tableSet;
    case 'tables':
      if (coverType === 'set') return PRICE_PER_YARD.tableSet;
      return PRICE_PER_YARD.table;
    default: return PRICE_PER_YARD.chair;
  }
}
