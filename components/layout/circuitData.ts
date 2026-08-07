export interface CircuitNode {
  cx: number;
  cy: number;
  r: number;
  filled: boolean;
}

export interface CircuitTrace {
  d: string;
  /** Rides a traveling glint along this trace — capped at 3 for the whole page. */
  hasGlint?: boolean;
}

export interface CircuitCluster {
  id: string;
  traces: CircuitTrace[];
  nodes: CircuitNode[];
}

/**
 * Fixed viewBox read as viewport-relative (via preserveAspectRatio), not
 * page-length-relative — clusters live only in the four corners, clear of
 * the ~40-50% center column every section's copy occupies.
 */
export const CIRCUIT_VIEWBOX = "0 0 1440 900";

export const CIRCUIT_CLUSTERS: CircuitCluster[] = [
  {
    id: "top-left",
    traces: [
      { d: "M 32 0 L 32 96 L 176 96 L 176 208 L 336 208", hasGlint: true },
      { d: "M 0 176 L 96 176 L 96 64 L 240 64" },
    ],
    nodes: [
      { cx: 32, cy: 96, r: 4, filled: true },
      { cx: 176, cy: 208, r: 5, filled: false },
      { cx: 336, cy: 208, r: 3.5, filled: true },
    ],
  },
  {
    id: "top-right",
    traces: [
      {
        d: "M 1408 0 L 1408 96 L 1264 96 L 1264 208 L 1104 208",
        hasGlint: true,
      },
      { d: "M 1440 176 L 1344 176 L 1344 64 L 1200 64" },
    ],
    nodes: [
      { cx: 1408, cy: 96, r: 4, filled: true },
      { cx: 1264, cy: 208, r: 5, filled: false },
      { cx: 1104, cy: 208, r: 3.5, filled: true },
    ],
  },
  {
    id: "bottom-left",
    traces: [
      { d: "M 32 900 L 32 804 L 176 804 L 176 692 L 336 692", hasGlint: true },
      { d: "M 0 724 L 96 724 L 96 836 L 240 836" },
    ],
    nodes: [
      { cx: 32, cy: 804, r: 4, filled: true },
      { cx: 176, cy: 692, r: 5, filled: false },
      { cx: 336, cy: 692, r: 3.5, filled: true },
    ],
  },
  {
    id: "bottom-right",
    traces: [
      { d: "M 1408 900 L 1408 804 L 1264 804 L 1264 692 L 1104 692" },
      { d: "M 1440 724 L 1344 724 L 1344 836 L 1200 836" },
    ],
    nodes: [
      { cx: 1408, cy: 804, r: 4, filled: true },
      { cx: 1264, cy: 692, r: 5, filled: false },
      { cx: 1104, cy: 692, r: 3.5, filled: true },
    ],
  },
];
