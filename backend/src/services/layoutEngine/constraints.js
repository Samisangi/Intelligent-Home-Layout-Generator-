// Since BSP partitioning is a strict tree split, true overlaps shouldn't
// occur — but we validate anyway as a safety net against future bugs
// (e.g. if partition logic is extended to support polygons later).
export const hasOverlaps = (rooms) => {
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const a = rooms[i];
      const b = rooms[j];
      const overlapX = a.x < b.x + b.width && b.x < a.x + a.width;
      const overlapY = a.y < b.y + b.height && b.y < a.y + a.height;
      if (overlapX && overlapY) return true;
    }
  }
  return false;
};

// v1 note: minimum corridor/circulation width checks are deferred —
// the zone-band approach implicitly leaves walkable space between
// public/private bands. Real circulation-width validation is a v2 item.