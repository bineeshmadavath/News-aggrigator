import { useState } from "react";
import { Globe } from "./Globe";
import { REGIONS } from "../lib/feed";
import type { Region } from "../types";

interface GlobePaneProps {
  region: Region;
  onRegionChange: (region: Region) => void;
  countFor: (region: Region) => number;
}

/**
 * Full-height left pane below the header. Holds the globe and region controls.
 * Collapses to a narrow rail on large screens; on small screens it stacks above the content.
 */
export function GlobePane({ region, onRegionChange, countFor }: GlobePaneProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      aria-label="Region globe"
      className={`w-full shrink-0 border-b border-ice bg-white transition-[width] duration-300 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r ${
        collapsed ? "lg:w-14" : "lg:w-80"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-ice px-3 py-2">
          {!collapsed && (
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-teal">Regions</p>
          )}
          {collapsed && (
            <p className="truncate text-xs font-semibold text-deep lg:hidden">{region}</p>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand globe panel" : "Collapse globe panel"}
            className="ml-auto rounded-md px-2 py-1 text-xs font-medium text-navy hover:bg-ice focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
          >
            {collapsed ? "›" : "‹ Collapse"}
          </button>
        </div>

        {collapsed && (
          <div className="hidden justify-center pt-4 lg:flex">
            <span className="text-sm [writing-mode:vertical-rl] rotate-180">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal">Region</span>
              <span className="mt-2 inline-block font-semibold text-deep">{region}</span>
            </span>
          </div>
        )}

        <div className={collapsed ? "hidden" : "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4"}>
          <div className="flex flex-col items-center">
            <Globe regions={REGIONS} selected={region} onSelect={onRegionChange} size={232} />
            <p className="mt-2 text-center text-[11px] text-navy/60">
              Drag to rotate · click the globe to select a region
            </p>
          </div>

          <label className="flex flex-col text-xs">
            <span className="mb-1 font-semibold text-navy">Region</span>
            <select
              value={region}
              onChange={(e) => onRegionChange(e.target.value as Region)}
              className="rounded-md border border-cyan bg-white px-3 py-2 text-sm text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <ul className="divide-y divide-ice border-t border-ice">
            {REGIONS.map((r) => {
              const count = countFor(r);
              const active = r === region;
              return (
                <li key={r}>
                  <button
                    type="button"
                    onClick={() => onRegionChange(r)}
                    aria-pressed={active}
                    className={`flex w-full items-center justify-between py-2.5 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua ${
                      active ? "font-semibold text-teal" : "text-navy hover:text-teal"
                    }`}
                  >
                    <span>{r}</span>
                    <span className="text-xs text-navy/60">
                      {count} {count === 1 ? "event" : "events"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
