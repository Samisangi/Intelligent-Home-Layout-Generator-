import { buildRoomList, checkFeasibility } from "./roomSizing.js";
import { zoneAndPartition } from "./gridPartition.js";
import { hasOverlaps } from "./constraints.js";
import { scoreLayout } from "./scoring.js";

/**
 * Generates up to 3 layout variants by varying zone-band ratios and
 * initial split orientation — a cheap way to get meaningfully different
 * layouts without a true combinatorial search.
 */
export const generateLayouts = (plot, requirement) => {
  const usableRect = {
    x: plot.setback.left,
    y: plot.setback.front,
    width: plot.width - plot.setback.left - plot.setback.right,
    height: plot.depth - plot.setback.front - plot.setback.back,
  };

  const rooms = buildRoomList(requirement, plot);
  const feasibility = checkFeasibility(rooms, plot);
  if (!feasibility.feasible) {
    throw new Error(feasibility.message);
  }

  const variantConfigs = [
    { frontRatio: 0.18, publicRatio: 0.42, startOrientation: "vertical" },   // Variant A
    { frontRatio: 0.15, publicRatio: 0.48, startOrientation: "horizontal" }, // Variant B
    { frontRatio: 0.20, publicRatio: 0.38, startOrientation: "vertical" },   // Variant C
  ];
  const labels = ["A", "B", "C"];

  const layouts = variantConfigs.map((config, idx) => {
    const placedRooms = zoneAndPartition(usableRect, rooms, config);

    if (hasOverlaps(placedRooms)) {
      throw new Error(`Variant ${labels[idx]} produced overlapping rooms — engine bug, check partition logic`);
    }

    const score = scoreLayout(placedRooms, plot);

    return {
      variant: labels[idx],
      rooms: placedRooms.map((r) => ({
        type: r.type,
        x: Number(r.x.toFixed(2)),
        y: Number(r.y.toFixed(2)),
        width: Number(r.width.toFixed(2)),
        height: Number(r.height.toFixed(2)),
      })),
      score,
    };
  });

  // Sort best-scoring first, but keep original A/B/C labels for user reference
  return layouts.sort((a, b) => b.score.total - a.score.total);
};