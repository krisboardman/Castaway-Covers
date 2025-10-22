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
            Craftsmanship Details
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every Castaway Cover is meticulously crafted with superior materials and innovative features to protect your outdoor furniture for years to come.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="space-y-16">

          {/* Feature 1: Distinctive Wavy Edge Design */}
          <FeatureSection
            imagePath="/images/features/wavy-edge.jpg"
            title="Distinctive Wavy Edge Design"
            description="Our wavy edges aren't just decorative - they're our signature. This premium design detail gives every Castaway Cover a polished, finished appearance that transforms functional protection into an attractive outdoor accent."
            benefits={[
              "Signature wavy edge design for elegant appearance",
              "Premium look distinguishes from basic rectangular covers",
              "Polished finish complements any outdoor decor",
              "Transforms protection into an attractive feature"
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

          {/* Feature 4: Built-In Bungee Cord Organization */}
          <FeatureSection
            imagePath="/images/features/zipper.jpg"
            title="Built-In Bungee Cord Organization"
            description="Smart design means easy maintenance. Our bungee cords stay attached to the cover and hang discreetly at the back when not in use. Set the length once for your furniture, then it's simply hook for secure coverage and unhook to remove - the cord length stays set, so there's no readjusting each time you use it."
            benefits={[
              "Bungee cords hang neatly at back when cover is removed",
              "Set the length once - no readjusting needed after initial setup",
              "Simple hook-and-unhook for quick on-and-off",
              "Cords stay attached - no separate storage required"
            ]}
            imagePosition="right"
          />

          {/* Feature 5: Tailored Corner Construction */}
          <FeatureSection
            imagePath="/images/features/flexible-material.jpg"
            title="Tailored Corner Construction"
            description="Our innovative corner design allows the cover to drape smoothly and fit snugly over your furniture without bunching or gaps. Each corner features a carefully hemmed cutout with a waterproof inner liner that folds discreetly inside, creating a clean appearance while keeping water out where it matters most."
            benefits={[
              "Carefully hemmed corner cutouts for durability and clean finish",
              "Corners contour perfectly to furniture shape for smooth fit",
              "Waterproof inner liner folds discreetly within hemmed cutouts",
              "Eliminates bunching and gaps for tailored appearance"
            ]}
            imagePosition="left"
          />

          {/* Feature 6: Double-Reinforced Brass Grommets */}
          <FeatureSection
            imagePath="/images/features/brass-grommet.jpg"
            title="Double-Reinforced Brass Grommets"
            description="Strong tie-down points start with smart construction. Each brass grommet is installed through a double layer of vinyl, providing reinforced strength at these critical stress points. This thoughtful design prevents pull-through and tearing, keeping your cover secure in all weather conditions."
            benefits={[
              "Brass grommets resist corrosion and weathering",
              "Extra vinyl layer at each grommet adds reinforcement",
              "Double-layer construction prevents tearing at stress points",
              "Secure tie-down points that last season after season"
            ]}
            imagePosition="right"
          />

          {/* Feature 7: Marine-Grade Interior Protection */}
          <FeatureSection
            imagePath="/images/features/interior-liner.jpg"
            title="Marine-Grade Interior Protection"
            description="Our covers use the same mildew-resistant polyester on the interior that's trusted for boat cushions and marine upholstery. Inner edges are sealed with protective treatment for extra weather defense. The interior has a practical, unfinished appearance - but that's intentional. This marine-grade material delivers superior protection without adding unnecessary bulk or cost."
            benefits={[
              "Inner edges sealed with protective weather treatment",
              "Marine-grade mildew-resistant and antifungal polyester",
              "Practical interior designed for function and durability",
              "Lightweight and safe for furniture surfaces"
            ]}
            imagePosition="left"
          />

          {/* Feature 8: Optional Snap Closure for Sofas */}
          <FeatureSection
            imagePath="/images/features/snap-straps.jpg"
            title="Optional Snap Closure for Sofas"
            description="Why struggle with one massive cover? Our snap closure option splits sofa covers into two practical pieces that connect securely with heavy-duty marine snaps. Access one section of your sofa without disturbing the rest, or remove just half for easier washing and storage."
            benefits={[
              "Corrosion-resistant marine-grade snap hardware",
              "Two-piece design eliminates wrestling with large covers",
              "Flexible access - uncover what you need, when you need it",
              "Maintains weather-tight protection when snapped together"
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
