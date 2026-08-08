export interface CircuitNode {
  cx: number;
  cy: number;
  r: number;
  filled: boolean;
}

export interface CircuitTrace {
  d: string;
  strokeWidth: number;
  /** Rides a traveling glint along this trace — only the active cluster's shows. */
  hasGlint?: boolean;
}

export interface ClusterPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

export type ClusterVariant = "top" | "bottom";

export interface CircuitCluster {
  id: string;
  /** Selects which CSS sizing tier (.circuit-pocket--top/--bottom) applies. */
  variant: ClusterVariant;
  viewBox: string;
  aspectRatio: string;
  position: ClusterPosition;
  traces: CircuitTrace[];
  nodes: CircuitNode[];
}

/**
 * Every cluster is its own small, independently CSS-positioned SVG (see
 * ClusterPosition), not a slice of one page-spanning canvas — anchoring
 * each pocket a small, fixed CSS distance from the true left/right edge
 * guarantees it lands in whatever gutter exists outside the content
 * column, on any screen size, with no viewBox/crop math involved. Only two
 * clusters now, positioned diagonally (top-left, bottom-right — see
 * CIRCUIT_CLUSTERS at the bottom of this file), both built from the same
 * wide-band geometry (TOP_* below). `variant` selects which CSS sizing
 * tier applies (.circuit-pocket--top/--bottom in globals.css) independent
 * of a cluster's actual on-screen position.
 */
type Point = [number, number];

/**
 * Manhattan path with optionally-rounded corners: at each interior
 * waypoint, pulls back `radius` units along both the incoming and outgoing
 * segment and joins them with a quadratic curve through the original
 * corner point (a standard corner-rounding technique — far less error-prone
 * by hand than working out SVG arc sweep flags). Every waypoint segment
 * below is authored longer than any radius used against it (with at least
 * as much slack as the sum of both corners' pullbacks where a segment sits
 * between two rounded corners), so the pullback never overshoots into a
 * neighboring segment. radius 0 (default) keeps the corner sharp, for a
 * deliberate mix of curved and crisp traces.
 */
function tracePath(points: Point[], radius = 0): string {
  const start = points[0];
  if (!start) return "";
  const rest = points.slice(1);

  let d = `M ${start[0]} ${start[1]}`;

  rest.forEach(([x, y], i) => {
    const next = rest[i + 1];
    const prev = i === 0 ? start : rest[i - 1];
    if (!next || !prev || radius === 0) {
      d += ` L ${x} ${y}`;
      return;
    }
    const [prevX, prevY] = prev;
    const inX = Math.sign(x - prevX);
    const inY = Math.sign(y - prevY);
    const outX = Math.sign(next[0] - x);
    const outY = Math.sign(next[1] - y);
    d += ` L ${x - inX * radius} ${y - inY * radius} Q ${x} ${y} ${x + outX * radius} ${y + outY * radius}`;
  });

  return d;
}

interface TraceSpec {
  points: Point[];
  radius?: number;
  strokeWidth: number;
  hasGlint?: boolean;
}

interface NodeSpec {
  point: Point;
  r: number;
  filled: boolean;
}

function mirrorPoint(
  [x, y]: Point,
  width: number,
  height: number,
  axis: "x" | "y" | "xy" | "none",
): Point {
  if (axis === "x") return [width - x, y];
  if (axis === "y") return [x, height - y];
  if (axis === "xy") return [width - x, height - y];
  return [x, y];
}

function buildCluster(
  id: string,
  variant: ClusterVariant,
  width: number,
  height: number,
  axis: "x" | "y" | "xy" | "none",
  traceSpecs: TraceSpec[],
  nodeSpecs: NodeSpec[],
  position: ClusterPosition,
): CircuitCluster {
  const transform = (p: Point) => mirrorPoint(p, width, height, axis);
  return {
    id,
    variant,
    viewBox: `0 0 ${width} ${height}`,
    aspectRatio: `${width} / ${height}`,
    position,
    traces: traceSpecs.map((trace) => ({
      d: tracePath(trace.points.map(transform), trace.radius),
      strokeWidth: trace.strokeWidth,
      hasGlint: trace.hasGlint,
    })),
    nodes: nodeSpecs.map((node) => {
      const [cx, cy] = transform(node.point);
      return { cx, cy, r: node.r, filled: node.filled };
    }),
  };
}

// ---------------------------------------------------------------------------
// The one canonical design — a wide band, originally meant to span most of
// the top of the page (the Hero's own copy is only max-w-4xl/896px,
// narrower than every other section's max-w-6xl, which leaves real room
// for this to be much bigger than a corner accent). Both of the page's two
// clusters (top-left, bottom-right — see CIRCUIT_CLUSTERS) are built from
// this same trace/node set.
// ---------------------------------------------------------------------------
const TOP_W = 420;
const TOP_H = 260;

