const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      // Tables and Table Sets merged into a single "Tables / Sets" page.
      {
        source: '/products/table-sets',
        destination: '/products/tables',
        permanent: true,
      },
      // Legacy WordPress / old-site URLs flagged by Google Search Console.
      // All 301 so link equity is preserved and Google drops the 404s from its index.
      {
        source: '/design-my-cover',
        destination: '/design',
        permanent: true,
      },
      {
        source: '/design-my-cover/:path*',
        destination: '/design',
        permanent: true,
      },
      {
        source: '/table-chooser2',
        destination: '/',
        permanent: true,
      },
      {
        source: '/table-chooser2/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/category/uncategorized',
        destination: '/',
        permanent: true,
      },
      {
        source: '/category/uncategorized/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/reviews',
        destination: '/',
        permanent: true,
      },
      {
        source: '/reviews/:path*',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Cache images for 1 year
        source: '/images/:all*(svg|jpg|jpeg|png|gif|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts for 1 year
        source: '/fonts/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache CSS and JS for 1 year (Next.js adds hashes to filenames)
        source: '/_next/static/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Security headers
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
