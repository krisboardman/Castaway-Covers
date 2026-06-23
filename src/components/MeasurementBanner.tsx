// Site-wide announcement banner for the in-home measurement service.
// Rendered above the Header in src/app/layout.tsx so it appears on every page.
// Copy automatically adapts when MEASUREMENT_PROMO_ACTIVE is toggled off in
// src/config/site.ts (drops the "Free" claim and the strikethrough price).
import Link from 'next/link';
import { MEASUREMENT_PROMO_ACTIVE } from '@/config/site';

export default function MeasurementBanner() {
  return (
    <Link
      href="/measurement-service"
      className="block bg-brand-teal hover:bg-brand-teal-dark transition-colors text-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 text-center">
        <p className="text-sm md:text-base">
          📍{' '}
          <span className="font-semibold">
            {MEASUREMENT_PROMO_ACTIVE ? 'Free Measure & Quote' : 'Measure & Quote'}
          </span>
          <span className="hidden md:inline text-white/90"> — we measure for you. In-home (Monmouth County) or virtual, anywhere.</span>
        </p>
        <span className="inline-flex items-center bg-white text-brand-teal text-sm font-semibold px-4 py-1 rounded-full shadow-sm whitespace-nowrap">
          Schedule Now
          <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
