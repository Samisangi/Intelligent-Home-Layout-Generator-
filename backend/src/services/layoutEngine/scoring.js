import { checkAdjacencies } from "./adjacencyRules.js";

export const scoreLayout = (rooms, plot) => {
  const plotArea = plot.width * plot.depth;
  const usedArea = rooms.reduce((sum, r) => sum + r.width * r.height, 0);
  const areaUtilization = Math.min(usedArea / plotArea, 1);

  const adjacency = checkAdjacencies(rooms);

  // Weighted total: area utilization matters slightly more than adjacency for v1
  const total = areaUtilization * 0.6 + adjacency.ratio * 0.4;

  return {
    areaUtilization: Number((areaUtilization * 100).toFixed(1)),
    adjacencySatisfaction: Number((adjacency.ratio * 100).toFixed(1)),
    total: Number((total * 100).toFixed(1)),
  };
};