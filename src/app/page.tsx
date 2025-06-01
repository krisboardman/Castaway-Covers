import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div className="text-2xl font-bold text-gray-900">
              CASTAWAY COVERS
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="text-center py-16 px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Tailored covers that slip on in seconds<br />
            and shrug off every forecast
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Custom patio furniture covers designed for hassle-free protection
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors">
            Design my Cover
          </button>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Hassle Free Image</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Hassle Free</h3>
                <p className="text-gray-600">Slip on in seconds with our innovative design</p>
              </div>
              
              <div className="text-center">
                <div className="h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Unique Design Image</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Unique Design</h3>
                <p className="text-gray-600">Tailored specifically for your patio furniture</p>
              </div>
              
              <div className="text-center">
                <div className="h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Heavy Duty Image</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Heavy Duty</h3>
                <p className="text-gray-600">Marine-grade materials built to last</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Weather Proof Protection
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our covers are designed to handle every weather condition. From scorching sun to heavy rain, 
                  your furniture stays protected with our advanced weather-resistant materials.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full mr-3"></div>
                    <span>UV Protection</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full mr-3"></div>
                    <span>Waterproof</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full mr-3"></div>
                    <span>Wind Resistant</span>
                  </div>
                </div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Weather Protection Image</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="h-96 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Mildew Resistant Image</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Mildew Resistant
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Breathable design prevents moisture buildup, keeping your covers fresh and 
                  mildew-free season after season.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li>• Breathable fabric technology</li>
                  <li>• Prevents moisture trapped underneath</li>
                  <li>• Long-lasting freshness</li>
                  <li>• Easy maintenance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">
            CASTAWAY COVERS
          </div>
          <p className="text-gray-600">
            Premium patio furniture protection
          </p>
        </div>
      </footer>
    </div>
  );
}
