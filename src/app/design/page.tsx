import Image from "next/image";
import Link from "next/link";

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Select Your Furniture Type
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link 
            href="/products/chairs-recliners" 
            className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg text-center transition-colors"
          >
            <div className="text-xl font-medium">Chairs / Recliners</div>
          </Link>
          
          <Link 
            href="/products/sofas-loveseats" 
            className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg text-center transition-colors"
          >
            <div className="text-xl font-medium">Sofas / Loveseats</div>
          </Link>
          
          <Link 
            href="/products/chaise-lounge" 
            className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg text-center transition-colors"
          >
            <div className="text-xl font-medium">Chaise Lounge</div>
          </Link>
          
          <Link 
            href="/products/ottomans" 
            className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg text-center transition-colors"
          >
            <div className="text-xl font-medium">Ottomans</div>
          </Link>
          
          <Link 
            href="/products/tables" 
            className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg text-center transition-colors"
          >
            <div className="text-xl font-medium">Tables</div>
          </Link>
          
          <Link 
            href="/products/table-sets" 
            className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg text-center transition-colors"
          >
            <div className="text-xl font-medium">Table Sets</div>
          </Link>
        </div>
      </div>
    </div>
  );
}