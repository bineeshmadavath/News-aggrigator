import { useId, useState } from "react";
import type { Claim } from "../types";
import { VERDICT_STYLE } from "../lib/verdicts";

interface VerdictChipProps {
  claim: Claim;
}

/** Verdict label that explains, on hover or focus, the metric and rule behind the verdict. */
export function VerdictChip({ claim }: VerdictChipProps) {
  const [open, setOpen] = useState(false);
  const tipId = useId();
  const verdict = VERDICT_STYLE[claim.verdict];
  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  return (
    <span className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      <span
        tabIndex={0}
        aria-describedby={open ? tipId : undefined}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(e) => {
          if (e.key === "Escape") hide();
        }}
        className={`cursor-help rounded px-1.5 py-0.5 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua ${verdict.className}`}
      >
        {verdict.label}
      </span>
      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="absolute left-0 top-full z-50 mt-2 block w-72 rounded-lg border border-ice bg-white p-4 text-left text-xs font-normal normal-case tracking-normal text-navy shadow-2xl"
        >
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-teal">Why this verdict</span>
          <span className="mt-2 block text-[11px] font-semibold text-navy/60">{claim.basis.metric}</span>
          <span className="block text-xs leading-relaxed text-navy">{claim.basis.value}</span>
          <span className="mt-3 block text-[11px] font-semibold text-navy/60">Rule applied</span>
          <span className="block text-xs leading-relaxed text-navy">{claim.basis.rule}</span>
          <span className="mt-3 block text-[11px] text-navy/60">
            Model confidence: <strong className="text-deep">{Math.round(claim.confidence * 100)}%</strong>
          </span>
        </span>
      )}
    </span>
  );
}