const TOP_CORE_TRACES: TraceSpec[] = [
  {
    points: [
      [0, 20],
      [0, 90],
      [90, 90],
      [90, 150],
      [200, 150],
      [200, 200],
      [340, 200],
    ],
    radius: 16,
    strokeWidth: 2.5,
    hasGlint: true,
  },
  {
    points: [
      [90, 90],
      [90, 40],
      [180, 40],
      [180, 10],
    ],
    strokeWidth: 1.5,
  },
  {
    points: [
      [20, 230],
      [90, 230],
      [90, 170],
      [200, 170],
      [200, 130],
      [320, 130],
    ],
    radius: 14,
    strokeWidth: 1.5,
  },
  {
    points: [
      [200, 150],
      [260, 150],
      [260, 90],
      [340, 90],
    ],
    strokeWidth: 1.25,
  },
  {
    points: [
      [140, 10],
      [140, 60],
      [220, 60],
      [220, 20],
    ],
    radius: 10,
    strokeWidth: 1.25,
  },
];

const TOP_CORE_NODES: NodeSpec[] = [
  { point: [0, 90], r: 4.5, filled: true },
  { point: [90, 90], r: 5.5, filled: false },
  { point: [180, 40], r: 3, filled: true },
  { point: [180, 10], r: 3, filled: true },
  { point: [90, 150], r: 4, filled: true },
  { point: [200, 150], r: 4.5, filled: false },
  { point: [200, 200], r: 3.5, filled: true },
  { point: [340, 200], r: 4.5, filled: true },
  { point: [90, 230], r: 4, filled: false },
  { point: [200, 170], r: 3.5, filled: true },
  { point: [200, 130], r: 4, filled: false },
  { point: [320, 130], r: 4, filled: true },
  { point: [260, 150], r: 3, filled: true },
  { point: [260, 90], r: 3.5, filled: false },
  { point: [340, 90], r: 4, filled: true },
  { point: [140, 60], r: 3, filled: false },
  { point: [220, 60], r: 3, filled: true },
  { point: [220, 20], r: 2.5, filled: true },
];

// Two decorative motifs lifted from the reference PCB image: a "chip pin"
// comb (parallel stub traces with a dot at the free end) and a diagonal
// hatch fan. Both are static ornaments, not routing — no bends, no
// rounding — so they're generated from plain coordinate lists rather than
// run through tracePath's corner logic.
const PIN_X_START = 350;
const PIN_X_STEP = 10;
const PIN_Y_BOTTOM = 55;
const PIN_Y_TOP = 15;
const PIN_COUNT = 6;

const PIN_TRACES: TraceSpec[] = Array.from({ length: PIN_COUNT }, (_, i) => ({
  points: [
    [PIN_X_START + i * PIN_X_STEP, PIN_Y_BOTTOM],
    [PIN_X_START + i * PIN_X_STEP, PIN_Y_TOP],
  ] as Point[],
  strokeWidth: 1,
}));

const PIN_NODES: NodeSpec[] = Array.from({ length: PIN_COUNT }, (_, i) => ({
  point: [PIN_X_START + i * PIN_X_STEP, PIN_Y_TOP] as Point,
  r: 2,
  filled: true,
}));

const HATCH_STARTS: Point[] = [
  [8, 100],
  [8, 112],
  [8, 124],
  [8, 136],
  [8, 148],
];
const HATCH_ENDPOINTS: Point[] = [
  [38, 108],
  [42, 124],
  [46, 140],
  [50, 156],
  [54, 172],
];

const HATCH_TRACES: TraceSpec[] = HATCH_STARTS.map((start, i) => ({
  points: [start, HATCH_ENDPOINTS[i]!],
  strokeWidth: 1,
}));

const HATCH_NODES: NodeSpec[] = HATCH_ENDPOINTS.map((point) => ({
  point,
  r: 1.8,
  filled: true,
}));

const TOP_TRACES: TraceSpec[] = [
  ...TOP_CORE_TRACES,
  ...PIN_TRACES,
  ...HATCH_TRACES,
];
const TOP_NODES: NodeSpec[] = [...TOP_CORE_NODES, ...PIN_NODES, ...HATCH_NODES];

// A small, fixed distance from the true viewport edge.
const EDGE_OFFSET = "clamp(8px, 1vw, 20px)";

// Clears the sticky <header> (Navbar.tsx: header pt-4 [16px] + nav py-3
// [12px top/bottom] + its ~40px-tall pill content + border), with a
// deliberate extra gap below it since the ask was to sit noticeably lower,
// not just clear it by a hair. Estimated, not measured live — nudge if the
// real rendered navbar height differs.
const TOP_CLUSTER_OFFSET = "7rem";

/**
 * Two clusters, deliberately diagonal: top-left stays put, and what used
 * to be the independent top-right design is relocated to the bottom-right
 * corner instead (both bottom clusters, and the original top-right slot,
 * were removed outright — this replaces them rather than adding a third
 * position). Its geometry and mirroring (mirrorX off the same TOP_TRACES/
 * TOP_NODES) are untouched, only `position` and `variant` moved — variant
 * switches to "bottom" so it sizes against the narrower gutter most
 * sections actually have (max-w-6xl, not Hero's max-w-4xl), since it no
 * longer sits next to the Hero specifically.
 */
export const CIRCUIT_CLUSTERS: CircuitCluster[] = [
  buildCluster("top-left", "top", TOP_W, TOP_H, "none", TOP_TRACES, TOP_NODES, {
    left: EDGE_OFFSET,
    top: TOP_CLUSTER_OFFSET,
  }),
  buildCluster(
    "bottom-right",
    "bottom",
    TOP_W,
    TOP_H,
    "x",
    TOP_TRACES,
    TOP_NODES,
    { right: EDGE_OFFSET, bottom: "8%" },
  ),
];
