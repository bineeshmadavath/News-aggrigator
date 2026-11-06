import type { Article, Claim } from "../types";
import { BiasSpectrum } from "./BiasSpectrum";
import { ClaimTooltip } from "./ClaimTooltip";
import { VerdictChip } from "./VerdictChip";
import { CountryFlag } from "./CountryFlag";

interface ReasoningPanelProps {
  article: Article | null;
  clusterTitle?: string;
}

export function ReasoningPanel({ article, clusterTitle }: ReasoningPanelProps) {
  if (!article) {
    return (
      <section
        aria-label="AI reasoning panel"
        className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-cyan bg-white p-6 text-center text-sm text-navy/60"
      >
        Select a source to inspect its AI-extracted claims.
      </section>
    );
  }

  return (
    <section
      aria-label="AI reasoning panel"
      className="flex flex-col rounded-xl border border-deep/20 bg-navy text-mist shadow-xl"
    >
      <header className="space-y-3 border-b border-deep p-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-aqua">AI Reasoning Panel</p>
          <span className="rounded-full bg-teal/30 px-2 py-0.5 text-[11px] text-ice">
            {article.claims.length} claims
          </span>
        </div>

        <div>
          <p className="flex items-center gap-2 text-xs text-ice/70">
            <CountryFlag publisher={article.publisher} />
            {article.publisher.name}
            {clusterTitle ? ` · ${clusterTitle}` : ""}
          </p>
          <h3 className="mt-1 font-serif text-lg font-semibold leading-snug">{article.headline}</h3>
        </div>

        <BiasSpectrum score={article.leanScore} />

        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-xs font-medium text-aqua underline-offset-2 hover:underline"
        >
          Open original article ↗
        </a>
      </header>

      <div className="space-y-3 p-5">
        <p className="text-[11px] uppercase tracking-wider text-ice/60">
          Extracted claims · hover or focus for evidence
        </p>
        <ul className="space-y-3">
          {article.claims.map((claim) => (
            <ClaimRow key={claim.id} claim={claim} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ClaimRow({ claim }: { claim: Claim }) {
  return (
    <li className="rounded-lg border border-deep bg-deep/50 p-3">
      <ClaimTooltip claim={claim}>
        <span className="text-sm leading-relaxed text-mist">{claim.text}</span>
      </ClaimTooltip>
      <div className="mt-2 flex items-center gap-2 text-[11px]">
        <VerdictChip claim={claim} />
        <span className="text-ice/70">Confidence {Math.round(claim.confidence * 100)}%</span>
      </div>
    </li>
  );
}
