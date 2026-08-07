"use client";

import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cx } from "@/lib/cx";
import { CIRCUIT_CLUSTERS, CIRCUIT_VIEWBOX } from "./circuitData";

const DRAW_DURATION_MS = 900;
const FIRST_DRAW_DELAY_MS = 650;
const CLUSTER_DELAY_STEP_MS = 90;
const GLINT_STAGGER_MS = 260;
// Last cluster's draw-in must finish before its glint starts riding the trace.
const GLINT_START_DELAY_MS =
  FIRST_DRAW_DELAY_MS +
  (CIRCUIT_CLUSTERS.length - 1) * CLUSTER_DELAY_STEP_MS +
  DRAW_DURATION_MS;

/**
 * Every hasGlint trace's start delay, keyed by its `d` string, computed once
 * per render (not inside the JSX map) so the render pass itself stays pure.
 * Capped at 3 glints total across the page — see circuitData.ts.
 */
function buildGlintDelays(): Map<string, number> {
  const delays = new Map<string, number>();
  let glintIndex = 0;
  for (const cluster of CIRCUIT_CLUSTERS) {
    for (const trace of cluster.traces) {
      if (trace.hasGlint) {
        delays.set(
          trace.d,
          GLINT_START_DELAY_MS + glintIndex * GLINT_STAGGER_MS,
        );
        glintIndex += 1;
      }
    }
  }
  return delays;
}

/**
 * Ambient decorative circuit-board layer for the public landing page only —
 * mounted from app/page.tsx, never from app/layout.tsx or app/admin/**.
 * Pure CSS motion (draw-in, traveling glints); reactivity is
 * IntersectionObserver-driven (useActiveSection), no scroll listener.
 */
export function CircuitBoard() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const activeSectionIndex = useActiveSection();
  const activeClusterIndex = activeSectionIndex % CIRCUIT_CLUSTERS.length;
  const glintDelays = buildGlintDelays();

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      viewBox={CIRCUIT_VIEWBOX}
      preserveAspectRatio="xMidYMid slice"
    >
      {CIRCUIT_CLUSTERS.map((cluster, clusterIndex) => (
        <g
          key={cluster.id}
          className={cx(
            "circuit-cluster",
            clusterIndex === activeClusterIndex && "circuit-cluster--lit",
          )}
        >
          {cluster.traces.map((trace) => {
            const glintDelay = glintDelays.get(trace.d);
            const showGlint = glintDelay !== undefined && !prefersReducedMotion;

            return (
              <g key={trace.d}>
                <path
                  d={trace.d}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={prefersReducedMotion ? 0 : 1}
                  className={cx(
                    !prefersReducedMotion && "animate-circuit-draw",
                  )}
                  style={
                    prefersReducedMotion
                      ? undefined
                      : {
                          animationDelay: `${FIRST_DRAW_DELAY_MS + clusterIndex * CLUSTER_DELAY_STEP_MS}ms`,
                        }
                  }
                />
                {showGlint && (
                  <circle
                    r={2.5}
                    fill="var(--color-accent)"
                    className="animate-circuit-travel"
                    style={{
                      offsetPath: `path('${trace.d}')`,
                      animationDelay: `${glintDelay}ms`,
                    }}
                  />
                )}
              </g>
            );
          })}
          {cluster.nodes.map((node, nodeIndex) => (
            <circle
              key={nodeIndex}
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill={node.filled ? "var(--color-accent)" : "none"}
              stroke={node.filled ? "none" : "var(--color-accent)"}
              strokeWidth={node.filled ? 0 : 1.25}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
