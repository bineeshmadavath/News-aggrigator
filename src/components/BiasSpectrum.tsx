import { LEAN_LABEL, toLeanBucket } from "../lib/feed";

const LEAN_STYLE = {
  left: "bg-teal text-white",
  center: "bg-ice text-deep ring-1 ring-cyan",
  right: "bg-navy text-mist",
} as const;

interface BiasSpectrumProps {
  /** -1 (far left) to +1 (far right) */
  score: number;
  compact?: boolean;
}

export function BiasSpectrum({ score, compact = false }: BiasSpectrumProps) {
  const bucket = toLeanBucket(score);
  const position = ((score + 1) / 2) * 100;

  return (
    <span
      className={`inline-flex items-center gap-2 ${compact ? "" : "w-full"}`}
      aria-label={`Political lean: ${LEAN_LABEL[bucket]}, score ${score.toFixed(2)}`}
    >
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${LEAN_STYLE[bucket]}`}>
        {LEAN_LABEL[bucket]}
      </span>
      <span
        className={`relative inline-block rounded-full bg-gradient-to-r from-cyan via-ice to-deep ${
          compact ? "h-1.5 w-24" : "h-2 w-full"
        }`}
      >
        <span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-navy shadow"
          style={{ left: `${position}%` }}
        />
      </span>
    </span>
  );
}
