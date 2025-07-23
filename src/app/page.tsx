import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Banner Background */}
      <section 
        className="relative text-center py-24 px-4"
        style={{
          backgroundImage: 'url("https://castawaycovers.com/wp-content/uploads/2024/10/CC-outdoor-scene.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">
            Apparel for Your Patio Furniture
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto mb-12">
            Tailored covers that slip on in seconds and shrug off every forecast.
          </p>
          
          {/* Design My Cover Button */}
          <Link 
            href="/design" 
            className="inline-block bg-black text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Design my Cover
          </Link>
        </div>
      </section>

      {/* 5 Features in a Row */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-5 gap-4">
            {/* Hassle Free */}
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">👍</div>
              <h3 className="font-semibold">Hassle Free</h3>
            </div>

            {/* Unique Design */}
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-semibold">Unique Design</h3>
            </div>

            {/* Heavy Duty */}
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">💪</div>
              <h3 className="font-semibold">Heavy Duty</h3>
            </div>

            {/* Weather Proof */}
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">☁️</div>
              <h3 className="font-semibold">Weather Proof</h3>
            </div>

            {/* Mildew Resistant */}
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="font-semibold">Mildew Resistant</h3>
            </div>
          </div>
        </div>
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