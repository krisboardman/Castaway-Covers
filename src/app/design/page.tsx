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
              <div className="bg-white rounded-xl overflow-hidden border-2 border-gray-100 hover:border-[#2C8B80] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl h-full">
                <div className="relative h-48 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center overflow-hidden">
                  <img 
                    src={type.image}
                    alt={type.name}
                    className="max-w-full max-h-full object-contain p-6 transition-all duration-500 group-hover:scale-110 group-hover:opacity-80"
                  />
                  {/* Hover overlay with teal tint */}
                  <div className="absolute inset-0 bg-[#2C8B80] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-5 border-t border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#2C8B80] transition-colors mb-2">
                    {type.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {type.description}
                  </p>
                  <div className="flex items-center justify-end">
                    <span className="text-[#2C8B80] group-hover:translate-x-1 transition-transform duration-200">
                      Select →
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