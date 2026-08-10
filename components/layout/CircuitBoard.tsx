"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cx } from "@/lib/cx";
import { CIRCUIT_CLUSTERS } from "./circuitData";

const DRAW_DURATION_MS = 900;
const FIRST_DRAW_DELAY_MS = 650;
const CLUSTER_DELAY_STEP_MS = 90;
// Last cluster's draw-in finishes at this point — the moment CircuitBoard
// hands each trace off from the one-time entrance keyframe to the ongoing
// connect/retract transition driven by which cluster is active.
const ENTRANCE_COMPLETE_MS =
  FIRST_DRAW_DELAY_MS +
  (CIRCUIT_CLUSTERS.length - 1) * CLUSTER_DELAY_STEP_MS +
  DRAW_DURATION_MS;

// A retracted trace stays 55% drawn, never fully undrawn — it's meant to
// keep reading as ambient background, not disappear between sections.
const RETRACT_OFFSET = 0.45;

// Section index at which the load-time energy peak has fully settled to the
// ambient baseline. Matches the .circuit-trace CSS transition duration so a
// glint never appears to outrun the connection it's riding.
const ENERGY_SETTLE_INDEX = 3;
const TRACE_TRANSITION_MS = 650;

/**
 * 1 at the very first section (page load) and the very last (Contact),
 * decaying to 0 (settled/ambient) by ENERGY_SETTLE_INDEX in between — the
 * "accentuate on load, settle while scrolling, accentuate again at contact"
 * shape the design asked for. Derived entirely from the section index
 * useActiveSection already tracks, so this adds no new scroll listener.
 */
function getScrollEnergy(activeIndex: number, sectionCount: number): number {
  if (sectionCount === 0) return 0;
  if (activeIndex === 0 || activeIndex === sectionCount - 1) return 1;
  if (activeIndex >= ENERGY_SETTLE_INDEX) return 0;
  return 1 - activeIndex / ENERGY_SETTLE_INDEX;
}

/**
 * Ambient decorative circuit-board layer for the public landing page only —
 * mounted from app/page.tsx, never from app/layout.tsx or app/admin/**.
 * Each cluster is its own small SVG, CSS-anchored near a true viewport edge
 * (see circuitData.ts) rather than a slice of one page-spanning canvas, so
 * it never reads as overlapping the centered content column regardless of
 * viewport width. Pure CSS motion (draw-in, connect/retract, traveling
 * glint); reactivity is IntersectionObserver-driven (useActiveSection), no
 * scroll listener.
 */
export function CircuitBoard() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { activeIndex, sectionCount } = useActiveSection();
  const activeClusterIndex = activeIndex % CIRCUIT_CLUSTERS.length;
  const energy = getScrollEnergy(activeIndex, sectionCount);

  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timeout = setTimeout(() => setHasEntered(true), ENTRANCE_COMPLETE_MS);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  const rootStyle = {
    "--circuit-energy": energy,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={rootStyle}
    >
      {CIRCUIT_CLUSTERS.map((cluster, clusterIndex) => {
        const isActiveCluster = clusterIndex === activeClusterIndex;

        return (
          <svg
            key={cluster.id}
            viewBox={cluster.viewBox}
            preserveAspectRatio="xMidYMid meet"
            className={cx(
              "circuit-pocket absolute",
              cluster.variant === "top"
                ? "circuit-pocket--top"
                : "circuit-pocket--bottom",
            )}
            style={{
              ...cluster.position,
              aspectRatio: cluster.aspectRatio,
            }}
          >
            <g
              className={cx(
                "circuit-cluster",
                isActiveCluster && "circuit-cluster--lit",
              )}
            >
              {cluster.traces.map((trace) => {
                const showGlint =
                  hasEntered &&
                  isActiveCluster &&
                  trace.hasGlint &&
                  !prefersReducedMotion;

                return (
                  <g key={trace.d}>
                    <path
                      d={trace.d}
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth={trace.strokeWidth}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={
                        prefersReducedMotion
                          ? 0
                          : !hasEntered
                            ? 1
                            : isActiveCluster
                              ? 0
                              : RETRACT_OFFSET
                      }
                      className={cx(
                        !prefersReducedMotion &&
                          !hasEntered &&
                          "animate-circuit-draw",
                        !prefersReducedMotion && hasEntered && "circuit-trace",
                      )}
                      style={
                        !prefersReducedMotion && !hasEntered
                          ? {
                              animationDelay: `${FIRST_DRAW_DELAY_MS + clusterIndex * CLUSTER_DELAY_STEP_MS}ms`,
                            }
                          : undefined
                      }
                    />
                    {showGlint && (
                      <circle
                        r={2.5}
                        fill="var(--color-accent)"
                        className="animate-circuit-travel"
                        style={{
                          offsetPath: `path('${trace.d}')`,
                          animationDelay: `${TRACE_TRANSITION_MS}ms`,
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
          </svg>
        );
      })}
    </div>
  );
}
