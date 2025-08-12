import Link from "next/link";

export default function DesignPage() {
  const furnitureTypes = [
    {
      name: "Chairs / Recliners",
      href: "/products/chairs-recliners",
      image: "/images/Chairs-Recliners/sketchchair.png",
      description: "Best for square & rectangular designs",
      popular: true
    },
    {
      name: "Professional Measurement",
      href: "/measurement-service",
      image: "measurement-service",
      description: "We'll measure your furniture and create your perfect custom order",
      isService: true,
      price: "$75 service fee",
      badge: "Local Service",
      badgeColor: "bg-yellow-500 text-gray-900"
    },
    {
      name: "Sofas / Loveseats",
      href: "/products/sofas-loveseats",
      image: "/images/Sofas-Loveseats/sketchsofa.png",
      description: "Any length, optional magnetic closures for easy use"
    },
    {
      name: "Chaise Lounges",
      href: "/products/chaise-lounge",
      image: "/images/ChaiseLounges/sketchchaise.png",
      description: "Pool and patio loungers"
    },
    {
      name: "Tables",
      href: "/products/tables",
      image: "/images/Tables/sketchtable.png",
      description: "Dining and coffee tables"
    },
    {
      name: "Table Sets",
      href: "/products/table-sets",
      image: "/images/Tablesets/sketchtableset.png",
      description: "Complete dining sets with chairs or benches"
    },
    {
      name: "Ottomans",
      href: "/products/ottomans",
      image: "/images/Ottomans/sketchottoman.png",
      description: "Footrests and storage ottomans"
    }
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Furniture Type
          </h1>
          <p className="text-lg text-gray-600">
            Select your furniture below to start customizing your perfect-fit cover
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {furnitureTypes.map((type) => (
            <Link 
              key={type.name}
              href={type.href}
              className="group relative block"
            >
              {type.popular && (
                <div className="absolute top-4 right-4 z-10 bg-[#2C8B80] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              {type.badge && (
                <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-sm font-semibold ${type.badgeColor || 'bg-[#2C8B80] text-white'}`}>
                  {type.badge}
                </div>
              )}
              <div className={`bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl h-full ${
                type.isService ? 'border-yellow-400 hover:border-yellow-500' : 'border-gray-100 hover:border-[#2C8B80]'
              }`}>
                <div className={`relative h-48 flex items-center justify-center overflow-hidden ${
                  type.isService ? 'bg-gradient-to-b from-yellow-50 to-white' : 'bg-gradient-to-b from-gray-50 to-white'
                }`}>
                  {type.isService ? (
                    <div className="text-center p-6">
                      <div className="text-6xl mb-2">📏</div>
                      <p className="text-lg font-semibold text-gray-900">Professional<br/>Measurement</p>
                    </div>
                  ) : (
                    <>
                      <img 
                        src={type.image}
                        alt={type.name}
                        className="max-w-full max-h-full object-contain p-6 transition-all duration-500 group-hover:scale-110 group-hover:opacity-80"
                      />
                      {/* Hover overlay with teal tint */}
                      <div className="absolute inset-0 bg-[#2C8B80] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </>
                  )}
                </div>
                
                <div className={`p-5 border-t ${type.isService ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100'}`}>
                  <h3 className={`text-xl font-semibold transition-colors mb-2 ${
                    type.isService ? 'text-gray-900 group-hover:text-yellow-600' : 'text-gray-900 group-hover:text-[#2C8B80]'
                  }`}>
                    {type.isService ? 'In-Home Service' : type.name}
                  </h3>
                  {type.isService && (
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Rumson area only</span> (10 mile radius)
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mb-3">
                    {type.description}
                  </p>
                  <div className="flex items-center justify-between">
                    {type.price && (
                      <span className="text-sm font-semibold text-gray-900">{type.price}</span>
                    )}
                    <span className={`${type.price ? '' : 'ml-auto'} ${
                      type.isService ? 'text-yellow-600' : 'text-[#2C8B80]'
                    } group-hover:translate-x-1 transition-transform duration-200`}>
                      {type.isService ? 'Book Now →' : 'Select →'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center p-6 bg-[#FAF5ED] rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Not sure which type you need?
          </h3>
          <p className="text-gray-600 mb-4">
            Check our measurement guide or contact us for assistance
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/instructions" 
              className="text-[#2C8B80] hover:text-[#1F6259] font-medium underline"
            >
              Measurement Guide
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              href="/contact" 
              className="text-[#2C8B80] hover:text-[#1F6259] font-medium underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}