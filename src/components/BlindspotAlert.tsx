import type { LeanBucket } from "../types";

interface BlindspotAlertProps {
  missing: LeanBucket[];
}

export function BlindspotAlert({ missing }: BlindspotAlertProps) {
  if (missing.length === 0) return null;

  return (
    <div role="alert" className="flex gap-3 rounded-lg border border-amber/40 bg-amber/10 p-3">
      <span aria-hidden="true" className="mt-0.5 text-sm text-amber">
        ⚠
      </span>
      <div className="text-xs leading-relaxed">
        <p className="font-semibold text-navy">Coverage blindspot detected</p>
        <p className="text-navy/80">
          Outlets on the {missing.join(" and ")} have not covered this story in the current view.
          Read across the spectrum before drawing conclusions.
        </p>
      </div>
    </div>
  );
}
