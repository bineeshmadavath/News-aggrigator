import { useEffect, useRef } from "react";
import { DOTS, REGION_GEO, project } from "../lib/geo";
import type { Region } from "../types";

interface GlobeProps {
  regions: Region[];
  selected: Region;
  onSelect: (region: Region) => void;
  size?: number;
}

interface Marker {
  region: Region;
  x: number;
  y: number;
  visible: boolean;
}

interface DragState {
  x: number;
  y: number;
  lon: number;
  lat: number;
  moved: boolean;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/** Wraps a longitude difference into [-180, 180) so rotation takes the short way. */
const shortestDelta = (d: number) => ((d + 540) % 360) - 180;

/**
 * Canvas-based, drag-rotatable globe.
 * - Drag to rotate freely.
 * - Click a region marker to select it (the globe animates to that region).
 * - When `selected` changes from outside (e.g. the dropdown), the globe animates to it.
 */
export function Globe({ regions, selected, onSelect, size = 280 }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const view = useRef({ lon: REGION_GEO[selected].lon, lat: REGION_GEO[selected].lat });
  const frame = useRef<number>(0);
  const drawRef = useRef<() => void>(() => {});
  const markers = useRef<Marker[]>([]);
  const drag = useRef<DragState | null>(null);

  // Latest props, read inside the imperative draw loop.
  const selectedRef = useRef(selected);
  const regionsRef = useRef(regions);
  const onSelectRef = useRef(onSelect);
  selectedRef.current = selected;
  regionsRef.current = regions;
  onSelectRef.current = onSelect;

  // One-time canvas setup and draw routine.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const c = size / 2;
    const R = c - 14;

    const draw = () => {
      const { lon, lat } = view.current;
      ctx.clearRect(0, 0, size, size);

      // Atmosphere glow
      const glow = ctx.createRadialGradient(c, c, R * 0.9, c, c, R * 1.12);
      glow.addColorStop(0, "rgba(0,151,172,0)");
      glow.addColorStop(1, "rgba(77,183,197,0.35)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(c, c, R * 1.12, 0, Math.PI * 2);
      ctx.fill();

      // Sphere body
      const sphere = ctx.createRadialGradient(c - R * 0.35, c - R * 0.4, R * 0.1, c, c, R);
      sphere.addColorStop(0, "#1D4566");
      sphere.addColorStop(1, "#0A1830");
      ctx.fillStyle = sphere;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(77,183,197,0.45)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Land dots, depth-shaded
      ctx.fillStyle = "#4DB7C5";
      for (const [dLon, dLat] of DOTS) {
        const p = project(dLon, dLat, lon, lat);
        if (p.z <= 0) continue;
        ctx.globalAlpha = 0.25 + 0.75 * p.z;
        ctx.beginPath();
        ctx.arc(c + p.x * R, c - p.y * R, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Region markers
      const next: Marker[] = [];
      for (const r of regionsRef.current) {
        const g = REGION_GEO[r];
        const p = project(g.lon, g.lat, lon, lat);
        const x = c + p.x * R;
        const y = c - p.y * R;
        const visible = p.z > 0;
        next.push({ region: r, x, y, visible });
        if (!visible) continue;

        const isSel = r === selectedRef.current;
        ctx.beginPath();
        ctx.arc(x, y, isSel ? 10 : 7, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? "rgba(0,151,172,0.35)" : "rgba(77,183,197,0.2)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, isSel ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? "#E6F5F7" : "#4DB7C5";
        ctx.fill();

        if (isSel) {
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.strokeStyle = "#4DB7C5";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.font = "600 11px Inter, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillStyle = "#E6F5F7";
          ctx.fillText(r, x, y - 22);
        }
      }
      markers.current = next;
    };

    drawRef.current = draw;
    draw();
    return () => cancelAnimationFrame(frame.current);
  }, [size]);

  // Redraw when the selection or region list changes.
  useEffect(() => {
    drawRef.current();
  }, [selected, regions]);

  // Animate the globe to the selected region (works for clicks and the dropdown).
  useEffect(() => {
    const target = REGION_GEO[selected];
    cancelAnimationFrame(frame.current);
    const start = { ...view.current };
    const dLon = shortestDelta(target.lon - start.lon);
    const dLat = target.lat - start.lat;
    const t0 = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 900);
      const eased = 1 - Math.pow(1 - t, 3);
      view.current = { lon: start.lon + dLon * eased, lat: start.lat + dLat * eased };
      drawRef.current();
      if (t < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }, [selected]);

  /**
   * Maps a screen point to the nearest region on the sphere.
   * Returns null when the point is outside the globe's disc.
   */
  const pickRegion = (clientX: number, clientY: number): Region | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const c = size / 2;
    const R = c - 14;

    // Normalized screen coordinates, y pointing up
    const X = (clientX - rect.left - c) / R;
    const Y = -(clientY - rect.top - c) / R;
    const rho = Math.hypot(X, Y);
    if (rho > 1) return null;

    // Inverse orthographic projection: screen point -> latitude/longitude
    const toRad = Math.PI / 180;
    const phi0 = view.current.lat * toRad;
    const lam0 = view.current.lon * toRad;
    const sinC = rho;
    const cosC = Math.sqrt(1 - rho * rho);
    const sinPhi =
      rho === 0 ? Math.sin(phi0) : cosC * Math.sin(phi0) + (Y * sinC * Math.cos(phi0)) / rho;
    const phi = Math.asin(Math.min(1, Math.max(-1, sinPhi)));
    const lam =
      rho === 0
        ? lam0
        : lam0 +
          Math.atan2(X * sinC, rho * Math.cos(phi0) * cosC - Y * Math.sin(phi0) * sinC);

    // Choose the region whose center is angularly closest to the clicked point
    const point = [Math.cos(phi) * Math.cos(lam), Math.cos(phi) * Math.sin(lam), Math.sin(phi)];
    let best: Region | null = null;
    let bestDot = -Infinity;
    for (const r of regions) {
      const g = REGION_GEO[r];
      const la = g.lat * toRad;
      const lo = g.lon * toRad;
      const v = [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
      const dot = v[0] * point[0] + v[1] * point[1] + v[2] * point[2];
      if (dot > bestDot) {
        bestDot = dot;
        best = r;
      }
    }
    return best;
  };

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Interactive globe. Drag to rotate, click a region to select it."
      style={{ width: size, height: size, touchAction: "none", cursor: "grab" }}
      onPointerDown={(e) => {
        cancelAnimationFrame(frame.current);
        drag.current = {
          x: e.clientX,
          y: e.clientY,
          lon: view.current.lon,
          lat: view.current.lat,
          moved: false,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
        e.currentTarget.style.cursor = "grabbing";
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) {
          e.currentTarget.style.cursor = pickRegion(e.clientX, e.clientY) ? "pointer" : "grab";
          return;
        }
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
        view.current = {
          lon: d.lon - dx * 0.4,
          lat: clamp(d.lat + dy * 0.4, -70, 70),
        };
        drawRef.current();
      }}
      onPointerUp={(e) => {
        const d = drag.current;
        drag.current = null;
        e.currentTarget.style.cursor = "grab";
        if (d && !d.moved) {
          const region = pickRegion(e.clientX, e.clientY);
          if (region) onSelectRef.current(region);
        }
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
    />
  );
}
