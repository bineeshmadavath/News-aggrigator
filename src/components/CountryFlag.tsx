import { useId, useState } from "react";
import { COUNTRY_NAME, PUBLISHER_BRAND } from "../lib/brand";
import type { Publisher } from "../types";

interface CountryFlagProps {
  publisher: Publisher;
}

function flagArt(code: string) {
  switch (code) {
    case "GB":
      return (
        <>
          <rect width="24" height="16" fill="#012169" />
          <path d="M0,0 L24,16 M24,0 L0,16" stroke="#FFFFFF" strokeWidth="4.5" />
          <path d="M0,0 L24,16 M24,0 L0,16" stroke="#C8102E" strokeWidth="2.5" />
          <rect x="9.5" width="5" height="16" fill="#FFFFFF" />
          <rect y="5.5" width="24" height="5" fill="#FFFFFF" />
          <rect x="10.5" width="3" height="16" fill="#C8102E" />
          <rect y="6.5" width="24" height="3" fill="#C8102E" />
        </>
      );
    case "US":
      return (
        <>
          <rect width="24" height="16" fill="#FFFFFF" />
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} y={i * 2 * (16 / 13)} width="24" height={16 / 13} fill="#B22234" />
          ))}
          <rect width="10" height="8.6" fill="#3C3B6E" />
        </>
      );
    case "DE":
      return (
        <>
          <rect width="24" height="5.33" fill="#000000" />
          <rect y="5.33" width="24" height="5.34" fill="#DD0000" />
          <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
        </>
      );
    case "FR":
      return (
        <>
          <rect width="8" height="16" fill="#002395" />
          <rect x="8" width="8" height="16" fill="#FFFFFF" />
          <rect x="16" width="8" height="16" fill="#ED2939" />
        </>
      );
    case "CA":
      return (
        <>
          <rect width="24" height="16" fill="#FFFFFF" />
          <rect width="6" height="16" fill="#D52B1E" />
          <rect x="18" width="6" height="16" fill="#D52B1E" />
          <polygon
            points="12,4.5 13,6.5 14.5,6 14,8 15.5,8.5 14.5,10 15,11.5 12.8,11 12.8,12.5 11.2,12.5 11.2,11 9,11.5 9.5,10 8.5,8.5 10,8 9.5,6 11,6.5"
            fill="#D52B1E"
          />
        </>
      );
    case "JP":
      return (
        <>
          <rect width="24" height="16" fill="#FFFFFF" />
          <circle cx="12" cy="8" r="4.8" fill="#BC002D" />
        </>
      );
    case "IN":
      return (
        <>
          <rect width="24" height="5.33" fill="#FF9933" />
          <rect y="5.33" width="24" height="5.34" fill="#FFFFFF" />
          <rect y="10.67" width="24" height="5.33" fill="#138808" />
          <circle cx="12" cy="8" r="2.5" fill="none" stroke="#000080" strokeWidth="0.6" />
          <circle cx="12" cy="8" r="0.4" fill="#000080" />
        </>
      );
    case "QA":
      return (
        <>
          <rect width="24" height="16" fill="#8D1B3D" />
          <path d="M0,0 L7,0 L9.5,2 L7,4 L9.5,6 L7,8 L9.5,10 L7,12 L9.5,14 L7,16 L0,16 Z" fill="#FFFFFF" />
        </>
      );
    case "HK":
      return (
        <>
          <rect width="24" height="16" fill="#DE2910" />
          <circle cx="12" cy="8" r="4" fill="none" stroke="#FFFFFF" strokeWidth="0.4" />
          <circle cx="12" cy="4.2" r="0.8" fill="#FFFFFF" />
          <circle cx="15.6" cy="6.6" r="0.8" fill="#FFFFFF" />
          <circle cx="14.2" cy="10.6" r="0.8" fill="#FFFFFF" />
          <circle cx="9.8" cy="10.6" r="0.8" fill="#FFFFFF" />
          <circle cx="8.4" cy="6.6" r="0.8" fill="#FFFFFF" />
        </>
      );
    case "CN":
      return (
        <>
          <rect width="24" height="16" fill="#DE2910" />
          <polygon points="4,2 4.6,3.9 6.4,3.9 5,5 5.5,6.9 4,5.7 2.5,6.9 3,5 1.6,3.9 3.4,3.9" fill="#FFDE00" />
          <polygon points="7,1.5 7.4,2.6 8.5,2.6 7.6,3.3 7.9,4.4 7,3.7 6.1,4.4 6.4,3.3 5.5,2.6 6.6,2.6" fill="#FFDE00" />
          <polygon points="9,3 9.4,4.1 10.5,4.1 9.6,4.8 9.9,5.9 9,5.2 8.1,5.9 8.4,4.8 7.5,4.1 8.6,4.1" fill="#FFDE00" />
          <polygon points="9,5.5 9.4,6.6 10.5,6.6 9.6,7.3 9.9,8.4 9,7.7 8.1,8.4 8.4,7.3 7.5,6.6 8.6,6.6" fill="#FFDE00" />
          <polygon points="7,8 7.4,9.1 8.5,9.1 7.6,9.8 7.9,10.9 7,10.2 6.1,10.9 6.4,9.8 5.5,9.1 6.6,9.1" fill="#FFDE00" />
        </>
      );
    case "SG":
      return (
        <>
          <rect width="24" height="8" fill="#EF3340" />
          <rect y="8" width="24" height="8" fill="#FFFFFF" />
          <circle cx="5.5" cy="4" r="2.8" fill="#FFFFFF" />
          <circle cx="6.8" cy="4" r="2.1" fill="#EF3340" />
        </>
      );
    case "SA":
      return (
        <>
          <rect width="24" height="16" fill="#006C35" />
        </>
      );
    case "BE":
      return (
        <>
          <rect width="8" height="16" fill="#000000" />
          <rect x="8" width="8" height="16" fill="#FDDA24" />
          <rect x="16" width="8" height="16" fill="#EF3340" />
        </>
      );
    case "AE":
      return (
        <>
          <rect width="24" height="5.33" fill="#00732F" />
          <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
          <rect y="10.67" width="24" height="5.33" fill="#000000" />
          <rect width="6" height="16" fill="#FF0000" />
        </>
      );
    default:
      return <rect width="24" height="16" fill="#E6F5F7" />;
  }
}

/** Flag of the publisher's home country with a hover tooltip. */
export function CountryFlag({ publisher }: CountryFlagProps) {
  const [open, setOpen] = useState(false);
  const tipId = useId();
  const code = PUBLISHER_BRAND[publisher.name]?.country ?? "";
  const label = COUNTRY_NAME[code] ?? "Unknown country";

  return (
    <span
      className="relative inline-flex align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <svg
        role="img"
        aria-label={`Flag of ${label}`}
        aria-describedby={open ? tipId : undefined}
        viewBox="0 0 24 16"
        width="24"
        height="16"
        className="inline-block shrink-0 rounded-[2px] ring-1 ring-navy/20"
      >
        {flagArt(code)}
      </svg>
      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="absolute left-0 top-full z-50 mt-2 block w-56 rounded-lg border border-ice bg-white p-3 text-left text-xs font-normal normal-case tracking-normal text-navy shadow-2xl"
        >
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-teal">
            Home country
          </span>
          <span className="mt-1 block text-sm font-semibold text-navy">{label}</span>
          <span className="mt-1 block text-xs text-navy/70">
            Country of registration for {publisher.name}.
          </span>
        </span>
      )}
    </span>
  );
}
