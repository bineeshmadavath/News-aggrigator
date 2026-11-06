import type { Verdict } from "../types";

export const VERDICT_STYLE: Record<Verdict, { label: string; className: string }> = {
  supported: { label: "Supported", className: "bg-teal text-white" },
  "partially-supported": { label: "Partially supported", className: "bg-aqua text-deep" },
  disputed: { label: "Disputed", className: "bg-coral text-white" },
  unverified: { label: "Unverified", className: "bg-amber text-white" },
};
