// Temporary promotional sticker for the in-home measurement service.
// The $75 fee logic is intentionally left intact across the site — this badge
// just advertises that the fee is currently waived. To end the promotion,
// remove the <MeasurementPromoBadge /> usages (and any line-through on "$75").
export default function MeasurementPromoBadge({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-green-100 border border-green-400 text-green-800 px-4 py-1.5 text-sm font-semibold shadow-sm ${className}`}
    >
      <span aria-hidden className="text-base leading-none">🎉</span>
      <span>
        Promotion: <span className="font-bold">FREE</span> in-home measurements &amp; estimates — Rumson, Fair Haven &amp; local area
      </span>
    </div>
  );
}
