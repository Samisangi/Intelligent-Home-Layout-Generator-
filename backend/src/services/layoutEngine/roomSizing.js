// Base target areas (sq ft) per room type — derived from typical residential
// standards (matches Section 6 Module 4 defaults in the project doc).
export const ROOM_BASE_AREA = {
  masterBedroom: 224,   // 14x16
  bedroom: 168,         // 12x14
  bathroom: 40,         // 8x5
  kitchen: 120,         // 12x10
  livingRoom: { small: 168, medium: 224, large: 288, luxury: 360 },
  dining: 110,          // 11x10
  garagePerCar: 180,    // 10x18 approx per car
  foyer: 36,            // 6x6
  utility: 40,          // 5x8
  prayerRoom: 30,       // 5x6
  studyRoom: 64,        // 8x8
  store: 30,            // 5x6
  balcony: 40,
  laundry: 30,
};

// Minimum viable areas — engine rejects a plot if it can't fit these
export const ROOM_MIN_AREA = {
  masterBedroom: 150,
  bedroom: 100,
  bathroom: 25,
  kitchen: 70,
  livingRoom: 120,
  dining: 60,
  garagePerCar: 140,
};

/**
 * Builds a flat list of rooms to place, each tagged with a zone,
 * based on the saved Requirement + Plot documents.
 */
export const buildRoomList = (requirement, plot) => {
  const rooms = [];

  // --- Private zone ---
  rooms.push({ type: "masterBedroom", zone: "private", area: ROOM_BASE_AREA.masterBedroom });
  for (let i = 2; i <= requirement.bedrooms; i++) {
    rooms.push({ type: `bedroom${i}`, zone: "private", area: ROOM_BASE_AREA.bedroom });
  }
  for (let i = 1; i <= requirement.bathrooms; i++) {
    rooms.push({ type: `bathroom${i}`, zone: "private", area: ROOM_BASE_AREA.bathroom });
  }
  if (requirement.extras?.studyRoom) {
    rooms.push({ type: "studyRoom", zone: "private", area: ROOM_BASE_AREA.studyRoom });
  }

  // --- Public zone ---
  rooms.push({ type: "livingRoom", zone: "public", area: ROOM_BASE_AREA.livingRoom[requirement.livingRoomSize] });
  rooms.push({ type: "kitchen", zone: "public", area: ROOM_BASE_AREA.kitchen });
  rooms.push({ type: "dining", zone: "public", area: ROOM_BASE_AREA.dining });
  if (requirement.extras?.prayerRoom) {
    rooms.push({ type: "prayerRoom", zone: "public", area: ROOM_BASE_AREA.prayerRoom });
  }
  if (requirement.extras?.store) {
    rooms.push({ type: "store", zone: "public", area: ROOM_BASE_AREA.store });
  }
  if (requirement.extras?.laundry) {
    rooms.push({ type: "laundry", zone: "public", area: ROOM_BASE_AREA.laundry });
  }

  // --- Front zone (entry/parking) ---
  rooms.push({ type: "foyer", zone: "front", area: ROOM_BASE_AREA.foyer });
  if (requirement.garageCars > 0) {
    rooms.push({
      type: "parking",
      zone: "front",
      area: ROOM_BASE_AREA.garagePerCar * requirement.garageCars,
    });
  }

  return rooms;
};

/** Quick feasibility check before running the engine */
export const checkFeasibility = (rooms, plot) => {
  const setbackArea =
    plot.width * plot.depth -
    (plot.width - plot.setback.left - plot.setback.right) *
      (plot.depth - plot.setback.front - plot.setback.back);
  const usableArea = plot.width * plot.depth - setbackArea;
  const requiredArea = rooms.reduce((sum, r) => sum + r.area, 0);

  if (requiredArea > usableArea) {
    return {
      feasible: false,
      message: `Requirements need ~${Math.round(requiredArea)} sq ft but only ${Math.round(
        usableArea
      )} sq ft usable after setbacks. Reduce rooms or increase plot size.`,
    };
  }
  return { feasible: true, usableArea, requiredArea };
};