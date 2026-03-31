export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Castaway Covers",
    "url": "https://castawaycovers.com",
    "logo": "https://castawaycovers.com/images/logos/castaway-logo.png",
    "image": "https://castawaycovers.com/images-optimized/og-image.jpg",
    "description": "Premium custom-fit outdoor furniture covers handcrafted in Rumson, NJ. Marine-grade vinyl, waterproof, UV-resistant covers for chairs, sofas, tables, and more.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Rumson",
      "addressRegion": "NJ",
      "postalCode": "07760",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.3726,
      "longitude": -73.9990
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 40.3726,
        "longitude": -73.9990
      },
      "geoRadius": "50000"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@castawaycovers.com",
      "contactType": "customer service"
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  };
}

export function getProductSchema(product: {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": "Castaway Covers"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Castaway Covers"
      }
    },
    "category": product.category,
    "material": "Marine-grade vinyl with polyester backing"
  };
}

// Pre-built product schemas for each product type
const productData: { [key: string]: { name: string; description: string; image: string; category: string; price: string } } = {
  'chairs-recliners': {
    name: 'Custom Chair & Recliner Covers',
    description: 'Premium custom-fit covers for outdoor chairs and recliners. Marine-grade vinyl, waterproof, UV-resistant with reinforced grommets and bungee cord system.',
    image: 'https://castawaycovers.com/images/Chairs-Recliners/chair4.jpg',
    category: 'Outdoor Furniture Covers',
    price: '90',
  },
  'sofas-loveseats': {
    name: 'Custom Sofa & Loveseat Covers',
    description: 'Premium custom-fit covers for outdoor sofas and loveseats. Marine-grade vinyl with optional magnetic closures for easy daily use. Waterproof and UV-resistant.',
    image: 'https://castawaycovers.com/images/Sofas-Loveseats/sofa1.jpg',
    category: 'Outdoor Furniture Covers',
    price: '135',
  },
  'chaise-lounges': {
    name: 'Custom Chaise Lounge Covers',
    description: 'Premium custom-fit covers for pool and patio chaise lounges. Marine-grade vinyl, waterproof, UV-resistant with snap closures for a tailored fit.',
    image: 'https://castawaycovers.com/images/ChaiseLounges/chaise1.jpg',
    category: 'Outdoor Furniture Covers',
    price: '90',
  },
  'chaise-lounge': {
    name: 'Custom Chaise Lounge Covers',
    description: 'Premium custom-fit covers for pool and patio chaise lounges. Marine-grade vinyl, waterproof, UV-resistant with snap closures for a tailored fit.',
    image: 'https://castawaycovers.com/images/ChaiseLounges/chaise1.jpg',
    category: 'Outdoor Furniture Covers',
    price: '90',
  },
  'tables': {
    name: 'Custom Table Covers',
    description: 'Premium custom-fit covers for outdoor dining and coffee tables. Marine-grade vinyl, waterproof, UV-resistant with reinforced grommets.',
    image: 'https://castawaycovers.com/images/Tables/table1.jpg',
    category: 'Outdoor Furniture Covers',
    price: '90',
  },
  'table-sets': {
    name: 'Custom Table Set Covers',
    description: 'Premium custom-fit covers for complete outdoor dining sets with chairs or benches. Marine-grade vinyl with optional split cover design for easy access.',
    image: 'https://castawaycovers.com/images/Tablesets/tableset6.jpg',
    category: 'Outdoor Furniture Covers',
    price: '135',
  },
  'ottomans': {
    name: 'Custom Ottoman Covers',
    description: 'Premium custom-fit covers for outdoor ottomans and footrests. Marine-grade vinyl, waterproof, UV-resistant with reinforced grommets.',
    image: 'https://castawaycovers.com/images/Ottomans/ottoman2.jpg',
    category: 'Outdoor Furniture Covers',
    price: '90',
  },
};

export function getProductSchemaForType(productType: string) {
  const product = productData[productType];
  if (!product) return null;
  return getProductSchema(product);
}

export function getFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I know what size cover to order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Measure at the widest points. Add 1 inch to each measurement for easier installation. Use our measurement calculator on each product page for specific guidance."
        }
      },
      {
        "@type": "Question",
        "name": "What material are the covers made from?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Main body: Marine-grade vinyl with polyester backing. This premium material is 100% waterproof, UV resistant (650 hours), mildew and fungal resistant, cold crack resistant to -25°F, fire retardant (self-extinguishing), and 32 oz weight for durability."
        }
      },
      {
        "@type": "Question",
        "name": "Are the covers waterproof?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our covers are made from 100% waterproof marine-grade vinyl with sealed seams, providing excellent protection from rain, snow, and UV exposure. Because the covers drape over your furniture rather than forming a sealed enclosure, some moisture from wind-driven rain or splashing may reach the furniture underneath. For best results, use the bungee system to secure the cover snugly."
        }
      },
      {
        "@type": "Question",
        "name": "What does the warranty cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All Castaway Covers come with a 2-year limited warranty covering defects in materials and workmanship including fabric defects, stitching and seam failures, and snap/handle/magnet malfunctions."
        }
      },
      {
        "@type": "Question",
        "name": "Do you make covers for curved-back furniture?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our covers work for both straight-backed and curved-back furniture. When measuring curved-back pieces, measure the depth from the center of the back (the furthest point) straight to the front, and measure the width side to side at the front of the chair. Contact us if you have a unique piece you'd like covered to discuss custom options."
        }
      }
    ]
  };
}
