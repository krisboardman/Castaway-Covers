import Image from "next/image";
import Link from "next/link";
import { generateMetadata as generateMeta } from "@/lib/metadata";
import { getOrganizationSchema } from "@/lib/structured-data";
import HeroCarousel from "@/components/HeroCarousel";
import StormVideo from "@/components/StormVideo";
import CastawayVideo from "@/components/CastawayVideo";
import ColorShowcase from "@/components/ColorShowcase";

export const metadata = generateMeta('home');

export default function Home() {
  const organizationSchema = getOrganizationSchema();
  
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Local Service Banner */}
      <div className="bg-[#2C8B80] text-white py-2 px-4 text-center">
        <p className="text-sm md:text-base">
          📍 <span className="font-semibold">Within Monmouth County?</span> We offer professional in-home measurement service. 
          <Link href="/measurement-service" className="underline ml-2 hover:text-yellow-200">Learn More</Link>
        </p>
      </div>

      {/* Hero Section with 3-Panel Story */}
      <section className="relative pt-4 pb-3 px-4 bg-gradient-to-b from-white to-[#FAF5ED]/30">
        <div className="max-w-7xl mx-auto">
          {/* Hero Text */}
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
              Premium Outdoor Furniture Protection
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Custom-fit covers that slip on in seconds and withstand any weather.
            </p>
          </div>

          {/* Hero Carousel - Auto-playing image slideshow */}
          <HeroCarousel />

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

      {/* Product Gallery Section */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Custom Covers for Every Piece
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From lounge chairs to dining sets, we create perfectly fitted covers for all your outdoor furniture.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <Image
                src="/images/gallery/Gallery1.webp"
                alt="Lounge Chair Cover"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <Image
                src="/images/gallery/Gallery2.webp"
                alt="Outdoor Table Cover"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <Image
                src="/images/gallery/Gallery3.webp"
                alt="Table Cover"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <Image
                src="/images/gallery/Gallery4.webp"
                alt="Chaise Lounge Cover"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <Image
                src="/images/gallery/Gallery5.webp"
                alt="Dining Set Cover"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <Image
                src="/images/gallery/Gallery6.webp"
                alt="Loveseat Cover"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different Section */}
      <section className="pt-6 pb-8 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              These Covers are Totally Different
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've obsessed over every detail to create covers you'll actually want to use.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Castaway Video */}
            <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm">
              <div className="aspect-[4/3] relative overflow-hidden">
                <CastawayVideo />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">See Them in Action</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Watch how our covers protect your outdoor furniture</p>
              </div>
            </div>

            {/* Quality Hardware */}
            <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src="/images/homepage-features/feature2.webp"
                  alt="Quality Hardware"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Premium Hardware Built to Last</h3>
                <p className="text-sm text-gray-600 leading-relaxed">We don't cut corners on components. Every cover features heavy-duty snaps, reinforced grommets, and durable bungee cords designed to withstand years of daily use and harsh weather.</p>
              </div>
            </div>

            {/* Waterproof & Protected */}
            <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src="/images/homepage-features/feature3.webp"
                  alt="Waterproof & Protected"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover object-[75%_center] group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Waterproof & UV Protected</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Marine vinyl resists rain, sun, and mildew. Keeps furniture dry and fresh season after season.</p>
              </div>
            </div>

            {/* Weather Proof */}
            <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src="/images/homepage-features/feature4.webp"
                  alt="Weather Proof"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Storm-Secure Bungees</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Built-in bungees stay attached and tuck away when not needed. Deploy them for high winds—your cover stays put.</p>
              </div>
            </div>

            {/* Storm Video - temporarily hidden, swap in new video later
            <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm">
              <div className="aspect-[4/3] relative overflow-hidden">
                <StormVideo />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Tested in Real Storms</h3>
                <p className="text-sm text-gray-600 leading-relaxed">See how our covers work in a Nor'Easter</p>
              </div>
            </div>
            */}
          </div>
        </div>
      </section>

    </div>
  );
}