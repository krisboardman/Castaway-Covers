// Homepage "local business" section: says plainly where we work and what local
// customers get, in the words people use when they search or ask an AI assistant.
import Link from 'next/link';
import { FEATURED_TOWNS } from '@/config/service-area';

export default function ServiceAreaSection() {
  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Custom Outdoor Covers, Made in Rumson and Installed Across Monmouth County, NJ
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
          Castaway Covers is a local Monmouth County business. We come to your home to measure,
          make your marine-grade vinyl covers in Rumson, and install them ourselves, so your patio
          furniture is protected and the fit is right.
        </p>
        <p className="text-sm text-gray-600 max-w-3xl mx-auto mb-5">
          <span className="font-semibold text-gray-900">Proudly serving: </span>
          {FEATURED_TOWNS.join(', ')}, and every other town in Monmouth County.
        </p>
        <Link
          href="/service-area"
          className="inline-block bg-[#2C8B80] hover:bg-[#1F6259] text-white font-semibold px-6 py-3 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          See Our Full Service Area
        </Link>
      </div>
    </section>
  );
}
