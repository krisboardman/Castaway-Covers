import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <section className="text-center py-16 px-4">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-700 mb-12">
            Apparel for Your Patio Furniture
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 max-w-4xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">Hassle Free</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">Unique Design</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">Heavy Duty</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">Weather Proof</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">Mildew Resistant</div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Shop by Product Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mb-8">
              <Link href="/products/sofa" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
                <div className="text-lg font-medium">Sofa</div>
              </Link>
              <Link href="/products/chair" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
                <div className="text-lg font-medium">Chair</div>
              </Link>
              <Link href="/products/table" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
                <div className="text-lg font-medium">Table</div>
              </Link>
              <Link href="/products/ottoman" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
                <div className="text-lg font-medium">Ottoman</div>
              </Link>
              <Link href="/products/loveseat" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
                <div className="text-lg font-medium">Loveseat</div>
              </Link>
              <Link href="/products/sectional" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
                <div className="text-lg font-medium">Sectional</div>
              </Link>
            </div>
            <a 
              href="https://castawaycovers.com/design-my-cover/" 
              className="inline-block bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Or Use Our Design Tool
            </a>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Snap Straps & Bungee System
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our innovative snap strap and bungee system makes covering your furniture effortless. 
                  Simply snap on in seconds and your furniture is protected from the elements.
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li>• Quick snap-on design</li>
                  <li>• Secure bungee system</li>
                  <li>• No tools required</li>
                  <li>• Fits perfectly every time</li>
                </ul>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Snap Straps & Bungee Demo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center lg:order-1">
                <span className="text-gray-500">Marine-Grade Material</span>
              </div>
              <div className="lg:order-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Marine-Grade Materials
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Built with the same materials used in marine applications, our covers are designed 
                  to withstand the harshest weather conditions while maintaining their appearance.
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li>• UV resistant fabric</li>
                  <li>• Waterproof construction</li>
                  <li>• Tear and puncture resistant</li>
                  <li>• Fade resistant colors</li>
                </ul>
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

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Breathable Design
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our breathable design allows air circulation while keeping moisture out, 
                  preventing mildew and maintaining the quality of your furniture underneath.
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li>• Advanced breathable fabric</li>
                  <li>• Prevents condensation buildup</li>
                  <li>• Mildew and mold resistant</li>
                  <li>• Maintains furniture freshness</li>
                </ul>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Breathable Design Features</span>
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
