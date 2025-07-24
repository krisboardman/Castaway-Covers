export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping Information</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Options</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shipping Method
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Standard Shipping
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        5-7 Business Days
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        Free on orders over $99
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Express Shipping
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        2-3 Business Days
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        $19.99
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Overnight Shipping
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        1 Business Day
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        $39.99
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Free Shipping</h2>
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-gray-700">
                  <strong>FREE Standard Shipping on all orders over $99!</strong><br />
                  No coupon code needed - discount automatically applied at checkout.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Processing Times</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>In-Stock Items:</strong> Ship within 1-2 business days</li>
                <li><strong>Custom Covers:</strong> 2-3 weeks for manufacturing, then shipped</li>
                <li><strong>Bulk Orders:</strong> May require additional processing time</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Orders placed after 2:00 PM EST will be processed the next business day.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Destinations</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">United States</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                <li>All 50 states</li>
                <li>APO/FPO addresses</li>
                <li>US territories (additional fees may apply)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">Canada</h3>
              <p className="text-gray-700 mb-4">
                We ship to all Canadian provinces. International shipping rates apply. 
                Customers are responsible for any customs fees or import duties.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">Other International</h3>
              <p className="text-gray-700">
                Please contact us for international shipping quotes outside of North America.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tracking Your Order</h2>
              <p className="text-gray-700 mb-4">
                Once your order ships, you'll receive a confirmation email with tracking information. 
                You can track your package using:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>The tracking link in your shipping confirmation email</li>
                <li>Your account dashboard on our website</li>
                <li>The carrier's website directly with your tracking number</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Signature Requirements</h3>
              <p className="text-gray-700 mb-4">
                Orders over $500 may require a signature upon delivery for security purposes.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delivery Issues</h3>
              <p className="text-gray-700 mb-4">
                If your package is marked as delivered but you haven't received it:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Check with neighbors or building management</li>
                <li>Look for a delivery notice</li>
                <li>Contact the carrier directly</li>
                <li>Reach out to our customer service team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Holiday Shipping</h2>
              <p className="text-gray-700 mb-4">
                During peak seasons (November-January), please allow extra time for delivery:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Order by December 15th for Christmas delivery (standard shipping)</li>
                <li>Express and overnight options available through December 20th</li>
                <li>Check our homepage for specific holiday cutoff dates</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Damaged or Lost Packages</h2>
              <p className="text-gray-700 mb-4">
                We insure all shipments against damage or loss. If you receive a damaged package:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Take photos of the damaged packaging and product</li>
                <li>Keep all packaging materials</li>
                <li>Contact us within 48 hours of delivery</li>
                <li>We'll arrange for a replacement or refund</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Questions?</h2>
              <p className="text-gray-700">
                Our customer service team is here to help!<br />
                Email: shipping@castawaycovers.com<br />
                Phone: 1-800-XXX-XXXX<br />
                Hours: Monday - Friday, 8:00 AM - 6:00 PM EST
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}