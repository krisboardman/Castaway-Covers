export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Product Instructions</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Installation Guide</h2>
              <p className="text-gray-700 mb-4">
                Follow these simple steps to properly install your Castaway Cover:
              </p>
              
              <ol className="list-decimal list-inside text-gray-700 space-y-3">
                <li>
                  <strong>Prepare Your Furniture:</strong> Clean and dry your outdoor furniture 
                  completely before covering
                </li>
                <li>
                  <strong>Position the Cover:</strong> Align the back seam with the back of the 
                  seat rest
                </li>
                <li>
                  <strong>Adjust for Fit:</strong> Pull the cover down evenly on all sides, 
                  ensuring it reaches the desired height
                </li>
                <li>
                  <strong>Secure the Cover:</strong> For heavy wind, fasten with bungees by 
                  unhooking and placing in the grommet. Adjust the clip so that it is tight
                </li>
                <li>
                  <strong>Check Ventilation:</strong> Ensure sides are not blocked, so air can 
                  flow freely under the cover
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cleaning & Maintenance</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Regular Cleaning</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Brush off loose dirt and debris regularly</li>
                <li>Hose down with water as needed</li>
                <li>For stubborn stains, use mild soap and a soft brush</li>
                <li>Rinse thoroughly and allow to air dry completely</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">Deep Cleaning</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Mix 1/4 cup mild soap with 1 gallon of lukewarm water</li>
                <li>Apply solution with a soft bristle brush</li>
                <li>Work on small sections at a time</li>
                <li>Rinse thoroughly with clean water</li>
                <li>Allow to air dry completely before storage or reuse</li>
              </ol>

              <div className="bg-yellow-50 p-4 rounded-md mt-4">
                <p className="text-gray-700">
                  <strong>Important:</strong> Never use bleach, harsh detergents, or put covers 
                  in the washing machine or dryer.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Storage Tips</h2>
              <p className="text-gray-700 mb-4">
                Proper storage extends the life of your cover:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Clean and dry completely before storing</li>
                <li>Store in a dry, ventilated area</li>
                <li>Any creases from storage will naturally flatten out when exposed to warm weather</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Safety Guidelines</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Check covers regularly for wear or damage</li>
                <li>Replace covers showing signs of significant wear</li>
                <li>Ensure covers are properly secured in windy conditions</li>
                <li>Remove pooled water or snow promptly</li>
                <li>Never use covers near open flames or heat sources</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Troubleshooting</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Water Pooling</h3>
                  <p className="text-gray-700">
                    Ensure covers are pulled taut when secured with bungees to prevent low areas 
                    where water can collect.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Wind Issues</h3>
                  <p className="text-gray-700">
                    Ensure all bungees are tightened properly through the grommets.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Mold/Mildew</h3>
                  <p className="text-gray-700">
                    Ensure furniture is dry before covering. Check that sides are unobstructed. 
                    Clean with a mold/mildew remover safe for outdoor fabrics.
                  </p>
                </div>
              </div>
            </section>

            {/* Video Tutorials - Hidden for now
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Video Tutorials</h2>
              <p className="text-gray-700 mb-4">
                Visit our YouTube channel for helpful video guides:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>How to Measure Your Furniture</li>
                <li>Proper Installation Techniques</li>
                <li>Cleaning and Maintenance Tips</li>
                <li>Seasonal Storage Best Practices</li>
              </ul>
            </section>
            */}

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-gray-700">
                Our customer service team is available to answer any questions:<br />
                Email: support@castawaycovers.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}