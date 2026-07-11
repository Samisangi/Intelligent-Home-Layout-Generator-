/**
 * Recursively splits a rectangle among a list of rooms, proportional to
 * each room's target area. Alternates split orientation at each recursion
 * level (classic BSP) to avoid long thin slivers.
 *
 * @param {object} rect - { x, y, width, height }
 * @param {array} items - [{ type, area, ...meta }]
 * @param {string} orientation - "vertical" | "horizontal" (axis to split along)
 * @returns {array} items with x, y, width, height assigned
 */
export const partitionRect = (rect, items, orientation = "vertical") => {
  if (items.length === 0) return [];

  if (items.length === 1) {
    return [{ ...items[0], x: rect.x, y: rect.y, width: rect.width, height: rect.height }];
  }

  // Split items into two groups, balancing total area as evenly as possible
  const totalArea = items.reduce((sum, i) => sum + i.area, 0);
  let runningArea = 0;
  let splitIndex = 1;
  let bestDiff = Infinity;

  for (let i = 1; i < items.length; i++) {
    runningArea = items.slice(0, i).reduce((sum, r) => sum + r.area, 0);
    const diff = Math.abs(runningArea - totalArea / 2);
    if (diff < bestDiff) {
      bestDiff = diff;
      splitIndex = i;
    }
  }

  const groupA = items.slice(0, splitIndex);
  const groupB = items.slice(splitIndex);
  const areaA = groupA.reduce((sum, r) => sum + r.area, 0);
  const ratio = areaA / totalArea;

  let rectA, rectB;
  const nextOrientation = orientation === "vertical" ? "horizontal" : "vertical";

  if (orientation === "vertical") {
    // split along width (left/right)
    const widthA = rect.width * ratio;
    rectA = { x: rect.x, y: rect.y, width: widthA, height: rect.height };
    rectB = { x: rect.x + widthA, y: rect.y, width: rect.width - widthA, height: rect.height };
  } else {
    // split along height (top/bottom)
    const heightA = rect.height * ratio;
    rectA = { x: rect.x, y: rect.y, width: rect.width, height: heightA };
    rectB = { x: rect.x, y: rect.y + heightA, width: rect.width, height: rect.height - heightA };
  }

  return [
    ...partitionRect(rectA, groupA, nextOrientation),
    ...partitionRect(rectB, groupB, nextOrientation),
  ];
};

/**
 * Divides the usable plot into 3 horizontal bands (front/public/private)
 * based on road facing, then partitions rooms within each band.
 */
export const zoneAndPartition = (usableRect, rooms, options = {}) => {
  const {
    frontRatio = 0.18,
    publicRatio = 0.42,
    startOrientation = "vertical",
    corridorWidth = 3.5, // ft — standard minimum circulation width (Module 6 constraint)
  } = options;

  const frontRooms = rooms.filter((r) => r.zone === "front");
  const publicRooms = rooms.filter((r) => r.zone === "public");
  const privateRooms = rooms.filter((r) => r.zone === "private");

  // Reserve two corridor strips: front-public and public-private
  const corridorTotal = corridorWidth * 2;
  const usableHeight = usableRect.height - corridorTotal;

  const frontHeight = usableHeight * frontRatio;
  const publicHeight = usableHeight * publicRatio;
  const privateHeight = usableHeight - frontHeight - publicHeight;

  const frontRect = { x: usableRect.x, y: usableRect.y, width: usableRect.width, height: frontHeight };

  const publicRect = {
    x: usableRect.x,
    y: usableRect.y + frontHeight + corridorWidth,
    width: usableRect.width,
    height: publicHeight,
  };

  const privateRect = {
    x: usableRect.x,
    y: usableRect.y + frontHeight + corridorWidth + publicHeight + corridorWidth,
    width: usableRect.width,
    height: privateHeight,
  };

  const placedRooms = [
    ...partitionRect(frontRect, frontRooms, startOrientation),
    ...partitionRect(publicRect, publicRooms, startOrientation),
    ...partitionRect(privateRect, privateRooms, startOrientation),
  ];

  // Return corridor rects too, so the frontend can render them distinctly
  const corridors = [
    { type: "corridor", x: usableRect.x, y: usableRect.y + frontHeight, width: usableRect.width, height: corridorWidth },
    { type: "corridor", x: usableRect.x, y: usableRect.y + frontHeight + corridorWidth + publicHeight, width: usableRect.width, height: corridorWidth },
  ];

  return [...placedRooms, ...corridors];
};