import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section with 3-Panel Story */}
      <section className="relative pt-6 pb-4 px-4 bg-gradient-to-b from-white to-[#FAF5ED]/30">
        <div className="max-w-7xl mx-auto">
          {/* Hero Text */}
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Premium Outdoor Furniture Protection
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Custom-fit covers that slip on in seconds and withstand any weather.
            </p>
          </div>

          {/* 3-Panel Visual Story */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Panel 1: Draping On */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <div className="aspect-[4/3] bg-gray-200">
                <img 
                  src="/images/hero1.jpg" 
                  alt="Easy draping cover"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Panel 2: Protected */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <div className="aspect-[4/3] bg-gray-200">
                <img 
                  src="/images/hero2.jpg" 
                  alt="Covered furniture protected"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Panel 3: Enjoying */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <div className="aspect-[4/3] bg-gray-200">
                <img 
                  src="/images/hero3.jpg" 
                  alt="Enjoying furniture with coffee"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link 
              href="/design" 
              className="inline-block bg-[#2C8B80] hover:bg-[#1F6259] text-white font-semibold px-7 py-3 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Design My Cover
            </Link>
          </div>
        </div>
      </section>

      {/* Why We're Different Section */}
      <section className="pt-6 pb-8 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Castaway Covers Are Different
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've obsessed over every detail to create covers that actually work—not just another tarp with straps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Hassle Free */}
            <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src="/images/homepage/actual-with-gusset.jpeg"
                  alt="Just Drape & Go"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Just Drape & Go</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Smart vinyl + gusset design means covers drape on effortlessly. The weight keeps them in place—no tie-downs needed.</p>
              </div>
            </div>

            {/* Unique Design */}
            <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src="/images/homepage/snap-strap.jpeg"
                  alt="Use Without Removing"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Use Without Removing</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Snap straps let you fold covers back instantly. Enjoy your furniture, then snap back for protection—no removal needed.</p>
              </div>
            </div>

            {/* Heavy Duty */}
            <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src="/images/homepage/bungee.jpeg"
                  alt="Heavy Duty"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">100% Waterproof</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Weather-tough vinyl resists heavy rain and keeps furniture bone dry. Tested in real downpours.</p>
              </div>
            </div>

            {/* Weather Proof */}
            <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src="/images/homepage/side-bungee.jpeg"
                  alt="Weather Proof"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Storm-Secure Bungees</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Built-in bungees stay attached and tuck away when not needed. Deploy them for high winds—your cover stays put.</p>
              </div>
            </div>

            {/* Mildew Resistant */}
            <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src="/images/homepage/mildew-pic.jpeg"
                  alt="Mildew Resistant"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">UV & Mildew Protected</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Resists sun damage and mildew growth. Your furniture stays fresh, not musty, season after season.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}