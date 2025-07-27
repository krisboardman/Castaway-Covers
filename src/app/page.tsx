import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Banner Background */}
      <section 
        className="relative text-center py-24 px-4"
        style={{
          backgroundImage: 'url("/images/homepage/hero-set.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">
            Apparel for Your Patio Furniture
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Tailored covers that slip on in seconds and shrug off every forecast.
          </p>
        </div>
      </section>

      {/* 5 Features in a Row */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Hassle Free */}
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="p-4 text-center bg-white">
                <div className="text-2xl mb-2">👍</div>
                <h3 className="font-semibold mb-2">Hassle Free</h3>
                <div className="h-64 relative mb-2">
                  <img 
                    src="/images/homepage/snap-strap.jpeg"
                    alt="Hassle Free"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <p className="text-sm text-gray-600">When you're ready to lounge, simply lift the front of the cover and secure it using the snap straps. Voilà — shade and relaxation await!</p>
              </div>
            </div>

            {/* Unique Design */}
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="p-4 text-center bg-white">
                <div className="text-2xl mb-2">⭐</div>
                <h3 className="font-semibold mb-2">Unique Design</h3>
                <div className="h-64 relative mb-2">
                  <img 
                    src="/images/homepage/actual-with-gusset.jpeg"
                    alt="Unique Design"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <p className="text-sm text-gray-600">Corner gussets for easy fit</p>
              </div>
            </div>

            {/* Heavy Duty */}
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="p-4 text-center bg-white">
                <div className="text-2xl mb-2">💪</div>
                <h3 className="font-semibold mb-2">Heavy Duty</h3>
                <div className="h-64 relative mb-2">
                  <img 
                    src="/images/homepage/bungee.jpeg"
                    alt="Heavy Duty"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <p className="text-sm text-gray-600">Made from marine-grade material these covers are tough, weather-resistant, and easy to maintain.</p>
              </div>
            </div>

            {/* Weather Proof */}
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="p-4 text-center bg-white">
                <div className="text-2xl mb-2">☁️</div>
                <h3 className="font-semibold mb-2">Weather Proof</h3>
                <div className="h-64 relative mb-2">
                  <img 
                    src="/images/homepage/side-bungee.jpeg"
                    alt="Weather Proof"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <p className="text-sm text-gray-600">For windy days or storms, engage the built-in bungee system by feeding it underneath and pull it tight for ultra security.</p>
              </div>
            </div>

            {/* Mildew Resistant */}
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="p-4 text-center bg-white">
                <div className="text-2xl mb-2">🛡️</div>
                <h3 className="font-semibold mb-2">Mildew Resistant</h3>
                <div className="h-64 relative mb-2">
                  <img 
                    src="/images/homepage/mildew-pic.jpeg"
                    alt="Mildew Resistant"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <p className="text-sm text-gray-600">Tight, clingy covers trap moisture — but not Castaway! It's breathable, so moisture evaporates naturally, preventing mildew buildup.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}