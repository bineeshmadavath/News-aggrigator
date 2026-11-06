import type { Region } from "../types";

export interface GeoPoint {
  lon: number;
  lat: number;
}

/** Center point used when the globe rotates to a region. */
export const REGION_GEO: Record<Region, GeoPoint> = {
  "North America": { lon: -100, lat: 40 },
  Europe: { lon: 12, lat: 50 },
  Asia: { lon: 100, lat: 32 },
  "Middle East": { lon: 47, lat: 26 },
};

type Ring = [number, number][];

/**
 * Simplified continent outlines as [lon, lat] rings.
 * Approximate and intended only for visual context on the globe.
 */
const LAND: Ring[] = [
  // North America
  [[-168, 66], [-156, 71], [-140, 70], [-128, 70], [-115, 68], [-95, 72], [-82, 69], [-80, 63], [-94, 59],
   [-92, 56], [-82, 53], [-79, 55], [-77, 62], [-70, 60], [-64, 60], [-56, 52], [-66, 45], [-70, 42],
   [-76, 38], [-81, 31], [-80, 25], [-83, 29], [-90, 30], [-97, 27], [-97, 21], [-90, 21], [-87, 16],
   [-83, 10], [-79, 8], [-84, 9], [-92, 15], [-105, 20], [-112, 30], [-110, 23], [-117, 33], [-121, 35],
   [-124, 42], [-124, 48], [-130, 55], [-140, 60], [-152, 59], [-165, 62]],
  // South America
  [[-80, 10], [-72, 12], [-62, 11], [-52, 5], [-35, -5], [-39, -14], [-41, -22], [-48, -26], [-58, -35],
   [-65, -42], [-68, -52], [-74, -50], [-74, -40], [-71, -30], [-70, -18], [-76, -14], [-81, -5], [-80, 0]],
  // Eurasia
  [[-10, 36], [-9, 43], [-2, 44], [-4, 48], [2, 51], [8, 54], [10, 57], [12, 55], [20, 55], [22, 60],
   [30, 60], [24, 65], [20, 69], [30, 71], [45, 68], [60, 70], [70, 73], [80, 73], [100, 78], [115, 73],
   [130, 72], [150, 71], [170, 70], [180, 66], [178, 62], [162, 60], [156, 51], [142, 53], [136, 43],
   [129, 35], [122, 40], [120, 30], [110, 20], [106, 10], [100, 13], [100, 3], [104, 1], [98, 8], [97, 16],
   [92, 22], [80, 15], [77, 8], [72, 21], [67, 25], [57, 25], [56, 27], [50, 30], [48, 29], [51, 25],
   [56, 25], [59, 22], [52, 17], [43, 13], [39, 21], [35, 28], [33, 31], [36, 36], [27, 37], [26, 40],
   [23, 37], [21, 40], [19, 42], [13, 45], [12, 44], [16, 38], [10, 44], [3, 43], [-2, 37], [-6, 36]],
  // Africa
  [[-17, 21], [-16, 28], [-10, 30], [-6, 36], [10, 37], [11, 33], [20, 31], [32, 31], [34, 28], [39, 16],
   [43, 12], [51, 12], [48, 6], [40, -3], [40, -15], [35, -24], [32, -29], [20, -35], [18, -32], [12, -18],
   [13, -5], [9, 4], [-8, 4], [-13, 8], [-17, 14]],
  // Australia
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [151, -34],
   [146, -39], [140, -38], [131, -31], [116, -35], [114, -26]],
  // Greenland
  [[-55, 60], [-43, 60], [-20, 70], [-18, 80], [-40, 83], [-60, 82], [-70, 78], [-55, 70]],
];

function insideRing(x: number, y: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Sampled land points rendered as a dot matrix on the globe. */
export const DOTS: [number, number][] = (() => {
  const points: [number, number][] = [];
  for (let lon = -180; lon < 180; lon += 3) {
    for (let lat = -58; lat <= 78; lat += 3) {
      if (LAND.some((ring) => insideRing(lon, lat, ring))) points.push([lon, lat]);
    }
  }
  return points;
})();

/** Orthographic projection centered on (centerLon, centerLat). z > 0 means facing the viewer. */
export function project(lon: number, lat: number, centerLon: number, centerLat: number) {
  const toRad = Math.PI / 180;
  const phi = lat * toRad;
  const phi0 = centerLat * toRad;
  const lambda = (lon - centerLon) * toRad;
  return {
    x: Math.cos(phi) * Math.sin(lambda),
    y: Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda),
    z: Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda),
  };
}
