import { generateMetadata as generateMeta } from "@/lib/metadata";

export const metadata = generateMeta('terms');
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              <strong>Last Updated:</strong> November 11, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using the Castaway Covers website and services, you agree to be 
                bound by these Terms of Service. If you do not agree to these terms, please do not 
                use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of Our Services</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Eligibility</h3>
              <p className="mb-4">
                You must be at least 18 years old to use our services and make purchases.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Responsibilities</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account information 
                and for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Products and Pricing</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Descriptions</h3>
              <p className="mb-4">
                We strive to provide accurate product descriptions and images. However, we do not 
                warrant that descriptions or other content is accurate, complete, or error-free.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pricing</h3>
              <p>
                All prices are in USD and are subject to change without notice. We reserve the right 
                to modify or discontinue products at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Orders and Payment</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Acceptance</h3>
              <p className="mb-4">
                We reserve the right to refuse or cancel any order for any reason, including 
                availability, errors in product or pricing information, or suspected fraud.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment</h3>
              <p>
                By submitting an order, you represent that the payment information provided is 
                accurate and that you are authorized to use the payment method.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Shipping and Delivery</h2>
              <p>
                Shipping times and costs vary based on location and selected shipping method. 
                We are not responsible for delays caused by shipping carriers or circumstances 
                beyond our control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Returns and Refunds</h2>
              <p>
                Please refer to our Returns & Exchanges page for detailed information about our 
                return policy and procedures.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, and images, is the 
                property of Castaway Covers and is protected by copyright and other intellectual 
                property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Castaway Covers shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages arising from your 
                use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Indemnification</h2>
              <p>
                You agree to indemnify and hold Castaway Covers harmless from any claims, losses, 
                or damages arising from your violation of these terms or your use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
              <p>
                These Terms of Service are governed by the laws of [State/Country], without regard 
                to conflict of law principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p>
                We reserve the right to update these terms at any time. Changes will be effective 
                immediately upon posting to the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at:<br />
                Email: support@castawaycovers.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}