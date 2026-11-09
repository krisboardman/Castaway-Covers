import { Metadata } from 'next';
import { MEASUREMENT_PROMO_ACTIVE } from '@/config/site';

// SEO metadata for all pages
export const pageMetadata = {
  home: {
    path: '/',
    title: 'Castaway Covers - Premium Custom Patio Furniture Covers',
    description: 'Protect your outdoor furniture with custom-fit, marine-grade covers. Handcrafted in Rumson, NJ. Waterproof, UV-resistant, and built to last. Free measurement service available.',
    keywords: 'patio furniture covers, outdoor furniture covers, custom covers, waterproof covers, UV resistant, New Jersey, Rumson',
  },
  design: {
    path: '/design',
    title: 'Design Your Custom Cover | Castaway Covers',
    description: 'Choose from chairs, sofas, tables, chaise lounges, and more. Get perfectly fitted covers for your outdoor furniture. Easy online ordering with measurement guides.',
    keywords: 'custom furniture covers, design covers, patio chair covers, outdoor sofa covers, table covers',
  },
  products: {
    path: '/design',
    title: 'Shop Custom Covers | Castaway Covers',
    description: 'Browse our collection of premium outdoor furniture covers. Custom sizes, marine-grade materials, multiple colors available. Order your perfect fit today.',
    keywords: 'buy furniture covers, shop patio covers, outdoor furniture protection, custom size covers',
  },
  measurement: {
    path: '/measurement-service',
    title: 'Professional Measurement Service | Castaway Covers',
    description: MEASUREMENT_PROMO_ACTIVE
      ? 'Get perfectly fitted covers with our professional measurement service. In-home in Monmouth County, NJ, or virtual guided video call anywhere. FREE measurements & estimates during our current promotion.'
      : 'Get perfectly fitted covers with our professional measurement service. In-home in Monmouth County, NJ, or virtual guided video call anywhere. Only $75 for complete measurement.',
    keywords: 'furniture measurement service, virtual measurement, custom fitting, professional measurement, Rumson NJ',
  },
  contact: {
    path: '/contact',
    title: 'Contact Us | Castaway Covers',
    description: 'Get in touch with Castaway Covers for custom outdoor furniture covers. Email support@castawaycovers.com or use our contact form.',
    keywords: 'contact castaway covers, customer service, furniture cover help',
  },
  faqs: {
    path: '/faqs',
    title: 'Frequently Asked Questions | Castaway Covers',
    description: 'Find answers about our custom patio furniture covers, materials, sizing, shipping, and care instructions. Marine-grade vinyl with 2-year warranty.',
    keywords: 'furniture cover FAQs, cover care, warranty information, sizing guide',
  },
  instructions: {
    path: '/instructions',
    title: 'Care & Installation Instructions | Castaway Covers',
    description: 'Learn how to install, clean, and maintain your Castaway Covers. Proper care ensures maximum protection and longevity for your outdoor furniture covers.',
    keywords: 'cover installation, cleaning instructions, maintenance guide, care tips',
  },
  about: {
    path: '/about',
    title: 'About Us | Castaway Covers',
    description: 'Family-owned business in Rumson, NJ specializing in premium custom patio furniture covers. Quality craftsmanship and personalized service since day one.',
    keywords: 'about castaway covers, Rumson NJ business, family owned, custom covers',
  },
  shipping: {
    path: '/shipping',
    title: 'Shipping Information | Castaway Covers',
    description: 'Shipping details for custom patio furniture covers. Processing times, delivery options, and tracking information.',
    keywords: 'shipping info, delivery times, order tracking',
  },
  returns: {
    path: '/returns',
    title: 'Return Policy | Castaway Covers',
    description: 'Custom-made covers are non-returnable except for defects. Learn about our quality guarantee and warranty coverage.',
    keywords: 'return policy, warranty, quality guarantee',
  },
  warranty: {
    path: '/warranty',
    title: '2-Year Warranty | Castaway Covers',
    description: 'All Castaway Covers come with a 2-year limited warranty against defects in materials and workmanship. Premium protection for your investment.',
    keywords: '2 year warranty, cover warranty, quality guarantee',
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy Policy | Castaway Covers',
    description: 'How Castaway Covers protects your personal information. Our commitment to privacy and data security.',
    keywords: 'privacy policy, data protection, personal information',
  },
  terms: {
    path: '/terms',
    title: 'Terms of Service | Castaway Covers',
    description: 'Terms and conditions for purchasing custom patio furniture covers from Castaway Covers.',
    keywords: 'terms of service, purchase terms, conditions',
  },
  features: {
    path: '/features',
    title: 'Craftsmanship Details | Castaway Covers',
    description: 'Discover what makes Castaway Covers different: marine-grade snaps, weather-rated grommets, storm-secure bungee systems, waterproof UV-resistant vinyl, and custom-fit design.',
    keywords: 'furniture cover craftsmanship, marine grade vinyl, waterproof covers, UV resistant, bungee system, custom fit covers',
  },
};

// Helper function to generate metadata
export function generateMetadata(page: keyof typeof pageMetadata): Metadata {
  const meta = pageMetadata[page];
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    // Self-referencing canonical: each page points to itself, not the homepage.
    alternates: {
      canonical: meta.path,
    },
    openGraph: {
      url: meta.path,
      title: meta.title,
      description: meta.description,
      type: 'website',
      locale: 'en_US',
      siteName: 'Castaway Covers',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}