import Link from "next/link";
import Image from "next/image";
import { generateMetadata as generateMeta } from "@/lib/metadata";

export const metadata = generateMeta('design');

export default function DesignPage() {
  const furnitureTypes = [
    {
      name: "Chairs / Recliners",
      href: "/products/chairs-recliners",
      image: "/images/sketch-icons/sketchchair.png",
      description: "Armchairs, club chairs, and recliners",
      popular: true
    },
    {
      name: "Sofas / Loveseats",
      href: "/products/sofas-loveseats",
      image: "/images/sketch-icons/sketchsofa.png",
      description: "Any length, optional magnetic closures for easy use"
    },
    {
      name: "Chaise Lounges",
      href: "/products/chaise-lounge",
      image: "/images/sketch-icons/sketchchaise.png",
      description: "Pool and patio loungers"
    },
    {
      name: "Tables",
      href: "/products/tables",
      image: "/images/sketch-icons/sketchtable.png",
      description: "Dining and coffee tables"
    },
    {
      name: "Table Sets",
      href: "/products/table-sets",
      image: "/images/sketch-icons/sketchtableset.png",
      description: "Complete dining sets with chairs or benches"
    },
    {
      name: "Ottomans",
      href: "/products/ottomans",
      image: "/images/sketch-icons/sketchottoman.png",
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
                  <Image
                    src={type.image}
                    alt={type.name}
                    width={200}
                    height={200}
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

        {/* Professional Measurement Service Banner */}
        <div className="mt-8 mb-8">
          <Link href="/measurement-service" className="block">
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="text-5xl mr-6">📏</div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">Professional Measurement Service</h3>
                      <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Local Service
                      </span>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Within Monmouth County</span> •
                      We'll measure your furniture and create your perfect custom order
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-end">
                  <span className="text-2xl font-bold text-gray-900 mb-2">$75</span>
                  <span className="bg-yellow-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-yellow-700 transition-colors inline-flex items-center">
                    Book Now 
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center p-6 bg-[#FAF5ED] rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Not sure which type you need?
          </h3>
          <p className="text-gray-600 mb-4">
            See our measurement guides on the product pages or contact us for assistance
          </p>
          <div className="flex gap-4 justify-center">
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