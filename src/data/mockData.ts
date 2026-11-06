import type { Publisher, StoryCluster } from "../types";

const PUBLISHERS: Record<string, Publisher> = {
  continental: { id: "continental", name: "Continental Daily", homeRegion: "Europe", tier: "major" },
  meridian: { id: "meridian", name: "Meridian Wire", homeRegion: "Europe", tier: "regional" },
  harbor: { id: "harbor", name: "Harbor Journal", homeRegion: "North America", tier: "major" },
  cascade: { id: "cascade", name: "Cascade Tribune", homeRegion: "North America", tier: "regional" },
  pacific: { id: "pacific", name: "Pacific Sentinel", homeRegion: "Asia", tier: "major" },
  atlas: { id: "atlas", name: "Atlas Standard", homeRegion: "North America", tier: "major" },
  mekong: { id: "mekong", name: "Mekong Ledger", homeRegion: "Asia", tier: "regional" },
  gulf: { id: "gulf", name: "Gulf Dispatch", homeRegion: "Middle East", tier: "major" },
  levant: { id: "levant", name: "Levant Local", homeRegion: "Middle East", tier: "regional" },
};

export const CLUSTERS: StoryCluster[] = [
  {
    id: "summit-2026",
    title: "Global Summit 2026: Climate Finance Pact",
    summary:
      "Delegates reached a climate finance framework after two days of closed-door talks. Reactions diverge sharply on enforcement and cost.",
    region: "Europe",
    articles: [
      {
        id: "a-summit-1",
        publisher: PUBLISHERS.continental,
        headline: "Summit ends with climate finance framework, but critics say enforcement is absent",
        url: "https://example.com/continental/climate-pact",
        publishedAt: "2h ago",
        leanScore: -0.45,
        claims: [
          {
            id: "c-s1-1",
            text: "The framework commits $300B in annual climate finance by 2035.",
            verdict: "partially-supported",
            confidence: 0.72,
            basis: { metric: "Evidence match", value: "Figure matches draft (1 of 2 conditions met)", rule: "Partially supported: figure verified but conditions unmet" },
            rationale:
              "The figure matches the draft text, but the target is conditional on national pledges that have not yet been made.",
            sources: [
              { outlet: "Summit secretariat", stance: "corroborates", reference: "Draft communique, section 4.2" },
              { outlet: "Meridian Wire", stance: "context", reference: "Notes the figure is conditional" },
            ],
          },
          {
            id: "c-s1-2",
            text: "No binding penalties exist for nations that miss emissions targets.",
            verdict: "supported",
            confidence: 0.91,
            basis: { metric: "Source agreement", value: "1 corroborating, 0 contradicting (100% agreement)", rule: "Supported: agreement at least 90% and confidence at least 0.80" },
            rationale: "Article 9 establishes a voluntary review process with no enforcement mechanism.",
            sources: [
              { outlet: "Summit secretariat", stance: "corroborates", reference: "Article 9, voluntary review" },
            ],
          },
        ],
      },
      {
        id: "a-summit-2",
        publisher: PUBLISHERS.meridian,
        headline: "Negotiators hail the framework as a first step, with implementation hinging on national budgets",
        url: "https://example.com/meridian/climate-pact",
        publishedAt: "1h ago",
        leanScore: 0.02,
        claims: [
          {
            id: "c-s2-1",
            text: "Eleven delegations abstained from the final vote.",
            verdict: "disputed",
            confidence: 0.38,
            basis: { metric: "Count check", value: "Roll call shows 9 abstentions, claim says 11 (gap of 2)", rule: "Disputed: official record contradicts the reported count" },
            rationale:
              "The official roll call lists nine abstentions. The figure of eleven appears only in an early wire draft.",
            sources: [
              { outlet: "Summit secretariat", stance: "contradicts", reference: "Official roll call record" },
            ],
          },
          {
            id: "c-s2-2",
            text: "The framework was adopted by consensus.",
            verdict: "supported",
            confidence: 0.88,
            basis: { metric: "Source agreement", value: "1 corroborating, 0 contradicting (100% agreement)", rule: "Supported: agreement at least 90% and confidence at least 0.80" },
            rationale: "Adoption minutes record no formal objection from any delegation.",
            sources: [
              { outlet: "Summit secretariat", stance: "corroborates", reference: "Adoption minutes, session 3" },
            ],
          },
        ],
      },
      {
        id: "a-summit-3",
        publisher: PUBLISHERS.harbor,
        headline: "Climate pact is a costly giveaway that will burden taxpayers",
        url: "https://example.com/harbor/climate-pact",
        publishedAt: "3h ago",
        leanScore: 0.6,
        claims: [
          {
            id: "c-s3-1",
            text: "Participating nations will face new carbon levies on imports.",
            verdict: "unverified",
            confidence: 0.44,
            basis: { metric: "Detail coverage", value: "0 of 2 required details found (levy rate, schedule)", rule: "Unverified: under 50% of required details located" },
            rationale:
              "The draft mentions a review of border measures, but no levy rate or schedule is specified.",
            sources: [
              { outlet: "Summit secretariat", stance: "contradicts", reference: "No levy language in draft text" },
            ],
          },
          {
            id: "c-s3-2",
            text: "The pact adds an estimated $40B in annual domestic spending.",
            verdict: "partially-supported",
            confidence: 0.55,
            basis: { metric: "Estimate match", value: "Treasury estimate $25B vs claimed $40B (63% supported)", rule: "Partially supported: 50% to 90% of the figure supported" },
            rationale:
              "A treasury estimate supports roughly $25B. The higher figure uses a broader scope not stated in the text.",
            sources: [
              { outlet: "Treasury estimate", stance: "context", reference: "Table 2, domestic scope" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "chip-controls",
    title: "Chip Export Controls Expand to Mid-Tier Fabs",
    summary:
      "New rules extend export licensing to mid-tier semiconductor fabrication plants across the region, with mixed reactions from industry and allies.",
    region: "Asia",
    articles: [
      {
        id: "a-chip-1",
        publisher: PUBLISHERS.pacific,
        headline: "New export rules extend to mid-tier chip fabs across the region",
        url: "https://example.com/pacific/chip-controls",
        publishedAt: "4h ago",
        leanScore: 0.08,
        claims: [
          {
            id: "c-c1-1",
            text: "The rules take effect in 90 days.",
            verdict: "supported",
            confidence: 0.9,
            basis: { metric: "Date check", value: "Effective date equals publication plus 90 days (exact match)", rule: "Supported: exact match with the primary document" },
            rationale: "The gazette notice sets an effective date exactly 90 days after publication.",
            sources: [
              { outlet: "Official gazette", stance: "corroborates", reference: "Notice 41, effective date clause" },
            ],
          },
          {
            id: "c-c1-2",
            text: "Three regional fabs have already announced relocation plans.",
            verdict: "partially-supported",
            confidence: 0.66,
            basis: { metric: "Filing confirmation", value: "2 of 3 announcements confirmed in filings (67%)", rule: "Partially supported: 50% to 90% confirmed" },
            rationale: "Company filings confirm two of the three announcements. The third is reported but unconfirmed.",
            sources: [
              { outlet: "Company filings", stance: "corroborates", reference: "Two 8-K style disclosures" },
            ],
          },
        ],
      },
      {
        id: "a-chip-2",
        publisher: PUBLISHERS.atlas,
        headline: "Export expansion targets allies in a bid to contain rival technology firms",
        url: "https://example.com/atlas/chip-controls",
        publishedAt: "5h ago",
        leanScore: -0.5,
        claims: [
          {
            id: "c-c2-1",
            text: "The policy was drafted without consultation with industry groups.",
            verdict: "disputed",
            confidence: 0.4,
            basis: { metric: "Process check", value: "2 consultation sessions cited, 0 recorded in the policy record", rule: "Disputed: primary record contradicts the stated process" },
            rationale: "A trade association cites two consultation sessions held before publication.",
            sources: [
              { outlet: "Industry trade association", stance: "contradicts", reference: "Press release, 28 Oct" },
            ],
          },
          {
            id: "c-c2-2",
            text: "The rules cover equipment valued above $50M.",
            verdict: "supported",
            confidence: 0.85,
            basis: { metric: "Threshold match", value: "$50M threshold stated in Annex B (exact match)", rule: "Supported: exact match with the primary document" },
            rationale: "The threshold is stated explicitly in the licensing annex.",
            sources: [
              { outlet: "Official gazette", stance: "corroborates", reference: "Annex B, threshold clause" },
            ],
          },
        ],
      },
      {
        id: "a-chip-3",
        publisher: PUBLISHERS.mekong,
        headline: "Regional supply chains brace for higher compliance costs",
        url: "https://example.com/mekong/chip-controls",
        publishedAt: "6h ago",
        leanScore: 0.15,
        claims: [
          {
            id: "c-c3-1",
            text: "Compliance costs could rise by up to 12% for smaller suppliers.",
            verdict: "unverified",
            confidence: 0.35,
            basis: { metric: "Methodology disclosure", value: "0 of 1 methodology published (0%)", rule: "Unverified: the method needed to check the estimate is unavailable" },
            rationale: "The estimate traces to a single consultancy that has not published its methodology.",
            sources: [
              { outlet: "Consultancy report", stance: "context", reference: "Methodology not disclosed" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "gulf-corridor",
    title: "Gulf Shipping Corridor Reopens After Six-Week Closure",
    summary:
      "Shipping has resumed through the corridor as insurers restore coverage. Local fishing communities report losses that the reopening does not reverse.",
    region: "Middle East",
    articles: [
      {
        id: "a-gulf-1",
        publisher: PUBLISHERS.gulf,
        headline: "Shipping traffic resumes through the corridor as insurers restore coverage",
        url: "https://example.com/gulf/corridor",
        publishedAt: "8h ago",
        leanScore: 0.0,
        claims: [
          {
            id: "c-g1-1",
            text: "Daily transits have returned to 90% of pre-closure levels.",
            verdict: "partially-supported",
            confidence: 0.7,
            basis: { metric: "Transit rate", value: "88% seven-day average vs 90% claimed (2-point gap)", rule: "Partially supported: within 5 points of the claimed figure" },
            rationale: "The port authority dashboard shows 88% on a seven-day average, close to the reported figure.",
            sources: [
              { outlet: "Port authority", stance: "corroborates", reference: "Weekly transit dashboard" },
            ],
          },
          {
            id: "c-g1-2",
            text: "Insurers have reinstated war-risk coverage for all flagged vessels.",
            verdict: "disputed",
            confidence: 0.52,
            basis: { metric: "Coverage check", value: "2 of 5 insurers still exclude vessel categories (40%)", rule: "Disputed: exclusions contradict the all-vessels claim" },
            rationale: "Two insurers still exclude specific vessel categories from their renewed policies.",
            sources: [
              { outlet: "Insurance industry bulletin", stance: "contradicts", reference: "Exclusion schedule, 30 Oct" },
            ],
          },
        ],
      },
      {
        id: "a-gulf-2",
        publisher: PUBLISHERS.levant,
        headline: "The closure cost local fishers their season, and the reopening arrives too late",
        url: "https://example.com/levant/corridor",
        publishedAt: "7h ago",
        leanScore: -0.62,
        claims: [
          {
            id: "c-g2-1",
            text: "More than 1,200 fishing licenses were suspended during the closure.",
            verdict: "supported",
            confidence: 0.8,
            basis: { metric: "Register match", value: "1,207 licences suspended per ministry register", rule: "Supported: register count matches the claim (1,200 or more)" },
            rationale: "The fisheries ministry published the suspension count with a per-district breakdown.",
            sources: [
              { outlet: "Fisheries ministry", stance: "corroborates", reference: "Suspension register, district tables" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "chip-earnings",
    title: "Semiconductor Earnings Beat Forecasts, Guidance Splits Analysts",
    summary:
      "Quarterly results topped expectations across the sector, but forward guidance has drawn sharply different readings from local suppliers and national outlets.",
    region: "North America",
    articles: [
      {
        id: "a-earn-1",
        publisher: PUBLISHERS.harbor,
        headline: "Chipmakers post a strong quarter, and the outlook shows the market is recovering",
        url: "https://example.com/harbor/earnings",
        publishedAt: "1h ago",
        leanScore: 0.58,
        claims: [
          {
            id: "c-e1-1",
            text: "Quarterly revenue rose 14% year over year.",
            verdict: "supported",
            confidence: 0.93,
            basis: { metric: "Revenue growth", value: "14.1% year over year in 10-Q vs 14% claimed (0.1-point gap)", rule: "Supported: within 0.5 points of the filed figure" },
            rationale: "Exchange filings report 14.1% year-over-year growth for the quarter.",
            sources: [
              { outlet: "Exchange filings", stance: "corroborates", reference: "Quarterly 10-Q, revenue table" },
            ],
          },
        ],
      },
      {
        id: "a-earn-2",
        publisher: PUBLISHERS.cascade,
        headline: "Local suppliers see record orders as the sector rebounds",
        url: "https://example.com/cascade/earnings",
        publishedAt: "2h ago",
        leanScore: 0.7,
        claims: [
          {
            id: "c-e2-1",
            text: "Local supplier orders hit a record high in the third quarter.",
            verdict: "unverified",
            confidence: 0.46,
            basis: { metric: "Sample quality", value: "n = 31 self-reported responses, 0 audited", rule: "Unverified: self-reported sample too small to confirm" },
            rationale: "The source is a trade group survey with 31 self-reported respondents and no audited data.",
            sources: [
              { outlet: "Trade group survey", stance: "context", reference: "n = 31, self-reported" },
            ],
          },
        ],
      },
    ],
  },
];
