import Link from "next/link";

export default function DesignPage() {
  const furnitureTypes = [
    {
      name: "Chairs / Recliners",
      href: "/products/chairs-recliners",
      image: "/images/Chairs-Recliners/sketchchair.png"
    },
    {
      name: "Sofas / Loveseats",
      href: "/products/sofas-loveseats",
      image: "/images/Sofas-Loveseats/Sofa-New-1.jpg"
    },
    {
      name: "Chaise Lounges",
      href: "/products/chaise-lounge",
      image: "/images/ChaiseLounges/CC-chaise.png"
    },
    {
      name: "Tables",
      href: "/products/tables",
      image: "/images/Tables/sketchtableset.png"
    },
    {
      name: "Table Sets",
      href: "/products/table-sets",
      image: "/images/Tablesets/CC-table-set.png"
    },
    {
      name: "Ottomans",
      href: "/products/ottomans",
      image: "/images/Ottomans/ottoman.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-medium text-gray-800 text-center mb-12">
          Choose Furniture Type
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {furnitureTypes.map((type) => (
            <Link 
              key={type.name}
              href={type.href}
              className="group block"
            >
              <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div className="bg-gray-100 h-64 flex items-center justify-center">
                  <img 
                    src={type.image}
                    alt={type.name}
                    className="max-w-full max-h-full object-contain p-8"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    {type.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}