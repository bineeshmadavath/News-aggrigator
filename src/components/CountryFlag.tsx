import { useId, useState } from "react";
import { COUNTRY_NAME, PUBLISHER_BRAND } from "../lib/brand";
import type { Publisher } from "../types";

interface CountryFlagProps {
  publisher: Publisher;
}

/** Simplified SVG flags. Canada's leaf and Lebanon's cedar are approximations. */
function flagArt(code: string) {
  switch (code) {
    case "DE":
      return (
        <>
          <rect width="24" height="5.34" fill="#000000" />
          <rect y="5.33" width="24" height="5.34" fill="#DD0000" />
          <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
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
    case "CA":
      return (
        <>
          <rect width="24" height="16" fill="#D52B1E" />
          <rect x="6" width="12" height="16" fill="#FFFFFF" />
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
    case "VN":
      return (
        <>
          <rect width="24" height="16" fill="#DA251D" />
          <polygon
            points="12,3.8 13.2,7.2 16.8,7.2 13.9,9.3 15,12.7 12,10.6 9,12.7 10.1,9.3 7.2,7.2 10.8,7.2"
            fill="#FFFF00"
          />
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
    case "LB":
      return (
        <>
          <rect width="24" height="16" fill="#FFFFFF" />
          <rect width="24" height="4" fill="#ED1C24" />
          <rect y="12" width="24" height="4" fill="#ED1C24" />
          <path d="M12 5.5 L14 8.5 L10 8.5 Z" fill="#00A651" />
        </>
      );
    default:
      return <rect width="24" height="16" fill="#E6F5F7" />;
  }
}

/** Flag of the publisher's home country. Hover shows the country name. */
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
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-teal">Home country</span>
          <span className="mt-1 block text-sm font-semibold text-navy">{label}</span>
          <span className="mt-1 block text-xs text-navy/70">
            Country of registration for {publisher.name}.
          </span>
        </span>
      )}
    </span>
  );
}
