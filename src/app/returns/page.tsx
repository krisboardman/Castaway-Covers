export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Returns & Exchanges</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Return Policy</h2>
              <p className="text-gray-700 mb-4">
                We want you to be completely satisfied with your Castaway Covers purchase. If you're 
                not happy with your order, we offer a hassle-free return and exchange policy.
              </p>
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <p className="font-semibold text-gray-900">30-Day Return Window</p>
                <p className="text-gray-700">
                  You have 30 days from the date of delivery to return or exchange your cover.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Eligibility</h2>
              <p className="text-gray-700 mb-4">To be eligible for a return, your item must be:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Unused and in the same condition as received</li>
                <li>In the original packaging</li>
                <li>Accompanied by the receipt or proof of purchase</li>
              </ul>
              <p className="text-gray-700">
                <strong>Note:</strong> Custom-made covers are final sale and cannot be returned 
                unless defective.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Return</h2>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Contact our customer service team at returns@castawaycovers.com</li>
                <li>Provide your order number and reason for return</li>
                <li>Receive a Return Merchandise Authorization (RMA) number</li>
                <li>Pack the item securely in original packaging</li>
                <li>Include the RMA number on the outside of the package</li>
                <li>Ship the item to the address provided by customer service</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exchanges</h2>
              <p className="text-gray-700 mb-4">
                Need a different size or style? We're happy to help with exchanges. The process is 
                similar to returns:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Contact customer service to initiate an exchange</li>
                <li>We'll send you the new item once we receive the original</li>
                <li>If there's a price difference, we'll charge or refund accordingly</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Processing</h2>
              <p className="text-gray-700 mb-4">Once we receive and inspect your return:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>We'll send you an email confirmation</li>
                <li>Approved refunds are processed within 5-7 business days</li>
                <li>Refunds are issued to the original payment method</li>
                <li>It may take additional time for your bank to process the refund</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Costs</h2>
              <p className="text-gray-700 mb-4">
                <strong>Standard Returns:</strong> Customer is responsible for return shipping costs<br />
                <strong>Defective Items:</strong> We'll provide a prepaid shipping label<br />
                <strong>Wrong Item Sent:</strong> We'll provide a prepaid shipping label
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Damaged or Defective Items</h2>
              <p className="text-gray-700">
                If you receive a damaged or defective item, please contact us immediately with photos 
                of the damage. We'll arrange for a replacement or full refund, including shipping costs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions?</h2>
              <p className="text-gray-700">
                Our customer service team is here to help!<br />
                Email: returns@castawaycovers.com<br />
                Hours: Monday - Friday, 8:00 AM - 6:00 PM EST
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}