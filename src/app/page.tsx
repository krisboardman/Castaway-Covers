import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-medium text-gray-800 mb-4">
          Apparel for Your Patio Furniture
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          Tailored covers that slip on in seconds and shrug off every forecast.
        </p>
        
        {/* Design My Cover Button */}
        <Link 
          href="/design" 
          className="inline-block bg-black text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Design my Cover
        </Link>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* Hassle Free */}
          <div className="text-center">
            <div className="mb-6">
              <img 
                src="https://castawaycovers.com/wp-content/uploads/2025/05/snap-strap-768x1024.jpeg"
                alt="Snap Strap"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Hassle Free</h3>
            <p className="text-gray-600">
              When you're ready to lounge, simply lift the front of the cover and secure it using the snap straps...
            </p>
          </div>

          {/* Unique Design */}
          <div className="text-center">
            <div className="mb-6">
              <img 
                src="https://castawaycovers.com/wp-content/uploads/2025/05/actual-with-gusset-974x1024.jpeg"
                alt="Corner Gussets"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Unique Design</h3>
            <p className="text-gray-600">
              Corner gussets make covering easy and ensure your cushions will stay dry.
            </p>
          </div>

          {/* Heavy Duty */}
          <div className="text-center">
            <div className="mb-6">
              <img 
                src="https://castawaycovers.com/wp-content/uploads/2025/05/bungee-e1747920604493-902x1024.jpeg"
                alt="Bungee System"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Heavy Duty</h3>
            <p className="text-gray-600">
              Made from marine-grade material these covers are tough, weather-resistant, and easy to maintain.
            </p>
          </div>

          {/* Weather Proof */}
          <div className="text-center">
            <div className="mb-6">
              <img 
                src="https://castawaycovers.com/wp-content/uploads/2025/05/side-bungee-1024x1022.jpeg"
                alt="Side Bungee"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Weather Proof</h3>
            <p className="text-gray-600">
              For windy days or storms, engage the built-in bungee system...
            </p>
          </div>

          {/* Mildew Resistant */}
          <div className="text-center">
            <div className="mb-6">
              <img 
                src="https://castawaycovers.com/wp-content/uploads/2025/05/mildew-puc.jpeg"
                alt="Mildew Resistant"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Mildew Resistant</h3>
            <p className="text-gray-600">
              Tight, clingy covers trap moisture — but not Castaway!
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}