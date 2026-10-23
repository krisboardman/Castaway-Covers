// "Full service, start to finish" — the four services every custom cover
// includes. Shown on the homepage right under the hero.
// Copy adapts automatically when MEASUREMENT_PROMO_ACTIVE is toggled off.
import { MEASUREMENT_PROMO_ACTIVE } from '@/config/site';

const STEPS = [
  {
    title: MEASUREMENT_PROMO_ACTIVE ? 'Free On-Site Measuring' : 'On-Site Measuring',
    text: 'We come to you and measure every piece, so you never have to guess.',
    icon: 'M3 17l6-6 4 4 8-8M14 7h7v7',
  },
  {
    title: 'Custom Design',
    text: 'Each cover is designed around your furniture, down to the snaps and bungees.',
    icon: 'M15.232 5.232l3.536 3.536M9 13l6.232-6.232a2.5 2.5 0 113.536 3.536L12.536 16.536 9 17l.464-3.536z',
  },
  {
    title: 'Cover Build',
    text: 'We cut and sew your covers from marine-grade, waterproof vinyl.',
    icon: 'M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z',
  },
  {
    title: 'Installation & Adjustments',
    text: 'We install every cover and make any adjustments needed until it fits just right.',
    icon: 'M5 13l4 4L19 7',
  },
];

export default function ServiceSteps() {
  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Full Service, Start to Finish
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every custom cover includes all four steps. You don&apos;t lift a finger.
          </p>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border border-gray-200 rounded-lg p-5 bg-[#FAF5ED]/40">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-brand-teal">Step {i + 1}</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
