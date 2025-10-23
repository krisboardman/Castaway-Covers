export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Castaway Covers",
    "url": "https://castawaycovers.com",
    "logo": "https://castawaycovers.com/images/logos/castaway-logo.png",
    "description": "Premium custom-fit outdoor furniture covers designed for effortless protection",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Rumson",
      "addressRegion": "NJ",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@castawaycovers.com",
      "contactType": "customer service"
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
          "text": "Yes, all our covers are 100% waterproof. They feature sealed seams and a water-resistant coating that prevents water penetration while allowing air circulation through the wavy edge design."
        }
      },
      {
        "@type": "Question",
        "name": "What does the warranty cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All Castaway Covers come with a 2-year limited warranty covering defects in materials and workmanship including fabric defects, stitching and seam failures, snap/handle/magnet malfunctions, and waterproofing failure under normal conditions."
        }
      }
    ]
  };
}