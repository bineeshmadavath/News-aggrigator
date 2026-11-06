import { useId, useState, type ReactNode } from "react";
import type { Claim } from "../types";
import { VERDICT_STYLE } from "../lib/verdicts";

const STANCE = {
  corroborates: { glyph: "✓", className: "text-teal", text: "Corroborates" },
  contradicts: { glyph: "✕", className: "text-coral", text: "Contradicts" },
  context: { glyph: "◐", className: "text-navy/60", text: "Context" },
} as const;

interface ClaimTooltipProps {
  claim: Claim;
  children: ReactNode;
}

/** Hover or keyboard-focus popover exposing confidence and source verification. */
export function ClaimTooltip({ claim, children }: ClaimTooltipProps) {
  const [open, setOpen] = useState(false);
  const tipId = useId();
  const pct = Math.round(claim.confidence * 100);
  const verdict = VERDICT_STYLE[claim.verdict];

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  return (
    <span className="relative inline" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-describedby={open ? tipId : undefined}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(e) => {
          if (e.key === "Escape") hide();
        }}
        className="cursor-help rounded-sm text-left underline decoration-aqua decoration-dotted underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
      >
        {children}
      </button>

      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="absolute left-0 top-full z-50 mt-2 block w-72 rounded-lg border border-ice bg-white p-4 text-navy shadow-2xl"
        >
          <span className="flex items-center justify-between">
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${verdict.className}`}>
              {verdict.label}
            </span>
            <span className="text-xs font-semibold text-deep">{pct}% confidence</span>
          </span>

          <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-ice">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-teal to-cyan"
              style={{ width: `${pct}%` }}
            />
          </span>

          <span className="mt-3 block text-xs leading-relaxed text-navy/80">{claim.rationale}</span>

          <span className="mt-3 block text-[11px] font-semibold uppercase tracking-wider text-teal">
            Source verification
          </span>
          <span className="mt-1 block space-y-1.5">
            {claim.sources.map((source) => {
              const stance = STANCE[source.stance];
              return (
                <span key={`${source.outlet}-${source.reference}`} className="flex items-start gap-2 text-xs">
                  <span className={`font-bold ${stance.className}`}>{stance.glyph}</span>
                  <span>
                    <span className="font-medium">{source.outlet}</span>
                    <span className="text-navy/60"> · {stance.text}</span>
                    <span className="block text-navy/60">{source.reference}</span>
                  </span>
                </span>
              );
            })}
          </span>
        </span>
      )}
    </span>
  );
}
