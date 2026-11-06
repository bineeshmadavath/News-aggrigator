import { useEffect, useRef } from "react";
import { TODAY_KEY, formatDay, formatLong, parseKey, toKey } from "../lib/dates";
/** 14 consecutive days ending at the selected date, oldest first. */
function windowEndingAt(key: string): string[] {
  const end = parseKey(key);
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(end);
    d.setDate(end.getDate() - (13 - i));
    return toKey(d);
  });
}


interface DateTimelineProps {
  selected: string;
  onSelect: (key: string) => void;
  countFor: (key: string) => number;
}

export function DateTimeline({ selected, onSelect, countFor }: DateTimelineProps) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const windowDays = windowEndingAt(selected);

  // Keep the selected (most recent) day at the right edge of the strip.
  useEffect(() => {
    if (stripRef.current) stripRef.current.scrollLeft = stripRef.current.scrollWidth;
  }, [selected]);

  return (
    <div className="rounded-xl border border-ice bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal">Timeline</p>
          <p className="flex items-center gap-2 text-sm font-semibold text-deep">
            {formatLong(selected)}
            {selected === TODAY_KEY && (
              <span className="rounded-full bg-teal px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Today
              </span>
            )}
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs text-navy/70">
          Jump to date
          <input
            type="date"
            value={selected}
            max={TODAY_KEY}
            onChange={(e) => {
              if (e.target.value) onSelect(e.target.value);
            }}
            className="rounded-md border border-cyan bg-mist px-2 py-1 text-sm text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
          />
        </label>
      </div>

      <div
        ref={stripRef}
        role="group"
        aria-label="Select a day"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {windowDays.map((key) => {
          const active = key === selected;
          const { weekday, day } = formatDay(key);
          const count = countFor(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              aria-pressed={active}
              className={`flex min-w-[64px] flex-col items-center rounded-lg border px-2 py-2 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua ${
                active
                  ? "border-teal bg-teal text-white shadow"
                  : "border-ice bg-mist text-navy hover:border-cyan"
              }`}
            >
              <span className="uppercase tracking-wide opacity-80">{weekday}</span>
              <span className="text-base font-semibold">{day}</span>
              <span className="mt-1 flex items-center gap-1 text-[10px] opacity-80">
                <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-cyan"}`} />
                {count < 0 ? "·" : `${count} ${count === 1 ? "event" : "events"}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
