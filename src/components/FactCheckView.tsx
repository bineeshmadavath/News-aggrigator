import { formatShort } from "../lib/dates";
import type { FactCheckFilters, FactCheckRecord } from "../lib/factcheck";
import { VERDICT_STYLE } from "../lib/verdicts";
import type { Region, Verdict } from "../types";
import { CountryFlag } from "./CountryFlag";
import { VerdictChip } from "./VerdictChip";

interface FactCheckViewProps {
  region: Region;
  filters: FactCheckFilters;
  onFiltersChange: (filters: FactCheckFilters) => void;
  publishers: string[];
  results: FactCheckRecord[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
}

const VERDICTS = Object.keys(VERDICT_STYLE) as Verdict[];
const isFiltered = (f: FactCheckFilters) => f.text !== "" || f.publisher !== "all" || f.verdict !== "all";
const selectClass =
  "rounded-md border border-cyan bg-white px-3 py-2 text-sm text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua";

export function FactCheckView({
  region,
  filters,
  onFiltersChange,
  publishers,
  results,
  selectedKey,
  onSelect,
}: FactCheckViewProps) {
  const update = (patch: Partial<FactCheckFilters>) => onFiltersChange({ ...filters, ...patch });

  return (
    <section aria-label="Fact-check search" className="min-w-0 space-y-4">
      <div className="border-b border-ice pb-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal">Fact-check search</p>
        <h2 className="font-serif text-2xl font-bold text-navy">Search claims and verdicts</h2>
      </div>

      <div className="grid gap-3 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_200px_180px]">
        <label className="flex flex-col text-xs">
          <span className="mb-1 font-semibold text-navy">Search</span>
          <input
            type="search"
            value={filters.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="A politician, a statement, or a topic"
            className="rounded-md border border-cyan bg-white px-3 py-2 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
          />
        </label>

        <label className="flex flex-col text-xs">
          <span className="mb-1 font-semibold text-navy">Publisher</span>
          <select value={filters.publisher} onChange={(e) => update({ publisher: e.target.value })} className={selectClass}>
            <option value="all">All publishers</option>
            {publishers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-xs">
          <span className="mb-1 font-semibold text-navy">Verdict</span>
          <select
            value={filters.verdict}
            onChange={(e) => update({ verdict: e.target.value as Verdict | "all" })}
            className={selectClass}
          >
            <option value="all">All verdicts</option>
            {VERDICTS.map((v) => (
              <option key={v} value={v}>
                {VERDICT_STYLE[v].label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-navy/70">
        <p>
          <strong className="text-deep">{results.length}</strong> {results.length === 1 ? "claim" : "claims"} found
          in {region} over the last 14 days
        </p>
        {isFiltered(filters) && (
          <button
            type="button"
            onClick={() => onFiltersChange({ text: "", publisher: "all", verdict: "all" })}
            className="rounded-md px-2 py-1 font-medium text-teal hover:bg-ice focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
          >
            Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="bg-white p-8 text-center text-sm text-navy/70 shadow-sm">
          No claims match these filters. Try a shorter search, or clear the publisher and verdict filters.
        </div>
      ) : (
        <ul className="divide-y divide-ice bg-white px-4 shadow-sm">
          {results.map((r) => {
            const active = r.key === selectedKey;
            return (
              <li key={r.key} className={`py-3 ${active ? "-mx-2 bg-ice/60 px-2" : ""}`}>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
                  <VerdictChip claim={r.claim} />
                  <CountryFlag publisher={r.article.publisher} />
                  <span className="text-deep">{r.article.publisher.name}</span>
                  <span className="font-normal normal-case text-navy/50">{formatShort(r.dateKey)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelect(r.key)}
                  aria-pressed={active}
                  className="mt-1 block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
                >
                  <span className="block font-serif text-base font-semibold leading-snug text-navy">
                    {r.claim.text}
                  </span>
                  <span className="mt-1 block text-xs text-navy/70">From: {r.article.headline}</span>
                  <span className="mt-0.5 block text-[11px] text-navy/50">
                    {r.clusterTitle} · {Math.round(r.claim.confidence * 100)}% confidence
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
