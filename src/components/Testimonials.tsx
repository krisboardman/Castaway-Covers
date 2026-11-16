// Customer testimonials for the homepage. Each one is labeled with the customer's town,
// which also reinforces our local service area.
const TESTIMONIALS = [
  {
    quote:
      'The cover is great! Thanks for being creative to find a solution that worked for our set up. We will gladly recommend you in the future to others.',
    town: 'Sea Girt, NJ',
  },
  {
    quote: 'It looks great.',
    town: 'Rumson, NJ',
  },
];

export default function Testimonials() {
  return (
    <section className="py-8 px-4 bg-[#FAF5ED]/40">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
          What Our Neighbors Are Saying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t) => (
            <figure key={t.town} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
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
