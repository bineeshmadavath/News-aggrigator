import type { FeedItem } from "../lib/feed";
import { BiasSpectrum } from "./BiasSpectrum";
import { BlindspotAlert } from "./BlindspotAlert";
import { CountryFlag } from "./CountryFlag";

interface ClusterCardProps {
  item: FeedItem;
  selectedId: string | null;
  onSelect: (articleId: string) => void;
}

export function ClusterCard({ item, selectedId, onSelect }: ClusterCardProps) {
  const { cluster, articles, missingLeans } = item;
  const showBlindspot = articles.length >= 2 && missingLeans.length > 0;

  return (
    <article className="border-t-4 border-deep bg-white px-5 pb-5 pt-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal">{cluster.region}</span>
        <span className="text-xs text-navy/60">
          {articles.length} {articles.length === 1 ? "source" : "sources"} in view
        </span>
      </div>
      <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-navy">{cluster.title}</h2>
      <p className="mt-2 font-serif text-base leading-relaxed text-navy/80">{cluster.summary}</p>

      <div className="mt-4 space-y-4">
        {showBlindspot && <BlindspotAlert missing={missingLeans} />}

        <ul className="divide-y divide-ice border-t border-ice">
          {articles.map((article) => {
            const active = article.id === selectedId;
            const isMajor = article.publisher.tier === "major";
            return (
              <li key={article.id} className={`py-3 ${active ? "-mx-2 bg-ice/60 px-2" : ""}`}>
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => onSelect(article.id)}
                    aria-pressed={active}
                    className="flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
                  >
                    <span className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
                      <CountryFlag publisher={article.publisher} />
                      <span className="text-deep">{article.publisher.name}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] ${
                          isMajor ? "bg-deep text-ice" : "bg-ice text-deep"
                        }`}
                      >
                        {isMajor ? "Major" : "Regional"}
                      </span>
                      <span className="font-normal normal-case text-navy/50">{article.publishedAt}</span>
                    </span>
                    <span className="mt-1 block font-serif text-lg font-semibold leading-snug text-navy">
                      {article.headline}
                    </span>
                    <span className="mt-2 block">
                      <BiasSpectrum score={article.leanScore} compact />
                    </span>
                    <span className="mt-2 block text-[11px] font-medium text-teal">
                      {article.claims.length} claims extracted for review
                    </span>
                  </button>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 pt-1 text-xs font-medium text-teal underline-offset-2 hover:underline"
                  >
                    Source ↗
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
