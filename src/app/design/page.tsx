import Link from "next/link";

export default function DesignPage() {
  const furnitureTypes = [
    {
      name: "Chairs / Recliners",
      href: "/products/chairs-recliners",
      image: "https://castawaycovers.com/wp-content/uploads/2025/05/chair4.png"
    },
    {
      name: "Sofas / Loveseats",
      href: "/products/sofas-loveseats",
      image: "https://castawaycovers.com/wp-content/uploads/2025/05/Sofa-New-1.jpg"
    },
    {
      name: "Chaise Lounges",
      href: "/products/chaise-lounge",
      image: "https://castawaycovers.com/wp-content/uploads/2025/05/CC-chaise-1024x619.png"
    },
    {
      name: "Tables",
      href: "/products/tables",
      image: "https://castawaycovers.com/wp-content/uploads/2025/05/CC-table-1.png"
    },
    {
      name: "Table Sets",
      href: "/products/table-sets",
      image: "https://castawaycovers.com/wp-content/uploads/2025/05/CC-table-set-1024x606.png"
    },
    {
      name: "Ottomans",
      href: "/products/ottomans",
      image: "https://castawaycovers.com/wp-content/uploads/2025/05/ottoman.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-medium text-gray-800 text-center mb-12">
          Choose Furniture Type
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {furnitureTypes.map((type) => (
            <Link 
              key={type.name}
              href={type.href}
              className="group block"
            >
              <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-10 bg-gray-100">
                  <img 
                    src={type.image}
                    alt={type.name}
                    className="w-full h-full object-contain p-8"
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