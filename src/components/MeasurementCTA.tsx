// Prominent call-to-action card for the in-home measurement service.
// Used on the homepage and product pages. Styling matches the existing
// teal gradient "Premium Features Banner" on product pages.
// Copy adapts automatically when MEASUREMENT_PROMO_ACTIVE is toggled off.
import Link from 'next/link';
import { MEASUREMENT_PROMO_ACTIVE } from '@/config/site';

export default function MeasurementCTA({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-r from-brand-teal to-teal-600 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {MEASUREMENT_PROMO_ACTIVE
                ? 'Free In-Home Measure & Quote'
                : 'In-Home Measure & Quote'}
            </h2>
            <p className="text-white/90 text-sm sm:text-base">
              Skip the tape measure — we come to you, measure your furniture, and
              quote your covers on the spot.
              {MEASUREMENT_PROMO_ACTIVE && (
                <>
                  {' '}
                  <span className="line-through text-white/60">$75</span>{' '}
                  <span className="font-semibold">Free during our current promotion.</span>
                </>
              )}{' '}
              Serving Monmouth County, NJ.
            </p>
          </div>
          <Link
            href="/measurement-service"
            className="flex-shrink-0 inline-flex items-center bg-white text-brand-teal px-6 py-3 rounded-lg font-semibold text-base hover:bg-gray-100 transition-all shadow-md hover:shadow-lg group"
          >
            Schedule Now
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
