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
                Founded in [Year], Castaway Covers has been dedicated to providing premium outdoor furniture covers 
                that protect your investment and keep your outdoor spaces beautiful year-round.
              </p>
              <p className="text-gray-700">
                What started as a small family business has grown into a trusted name in outdoor furniture protection, 
                serving thousands of satisfied customers across the country.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700">
                To provide high-quality, custom-fit outdoor furniture covers that combine superior protection, 
                durability, and style, ensuring your outdoor furniture remains pristine through every season.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Castaway Covers?</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Premium materials that withstand harsh weather conditions</li>
                <li>Custom sizing options for a perfect fit</li>
                <li>Industry-leading warranty protection</li>
                <li>Expert customer service and support</li>
                <li>Eco-friendly manufacturing processes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-700">
                We're committed to excellence in every aspect of our business, from the quality of our products 
                to the service we provide. Your satisfaction is our top priority, and we stand behind every cover we make.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}