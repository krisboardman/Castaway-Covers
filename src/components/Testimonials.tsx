// Customer testimonials for the homepage. Each one is labeled with the customer's town,
// which also reinforces our local service area.
import Image from 'next/image';

const TESTIMONIALS = [
  {
    quote:
      'The cover is great! Thanks for being creative to find a solution that worked for our set up. We will gladly recommend you in the future to others.',
    town: 'Sea Girt, NJ',
  },
  {
    quote: 'It looks great and fits perfectly.',
    town: 'Rumson, NJ',
  },
  {
    quote: 'So glad I have the covers, that storm ripped through here! We love them!',
    town: 'Brielle, NJ',
  },
];

const STORM_TESTIMONIAL = {
  quote: 'Your covers stand up to the storm.',
  town: 'Red Bank, NJ',
  image: '/images/testimonials/red-bank-storm.jpg',
  alt: 'Castaway Cover still in place on a Red Bank deck after a storm, with leaves and branches scattered around it',
};

export default function Testimonials() {
  return (
    <section className="py-8 px-4 bg-[#FAF5ED]/40">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
          What Our Neighbors Are Saying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Storm photo card: sits on the right and spans both text cards on desktop */}
          <figure className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden md:col-start-2 md:row-start-1 md:row-span-3">
            <div className="relative aspect-[4/5]">
              <Image
                src={STORM_TESTIMONIAL.image}
                alt={STORM_TESTIMONIAL.alt}
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <blockquote className="text-gray-700 text-lg leading-relaxed">
                &ldquo;{STORM_TESTIMONIAL.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-brand-teal">
                Castaway Covers customer, {STORM_TESTIMONIAL.town}
              </figcaption>
            </div>
          </figure>

          {TESTIMONIALS.map((t) => (
            <figure key={t.quote} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-center md:col-start-1">
              <blockquote className="text-gray-700 text-lg leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-brand-teal">
                Castaway Covers customer, {t.town}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
