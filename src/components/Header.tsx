interface HeaderProps {
  majorOnly: boolean;
  onMajorOnlyChange: (value: boolean) => void;
}

/** Lean masthead: title on the left, channel filter on the right. */
export function Header({ majorOnly, onMajorOnlyChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-t-[6px] border-deep bg-white px-4 shadow-sm sm:px-6">
      <h1 className="truncate font-serif text-xl font-bold tracking-tight text-navy sm:text-2xl">
        News Aggregation & AI Fact-Check Engine
      </h1>

      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden text-sm font-medium text-navy md:inline">Major Global Channels Only</span>
        <button
          type="button"
          role="switch"
          aria-label="Major Global Channels Only"
          aria-checked={majorOnly}
          onClick={() => onMajorOnlyChange(!majorOnly)}
          className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua ${
            majorOnly ? "bg-teal" : "bg-ice ring-1 ring-cyan"
          }`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
              majorOnly ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </header>
  );
}
