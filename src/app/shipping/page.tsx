import { generateMetadata as generateMeta } from "@/lib/metadata";

export const metadata = generateMeta('shipping');
export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping Information</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Processing Time</h2>
              <p className="text-gray-700">
                Custom covers require 7-14 days for manufacturing before shipping.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Methods</h2>
              <p className="text-gray-700">
                We ship via USPS, UPS, and FedEx. Shipping method is selected based on your location for fastest delivery.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Time</h2>
              <p className="text-gray-700">
                Once manufactured, delivery typically takes 3-7 business days within the continental United States.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Costs</h2>
              <p className="text-gray-700">
                Shipping costs are calculated at checkout based on your location and order size.
              </p>
            </section>


            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Restrictions</h2>
              <p className="text-gray-700">
                We currently ship to the continental United States only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Tracking</h2>
              <p className="text-gray-700">
                You'll receive a confirmation email with tracking information once your order ships.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Damaged or Lost Shipments</h2>
              <p className="text-gray-700">
                If your order arrives damaged or doesn't arrive, contact us immediately at support@castawaycovers.com with your order number and we'll make it right.
              </p>
            </section>


          </div>
        </div>
      </div>
    </div>
  );
}