'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium Quality Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every Castaway Cover is meticulously crafted with superior materials and innovative features to protect your outdoor furniture for years to come.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="space-y-16">

          {/* Feature 1: Reinforced Snap Strap System */}
          <FeatureSection
            imagePath="/images/features/snap-straps.jpg"
            title="Reinforced Snap Strap System"
            description="Our premium snap straps feature industrial-grade snaps with reinforced backing plates for exceptional durability. Each snap is carefully positioned to ensure a tight, secure fit that keeps your cover in place even during harsh weather conditions."
            benefits={[
              "Heavy-duty marine-grade snaps resist corrosion",
              "Double-reinforced backing prevents tearing",
              "Strategic placement for optimal tension distribution",
              "Easy to use - even with gloves in cold weather"
            ]}
            imagePosition="left"
          />

          {/* Feature 2: Signature Scalloped Edge Design */}
          <FeatureSection
            imagePath="/images/features/scalloped-edge.jpg"
            title="Signature Scalloped Edge Design"
            description="Our distinctive scalloped edges aren't just beautiful - they're functional. This premium design detail prevents water pooling and adds an elegant finishing touch that sets Castaway Covers apart from standard rectangular covers."
            benefits={[
              "Prevents water accumulation at edges",
              "Professional, custom-tailored appearance",
              "Reinforced edge stitching for longevity",
              "Complements any outdoor decor style"
            ]}
            imagePosition="right"
          />

          {/* Feature 3: Adjustable Bungee Cord System */}
          <FeatureSection
            imagePath="/images/features/bungee-system.jpg"
            title="Adjustable Bungee Cord System"
            description="Our premium bungee cord system with brass grommets provides a customizable, secure fit for any furniture shape. The elasticity allows for easy installation while maintaining constant tension to keep your cover snug and protected."
            benefits={[
              "Brass grommets won't rust or corrode",
              "Adjustable cord length for perfect fit",
              "High-grade elastic maintains tension over time",
              "Quick and easy installation process"
            ]}
            imagePosition="left"
          />

          {/* Feature 4: Full-Length Heavy-Duty Zipper */}
          <FeatureSection
            imagePath="/images/features/zipper.jpg"
            title="Full-Length Heavy-Duty Zipper"
            description="Access your furniture without removing the entire cover. Our YKK-quality zippers are built to withstand thousands of open-close cycles while maintaining a weather-tight seal that protects against rain, dust, and debris."
            benefits={[
              "Weather-resistant zipper construction",
              "Extra-wide zipper pull for easy operation",
              "Storm flap covers zipper for added protection",
              "Smooth operation in all temperatures"
            ]}
            imagePosition="right"
          />

          {/* Feature 5: Premium Marine-Grade Vinyl */}
          <FeatureSection
            imagePath="/images/features/flexible-material.jpg"
            title="Premium Marine-Grade Vinyl"
            description="Our covers are crafted from the same high-quality vinyl used in marine applications. This material offers the perfect balance of flexibility for easy handling and durability to resist tears, punctures, and UV damage year after year."
            benefits={[
              "UV-resistant coating prevents fading and cracking",
              "Flexible enough to drape smoothly over curves",
              "Tear-resistant construction withstands impact",
              "Maintains suppleness in extreme temperatures"
            ]}
            imagePosition="left"
          />

          {/* Feature 6: Reinforced Brass Grommets */}
          <FeatureSection
            imagePath="/images/features/brass-grommet.jpg"
            title="Reinforced Brass Grommets"
            description="Every grommet in our covers features a substantial brass backing washer that distributes stress evenly across the vinyl. This prevents tearing and ensures your tie-down points remain secure season after season."
            benefits={[
              "Solid brass construction resists corrosion",
              "Large diameter backing prevents pull-through",
              "Strategically placed for optimal coverage",
              "Compatible with various tie-down methods"
            ]}
            imagePosition="right"
          />

          {/* Feature 7: Breathable Mesh Ventilation */}
          <FeatureSection
            imagePath="/images/features/mesh-vent.jpg"
            title="Breathable Mesh Ventilation Panels"
            description="Prevent moisture buildup and mildew with our integrated mesh ventilation system. These strategically placed panels allow air to circulate while keeping rain, snow, and debris out - ensuring your furniture stays fresh and dry underneath."
            benefits={[
              "Reduces condensation and prevents mildew",
              "Mesh openings sized to block debris while allowing airflow",
              "Reinforced edges prevent fraying",
              "Maintains cover integrity in high winds"
            ]}
            imagePosition="left"
          />

          {/* Feature 8: Water-Resistant Interior Liner */}
          <FeatureSection
            imagePath="/images/features/interior-liner.jpg"
            title="Water-Resistant Interior Liner"
            description="The interior of every Castaway Cover features a special mesh liner that provides an additional barrier against moisture while preventing the cover from sticking to your furniture. This dual-layer protection ensures long-lasting performance."
            benefits={[
              "Prevents moisture penetration from condensation",
              "Smooth surface won't damage furniture finishes",
              "Lightweight mesh adds minimal bulk",
              "Easy to clean and maintain"
            ]}
            imagePosition="right"
          />

        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-gradient-to-r from-brand-teal to-teal-600 rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Protect Your Investment?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience the Castaway difference. Custom-fit covers made with premium materials and backed by our satisfaction guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/design"
              className="inline-block bg-white text-brand-teal px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Design Your Custom Cover
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Back to Products */}
        <div className="mt-12 text-center">
          <Link
            href="/design"
            className="inline-flex items-center text-gray-600 hover:text-brand-teal transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Product Selection
          </Link>
        </div>
      </div>
    </div>
  );
}

// Feature Section Component
interface FeatureSectionProps {
  imagePath: string;
  title: string;
  description: string;
  benefits: string[];
  imagePosition: 'left' | 'right';
}

function FeatureSection({ imagePath, title, description, benefits, imagePosition }: FeatureSectionProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${imagePosition === 'right' ? 'lg:grid-flow-dense' : ''}`}>
      {/* Image */}
      <div className={`relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl ${imagePosition === 'right' ? 'lg:col-start-2' : ''}`}>
        <Image
          src={imagePath}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className={imagePosition === 'right' ? 'lg:col-start-1 lg:row-start-1' : ''}>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-6 h-6 text-brand-teal mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
