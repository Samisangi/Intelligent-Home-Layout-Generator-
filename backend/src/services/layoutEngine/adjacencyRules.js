// Pairs of room-type prefixes that SHOULD be adjacent (share an edge)
export const REQUIRED_ADJACENCIES = [
  ["kitchen", "dining"],
  ["dining", "livingRoom"],
  ["masterBedroom", "bathroom1"],
];

// Returns true if two rects share an edge (touch), with small tolerance
const rectsTouch = (a, b, tolerance = 0.5) => {
  const touchesVertically =
    Math.abs(a.x + a.width - b.x) < tolerance || Math.abs(b.x + b.width - a.x) < tolerance;
  const verticalOverlap = a.y < b.y + b.height && b.y < a.y + a.height;

  const touchesHorizontally =
    Math.abs(a.y + a.height - b.y) < tolerance || Math.abs(b.y + b.height - a.y) < tolerance;
  const horizontalOverlap = a.x < b.x + b.width && b.x < a.x + a.width;

  return (touchesVertically && verticalOverlap) || (touchesHorizontally && horizontalOverlap);
};

export const checkAdjacencies = (placedRooms) => {
  let satisfied = 0;
  const total = REQUIRED_ADJACENCIES.length;

  for (const [typeA, typeB] of REQUIRED_ADJACENCIES) {
    const roomA = placedRooms.find((r) => r.type.startsWith(typeA));
    const roomB = placedRooms.find((r) => r.type.startsWith(typeB));
    if (roomA && roomB && rectsTouch(roomA, roomB)) satisfied++;
  }

  return { satisfied, total, ratio: total === 0 ? 1 : satisfied / total };
};