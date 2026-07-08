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
  const { frontRatio = 0.18, publicRatio = 0.42, startOrientation = "vertical" } = options;

  const frontRooms = rooms.filter((r) => r.zone === "front");
  const publicRooms = rooms.filter((r) => r.zone === "public");
  const privateRooms = rooms.filter((r) => r.zone === "private");

  const frontHeight = usableRect.height * frontRatio;
  const publicHeight = usableRect.height * publicRatio;
  const privateHeight = usableRect.height - frontHeight - publicHeight;

  const frontRect = { x: usableRect.x, y: usableRect.y, width: usableRect.width, height: frontHeight };
  const publicRect = { x: usableRect.x, y: usableRect.y + frontHeight, width: usableRect.width, height: publicHeight };
  const privateRect = {
    x: usableRect.x,
    y: usableRect.y + frontHeight + publicHeight,
    width: usableRect.width,
    height: privateHeight,
  };

  return [
    ...partitionRect(frontRect, frontRooms, startOrientation),
    ...partitionRect(publicRect, publicRooms, startOrientation),
    ...partitionRect(privateRect, privateRooms, startOrientation),
  ];
};