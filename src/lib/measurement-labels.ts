/**
 * Customer-facing measurement labels by product type.
 *
 * These must stay in sync with the labels in MeasurementCalculator.tsx.
 * Every place that displays measurement names to a customer — emails,
 * Shopify order attributes, cart notes — should use this map so the
 * labels match what the customer originally saw on the product page.
 */

type MeasurementField = 'width' | 'length' | 'height' | 'backrestDepth' | 'armrestHeight' | 'backWidth' | 'armLength';

const labelsByProduct: Record<string, Record<MeasurementField, string>> = {
  'chairs-recliners': {
    width: 'Width',
    length: 'Front-to-Back Depth',
    height: 'Height',
    backrestDepth: 'Backrest Thickness',
    armrestHeight: 'Ground to Top of Armrest',
    backWidth: 'Back Width',
    armLength: 'Arm Length',
  },
  'sofas-loveseats': {
    width: 'Length',
    length: 'Front-to-Back Depth',
    height: 'Height',
    backrestDepth: 'Backrest Thickness',
    armrestHeight: 'Ground to Top of Armrest',
    backWidth: 'Back Width',
    armLength: 'Arm Length',
  },
  'chaise-lounge': {
    width: 'Width',
    length: 'Length',
    height: 'Floor to Bottom of Seat',
    backrestDepth: 'Backrest Thickness',
    armrestHeight: 'Floor to Top of Armrest',
    backWidth: 'Back Width',
    armLength: 'Arm Length',
  },
  'ottomans': {
    width: 'Width',
    length: 'Length',
    height: 'Height',
    backrestDepth: 'Backrest Thickness',
    armrestHeight: 'Armrest Height',
    backWidth: 'Back Width',
    armLength: 'Arm Length',
  },
  'tables': {
    width: 'Width',
    length: 'Length',
    height: 'Height',
    backrestDepth: 'Backrest Thickness',
    armrestHeight: 'Armrest Height',
    backWidth: 'Back Width',
    armLength: 'Arm Length',
  },
  'table-sets': {
    width: 'Width',
    length: 'Length',
    height: 'Height',
    backrestDepth: 'Backrest Thickness',
    armrestHeight: 'Armrest Height',
    backWidth: 'Back Width',
    armLength: 'Arm Length',
  },
};

// Fallback labels when product type is unknown
const defaultLabels: Record<MeasurementField, string> = {
  width: 'Width',
  length: 'Length',
  height: 'Height',
  backrestDepth: 'Backrest Depth',
  armrestHeight: 'Armrest Height',
  backWidth: 'Back Width',
  armLength: 'Arm Length',
};

/** Get the customer-facing label for a measurement field. */
export function getMeasurementLabel(productType: string, field: string): string {
  const labels = labelsByProduct[productType] || defaultLabels;
  return labels[field as MeasurementField] || field;
}
