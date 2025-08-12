export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Castaway Covers</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Castaway Covers specializes in custom-manufactured outdoor furniture covers, crafted specifically 
                to your exact measurements. We believe that your outdoor furniture deserves protection that fits 
                perfectly, not generic one-size-fits-all solutions.
              </p>
              <p className="text-gray-700">
                Every cover we create is made-to-order in the USA, ensuring precise fit and superior quality. 
                We work directly with homeowners who value their outdoor investments and want covers that will 
                last for years.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700">
                To deliver perfectly-fitted, custom-made outdoor furniture covers that provide superior protection 
                and longevity. We manufacture each cover to your exact specifications, ensuring a precise fit that 
                generic covers simply can't match.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Castaway Covers?</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>100% custom-made to your exact measurements</li>
                <li>Manufactured in the USA with premium outdoor materials</li>
                <li>2-year warranty on all custom covers</li>
                <li>Waterproof, UV-resistant, and breathable fabric</li>
                <li>Wavy edge and bungee system for secure fit and ventilation</li>
                <li>No returns needed when you measure correctly - we guide you through it</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-700">
                We stand behind every custom cover we manufacture with a 2-year warranty. Our team is here to help you 
                measure correctly the first time, ensuring your cover fits perfectly. Each cover is crafted with attention 
                to detail and built to protect your outdoor furniture for years to come.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}