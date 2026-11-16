// Local service area for Castaway Covers.
// One source of truth for the homepage section, the /service-area page, the FAQ
// page and the LocalBusiness schema, so the town list never drifts between them.

export const SERVICE_COUNTY = 'Monmouth County, NJ';
export const BASE_TOWN = 'Rumson';

// All 53 municipalities in Monmouth County, NJ (alphabetical).
export const SERVICE_AREA_TOWNS: string[] = [
  'Aberdeen', 'Allenhurst', 'Allentown', 'Asbury Park', 'Atlantic Highlands',
  'Avon-by-the-Sea', 'Belmar', 'Bradley Beach', 'Brielle', 'Colts Neck',
  'Deal', 'Eatontown', 'Englishtown', 'Fair Haven', 'Farmingdale',
  'Freehold Borough', 'Freehold Township', 'Hazlet', 'Highlands', 'Holmdel',
  'Howell', 'Interlaken', 'Keansburg', 'Keyport', 'Lake Como',
  'Little Silver', 'Loch Arbour', 'Long Branch', 'Manalapan', 'Manasquan',
  'Marlboro', 'Matawan', 'Middletown', 'Millstone', 'Monmouth Beach',
  'Neptune City', 'Neptune Township', 'Ocean Township', 'Oceanport', 'Red Bank',
  'Roosevelt', 'Rumson', 'Sea Bright', 'Sea Girt', 'Shrewsbury Borough',
  'Shrewsbury Township', 'Spring Lake', 'Spring Lake Heights', 'Tinton Falls',
  'Union Beach', 'Upper Freehold', 'Wall', 'West Long Branch',
];

// Shore and river towns closest to Rumson, used for the short list on the homepage.
export const FEATURED_TOWNS: string[] = [
  'Rumson', 'Fair Haven', 'Red Bank', 'Little Silver', 'Sea Bright',
  'Monmouth Beach', 'Long Branch', 'Deal', 'Middletown', 'Holmdel',
  'Colts Neck', 'Spring Lake',
];

// Local-style questions. Rendered on /faqs and included in that page's FAQPage schema.
// Answers are plain strings so they can be reused verbatim in the JSON-LD.
export const LOCAL_FAQS: { question: string; answer: string }[] = [
  {
    question: 'Who makes custom outdoor furniture covers near me in Monmouth County, NJ?',
    answer:
      'Castaway Covers is a local business based in Rumson, NJ. We design and make custom marine-grade vinyl covers for patio chairs, sofas, tables, chaise lounges, ottomans and more, and we serve homeowners throughout Monmouth County.',
  },
  {
    question: 'Do you come to my home to measure for covers?',
    answer:
      'Yes. We come to your home anywhere in Monmouth County, measure every piece, and design the covers around your furniture so you never have to guess at sizing.',
  },
  {
    question: 'Do you install the covers, or do I have to put them on myself?',
    answer:
      'We install every cover for local customers and make any adjustments needed until it fits just right.',
  },
  {
    question: 'Which towns do you serve?',
    answer:
      'We serve all of Monmouth County, NJ, including Rumson, Fair Haven, Red Bank, Little Silver, Sea Bright, Monmouth Beach, Long Branch, Middletown, Holmdel, Colts Neck, Spring Lake, Freehold and every town in between. See our full service area page for the complete list.',
  },
  {
    question: 'Are your covers good for shore weather, salt air and storms?',
    answer:
      'Our covers are made from marine-grade vinyl, the same kind of material used on boats, so they resist sun, rain and mildew. Built-in bungees tuck away when not needed and can be used in high winds to keep the cover in place.',
  },
  {
    question: 'I live just outside Monmouth County. Can you still help?',
    answer:
      'Our in-person measuring and installation is for Monmouth County. If you are just outside the county, contact us and we will let you know whether we can make it work.',
  },
];
