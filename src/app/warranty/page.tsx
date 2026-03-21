import { generateMetadata as generateMeta } from "@/lib/metadata";

export const metadata = generateMeta('warranty');
export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Warranty Information</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Warranty Promise</h2>
              <div className="bg-green-50 p-6 rounded-md mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">2-Year Limited Warranty</h3>
                <p className="text-gray-700">
                  Castaway Covers are warranted against defects in materials and workmanship for 2 years from purchase date.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What's Covered</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fabric defects including premature wear, tearing, or degradation</li>
                <li>Stitching and seam failures</li>
                <li>Snap, handle, or magnet malfunctions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What's Not Covered</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Normal wear and tear</li>
                <li>Damage from misuse, abuse, or neglect</li>
                <li>Damage from extreme weather events (hurricanes, tornadoes, etc.)</li>
                <li>Damage from sharp objects or abrasive surfaces</li>
                <li>Unauthorized modifications or repairs</li>
                <li>Damage from improper storage or installation</li>
                <li>Mold or mildew due to improper ventilation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to File a Warranty Claim</h2>
              <ol className="list-decimal list-inside text-gray-700 space-y-3">
                <li>
                  <strong>Document the Issue:</strong> Take clear photos of the defect or damage
                </li>
                <li>
                  <strong>Gather Information:</strong> Have your order number and purchase date ready
                </li>
                <li>
                  <strong>Contact Us:</strong> Email support@castawaycovers.com with:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Order number</li>
                    <li>Description of the issue</li>
                    <li>Photos of the defect</li>
                    <li>Photos of the entire cover</li>
                  </ul>
                </li>
                <li>
                  <strong>Review Process:</strong> Our team will review your claim within 2-3 business days
                </li>
                <li>
                  <strong>Resolution:</strong> If approved, we'll either repair or replace your cover
                </li>
              </ol>
            </section>


            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Care Instructions</h2>
              <p className="text-gray-700 mb-4">
                To ensure your warranty remains valid and your covers last:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Clean covers regularly with mild soap and water</li>
                <li>Allow covers to dry completely before storage</li>
                <li>Store in a cool, dry place when not in use</li>
                <li>Ensure proper ventilation to prevent moisture buildup</li>
                <li>Avoid dragging covers over rough surfaces</li>
              </ul>
            </section>


            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Warranty Support</h2>
              <p className="text-gray-700">
                For warranty claims or questions, contact us at:<br />
                Email: support@castawaycovers.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
