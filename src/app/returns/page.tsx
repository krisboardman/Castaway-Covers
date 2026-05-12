import { generateMetadata as generateMeta } from "@/lib/metadata";

export const metadata = generateMeta('returns');
export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Returns & Exchanges</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Custom-Made Products</h2>
              <p className="text-gray-700 mb-4">
                All Castaway Covers are custom-made to your specifications and are <strong>non-returnable and non-refundable</strong> except in the following circumstances:
              </p>
              
              <div className="bg-green-50 p-4 rounded-md mb-4">
                <p className="font-semibold text-gray-900 mb-2">We Accept Returns For:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Defects in materials or workmanship</li>
                  <li>Damage during shipping</li>
                  <li>Errors in production (we made it wrong)</li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-4 rounded-md mb-4">
                <p className="font-semibold text-gray-900 mb-2">We Cannot Accept Returns For:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Incorrect measurements provided by customer</li>
                  <li>Color variations from screen display</li>
                  <li>Size issues due to customer measurement errors</li>
                  <li>Normal wear and tear after use</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Report an Issue</h2>
              <p className="text-gray-700 mb-4">If you receive a damaged or defective product:</p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Contact us within 7 days of delivery at support@castawaycovers.com</li>
                <li>Include photos of the issue and your order number</li>
                <li>We'll review and respond within 48 hours</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resolution Options</h2>
              <p className="text-gray-700 mb-4">For valid claims, we will offer one of the following:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Replacement cover at no charge</li>
                <li>Store credit for full purchase amount</li>
                <li>Repair of the cover (if feasible)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Measurement Accuracy</h2>
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-gray-700">
                  <strong>Important:</strong> We manufacture exactly to the dimensions you provide. Please double-check all measurements before ordering. We recommend measuring twice to ensure accuracy. We cannot be responsible for covers that don't fit due to incorrect measurements provided at checkout.
                </p>
              </div>
            </section>


            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Costs</h2>
              <p className="text-gray-700 mb-4">
                <strong>Defective Items:</strong> We'll provide a prepaid shipping label<br />
                <strong>Our Error:</strong> We'll provide a prepaid shipping label<br />
                <strong>Customer Error:</strong> Not eligible for return
              </p>
            </section>


            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions?</h2>
              <p className="text-gray-700">
                Our customer service team is here to help!<br />
                Email: support@castawaycovers.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}