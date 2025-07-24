export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Customer Reviews</h1>
          
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="text-3xl font-bold text-gray-900 mr-4">4.8</div>
              <div>
                <div className="flex text-yellow-400 mb-1">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i} className={i < 4 ? "" : "text-gray-300"}>{star}</span>
                  ))}
                </div>
                <p className="text-gray-600">Based on 1,234 reviews</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Sample Review 1 */}
            <div className="border-b pb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">Sarah M.</h3>
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
                </div>
                <span className="text-gray-500 text-sm">2 weeks ago</span>
              </div>
              <p className="text-gray-700">
                Excellent quality covers! They fit perfectly on our patio furniture and have held up 
                beautifully through several storms. The customer service team was also very helpful 
                with sizing questions.
              </p>
            </div>

            {/* Sample Review 2 */}
            <div className="border-b pb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">John D.</h3>
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
                </div>
                <span className="text-gray-500 text-sm">1 month ago</span>
              </div>
              <p className="text-gray-700">
                Best investment for our outdoor furniture. The covers are heavy-duty and the 
                custom sizing option ensured a perfect fit. Highly recommend!
              </p>
            </div>

            {/* Sample Review 3 */}
            <div className="border-b pb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">Emily R.</h3>
                  <div className="flex text-yellow-400 text-sm">★★★★☆</div>
                </div>
                <span className="text-gray-500 text-sm">2 months ago</span>
              </div>
              <p className="text-gray-700">
                Great quality covers that do exactly what they promise. Only minor issue was 
                shipping took a bit longer than expected, but the product quality makes up for it.
              </p>
            </div>

            {/* Sample Review 4 */}
            <div className="border-b pb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">Michael T.</h3>
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
                </div>
                <span className="text-gray-500 text-sm">3 months ago</span>
              </div>
              <p className="text-gray-700">
                These covers have survived a harsh winter and still look brand new. The waterproofing 
                is excellent and they're easy to put on and take off. Worth every penny!
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Load More Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}