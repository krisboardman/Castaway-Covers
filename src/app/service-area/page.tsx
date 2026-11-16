import Link from "next/link";
import { generateMetadata as generateMeta } from "@/lib/metadata";
import { SERVICE_AREA_TOWNS } from "@/config/service-area";

export const metadata = generateMeta('serviceArea');

export default function ServiceAreaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Custom Marine Vinyl Covers in Monmouth County, NJ
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Castaway Covers is a local business based in Rumson, NJ. We make custom-fit outdoor
            furniture covers from marine-grade vinyl and serve homeowners throughout Monmouth County.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works Locally</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li><strong>We come to you.</strong> We measure every piece of furniture at your home.</li>
              <li><strong>We design it.</strong> Each cover is designed around your furniture, down to the snaps and bungees.</li>
              <li><strong>We build it.</strong> Your covers are cut and sewn in Rumson from waterproof, UV-resistant marine-grade vinyl.</li>
              <li><strong>We install it.</strong> We put every cover on and make any adjustments until it fits just right.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Towns We Serve</h2>
            <p className="text-gray-700 mb-4">
              We serve every town in Monmouth County, NJ:
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-gray-700">
              {SERVICE_AREA_TOWNS.map((town) => (
                <li key={town}>{town}</li>
              ))}
            </ul>
            <p className="text-gray-700 mt-4">
              Just outside the county? <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">Contact us</Link> and
              we&apos;ll let you know whether we can make it work.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Built for Shore Weather</h2>
            <p className="text-gray-700">
              Marine-grade vinyl is made for boats, so it stands up to the sun, rain and mildew that come
              with life near the water. Built-in bungees tuck away when not needed and can be deployed in high
              winds to keep your cover in place.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Started</h2>
            <p className="text-gray-700 mb-4">
              Questions? Call or text us at{' '}
              <a href="tel:+17326390162" className="text-blue-600 hover:text-blue-800 underline">732-639-0162</a>.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/measurement-service"
                className="inline-block bg-[#2C8B80] hover:bg-[#1F6259] text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Schedule a Measure &amp; Quote
              </Link>
              <Link
                href="/faqs"
                className="inline-block border border-[#2C8B80] text-[#2C8B80] hover:bg-[#2C8B80]/10 font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Read Local FAQs
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
