import { generateMetadata as generateMeta } from "@/lib/metadata";
import { getFAQSchema } from "@/lib/structured-data";

export const metadata = generateMeta('faqs');
export default function FAQsPage() {
  const faqSchema = getFAQSchema();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
          
          <div className="space-y-8">
            {/* Ordering & Sizing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ordering & Sizing</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How do I know what size cover to order?
                  </h3>
                  <p className="text-gray-700">
                    Measure at the widest points. Add 1 inch to each measurement for easier installation. Use our measurement calculator on each product page for specific guidance.
                  </p>
                </div>


                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What if I order the wrong size?
                  </h3>
                  <p className="text-gray-700">
                    All Castaway Covers are custom-made to your specifications and are non-returnable except for defects in materials or workmanship. We manufacture exactly to the dimensions you provide, so please double-check all measurements before ordering. We cannot accept returns for incorrect measurements provided at checkout.
                  </p>
                </div>
              </div>
            </section>

            {/* Product Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What material are the covers made from?
                  </h3>
                  <p className="text-gray-700">
                    <strong>Main body:</strong> Marine-grade vinyl with polyester backing. This premium material is:
                    <br />• 100% waterproof
                    <br />• UV resistant (650 hours)
                    <br />• Mildew and fungal resistant
                    <br />• Cold crack resistant to -25°F
                    <br />• Fire retardant (self-extinguishing)
                    <br />• 32 oz weight for durability
                    <br /><br />
                    <strong>Gussets:</strong> Durable outdoor waterproof fabric that provides flexibility and breathability while maintaining weather protection.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Are the covers waterproof?
                  </h3>
                  <p className="text-gray-700">
                    Our covers are made from 100% waterproof marine-grade vinyl with sealed seams, providing
                    excellent protection from rain, snow, and UV exposure. Because the covers drape over your
                    furniture rather than forming a sealed enclosure, some moisture from wind-driven rain or
                    splashing may reach the furniture underneath. For best results, use the bungee system to
                    secure the cover snugly.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Do you make covers for round-backed furniture?
                  </h3>
                  <p className="text-gray-700">
                    Our covers are currently designed for straight-backed and square or rectangular furniture profiles. Round-backed designs are coming soon! In the meantime, if you have a unique piece you&apos;d like covered, <a href="/contact" className="text-blue-600 hover:text-blue-800 underline">contact us</a> to discuss custom options.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How long will my cover last?
                  </h3>
                  <p className="text-gray-700">
                    With proper care, our covers typically last 5-7 years or more. We back this with our 2-year warranty. Longevity depends on climate conditions and maintenance.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Are there other colors available?
                  </h3>
                  <p className="text-gray-700">
                    Other colors may be available for a slight upcharge. <a href="/contact" className="text-blue-600 hover:text-blue-800 underline">Contact us</a> to let us know what you&apos;re looking for.
                  </p>
                </div>
              </div>
            </section>

            {/* Shipping & Delivery */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping & Delivery</h2>
              
              <div className="space-y-4">

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Do you ship internationally?
                  </h3>
                  <p className="text-gray-700">
                    Currently, we ship within the continental United States only.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Is shipping free?
                  </h3>
                  <p className="text-gray-700">
                    Shipping is calculated during the ordering process.
                  </p>
                </div>
              </div>
            </section>

            {/* Care & Maintenance */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Care & Maintenance</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How do I clean my cover?
                  </h3>
                  <p className="text-gray-700">
                    Simply hose off with water for regular cleaning. For deeper cleaning, use mild 
                    soap and a soft brush, then rinse thoroughly. Never use bleach or harsh chemicals, 
                    and avoid machine washing.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I leave my cover on year-round?
                  </h3>
                  <p className="text-gray-700">
                    Yes! Our covers are designed for year-round use. The wavy edge design plus bungee system provide ventilation to prevent moisture buildup, and the durable fabric withstands all weather conditions. It is recommended to remove cushions during the season when the furniture is not in use (remove and store away).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How do the covers protect against mold and mildew?
                  </h3>
                  <p className="text-gray-700">
                    Our covers use waterproof, mildew-resistant marine-grade vinyl. The wavy edge design plus bungee system provide ventilation to prevent moisture buildup.
                  </p>
                </div>
              </div>
            </section>

            {/* Warranty & Returns */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Warranty & Returns</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What does the warranty cover?
                  </h3>
                  <p className="text-gray-700">
                    All Castaway Covers come with a 2-year limited warranty covering defects in materials and workmanship including:
                    <br />• Fabric defects including premature wear, tearing, or degradation
                    <br />• Stitching and seam failures
                    <br />• Snap, handle, or magnet malfunctions
                    <br />• Waterproofing failure under normal conditions
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What's your return policy?
                  </h3>
                  <p className="text-gray-700">
                    All Castaway Covers are custom-made and are non-returnable except for defects in materials or workmanship. Defective items are covered under our warranty.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How do I file a warranty claim?
                  </h3>
                  <p className="text-gray-700">
                    Email support@castawaycovers.com with your order number, description of the issue, and photos. We'll review your claim within 2-3 business days and provide a resolution.
                  </p>
                </div>
              </div>
            </section>

            {/* Still Have Questions? */}
            <section className="mt-12 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Still Have Questions?</h2>
              <p className="text-gray-700 mb-4">
                Our customer service team is here to help!
              </p>
              <div className="space-y-2 text-gray-700">
                <p>Email: support@castawaycovers.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
