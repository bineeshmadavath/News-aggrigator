import { useMemo, useState } from "react";
import { Header } from "./components/Header";
import { GlobePane } from "./components/GlobePane";
import { DateTimeline } from "./components/DateTimeline";
import { ClusterCard } from "./components/ClusterCard";
import { ReasoningPanel } from "./components/ReasoningPanel";
import { FactCheckView } from "./components/FactCheckView";
import { buildFeed } from "./lib/feed";
import { TODAY_KEY, formatLong } from "./lib/dates";
import { getClustersForDate } from "./data/archive";
import { collectFactChecks, searchFactChecks, type FactCheckFilters } from "./lib/factcheck";
import type { Article, Region } from "./types";

type Mode = "news" | "factcheck";

const MODE_TABS: { id: Mode; label: string }[] = [
  { id: "news", label: "Daily news" },
  { id: "factcheck", label: "Fact-check search" },
];

export default function App() {
  const [mode, setMode] = useState<Mode>("news");

  // Daily news state
  const [region, setRegion] = useState<Region>("Europe");
  const [majorOnly, setMajorOnly] = useState(true);
  const [dateKey, setDateKey] = useState(TODAY_KEY);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fact-check state
  const [factFilters, setFactFilters] = useState<FactCheckFilters>({ text: "", publisher: "all", verdict: "all" });
  const [selectedFactKey, setSelectedFactKey] = useState<string | null>(null);

  const clusters = useMemo(() => getClustersForDate(dateKey), [dateKey]);
  const feed = useMemo(() => buildFeed(clusters, { region, majorOnly }), [clusters, region, majorOnly]);
  const countFor = (r: Region) => buildFeed(clusters, { region: r, majorOnly }).length;

  const visibleArticles = useMemo(() => feed.flatMap((item) => item.articles), [feed]);
  const activeArticle: Article | null =
    visibleArticles.find((a) => a.id === selectedId) ?? visibleArticles[0] ?? null;
  const activeClusterTitle = activeArticle
    ? feed.find((item) => item.articles.some((a) => a.id === activeArticle.id))?.cluster.title
    : undefined;
  const totalClaims = visibleArticles.reduce((sum, a) => sum + a.claims.length, 0);
  const isToday = dateKey === TODAY_KEY;

  const allFacts = useMemo(() => collectFactChecks(), []);
  // Claims limited to the selected region
  const regionFacts = useMemo(() => allFacts.filter((r) => r.region === region), [allFacts, region]);
  const factResults = useMemo(() => searchFactChecks(regionFacts, factFilters), [regionFacts, factFilters]);
  const publisherNames = useMemo(
    () => Array.from(new Set(regionFacts.map((r) => r.article.publisher.name))).sort(),
    [regionFacts]
  );
  const activeFact = factResults.find((r) => r.key === selectedFactKey) ?? factResults[0] ?? null;

  const handleRegion = (r: Region) => {
    setRegion(r);
    setSelectedId(null);
    setFactFilters((f) => ({ ...f, publisher: "all" }));
  };
  const handleDate = (key: string) => {
    setDateKey(key);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-mist text-navy">
      <Header majorOnly={majorOnly} onMajorOnlyChange={setMajorOnly} />

      <div className="flex flex-col lg:flex-row">
        <GlobePane region={region} onRegionChange={handleRegion} countFor={countFor} />

        <main className="min-w-0 flex-1 space-y-6 px-4 py-6 sm:px-6">
          <div role="tablist" aria-label="View" className="inline-flex rounded-md border border-cyan bg-white p-1 text-sm">
            {MODE_TABS.map((tab) => {
              const active = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMode(tab.id)}
                  className={`rounded px-4 py-1.5 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua ${
                    active ? "bg-teal text-white" : "text-navy hover:bg-ice"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {mode === "news" ? (
            <>
              <DateTimeline
                selected={dateKey}
                onSelect={handleDate}
                countFor={(key) => getClustersForDate(key).length}
              />

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="min-w-0 space-y-5">
                  <div className="border-b border-ice pb-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal">
                      {isToday ? "Today's news" : "News archive"}
                    </p>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="font-serif text-2xl font-bold text-navy">
                        {region}
                        <span className="ml-3 font-sans text-base font-normal text-navy/60">
                          {formatLong(dateKey)}
                        </span>
                      </h2>
                      <p className="text-xs text-navy/70">
                        {feed.length} {feed.length === 1 ? "event" : "events"} · {visibleArticles.length} sources ·{" "}
                        {totalClaims} claims · {majorOnly ? "Major global only" : "All channels"}
                      </p>
                    </div>
                  </div>

                  <section aria-label="News list" className="space-y-5">
                    {feed.length === 0 && (
                      <div className="bg-white p-8 text-center text-sm text-navy/70 shadow-sm">
                        No events in {region} for this day
                        {majorOnly ? " from major channels" : ""}.
                        {majorOnly ? ' Turn off "Major Global Channels Only" to include regional networks.' : ""}
                      </div>
                    )}
                    {feed.map((item) => (
                      <ClusterCard
                        key={item.cluster.id}
                        item={item}
                        selectedId={activeArticle?.id ?? null}
                        onSelect={setSelectedId}
                      />
                    ))}
                  </section>
                </div>

                <aside className="xl:sticky xl:top-20 xl:self-start">
                  <ReasoningPanel article={activeArticle} clusterTitle={activeClusterTitle} />
                </aside>
              </div>
            </>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
              <FactCheckView
                region={region}
                filters={factFilters}
                onFiltersChange={setFactFilters}
                publishers={publisherNames}
                results={factResults}
                selectedKey={activeFact?.key ?? null}
                onSelect={setSelectedFactKey}
              />
              <aside className="xl:sticky xl:top-20 xl:self-start">
                <ReasoningPanel article={activeFact?.article ?? null} clusterTitle={activeFact?.clusterTitle} />
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
