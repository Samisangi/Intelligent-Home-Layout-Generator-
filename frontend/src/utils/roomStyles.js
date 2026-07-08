// Maps room type prefixes to fill colors — mirrors the reference mockup
// (bedrooms = tan, bathrooms = blue, kitchen = green, garden = green, etc.)
export const getRoomStyle = (type) => {
  if (type.startsWith("bedroom") || type === "masterBedroom")
    return { fill: "#f3d9b1", stroke: "#c9a876" };
  if (type.startsWith("bathroom")) return { fill: "#bcdff1", stroke: "#7fb8d9" };
  if (type === "kitchen") return { fill: "#c9dfc1", stroke: "#8fb582" };
  if (type === "livingRoom") return { fill: "#fdf6ec", stroke: "#d8cbb0" };
  if (type === "dining") return { fill: "#fdf0dd", stroke: "#e0c79a" };
  if (type === "parking") return { fill: "#d9d9d9", stroke: "#a6a6a6" };
  if (type === "foyer") return { fill: "#e8ded0", stroke: "#c2b49c" };
  if (type === "utility" || type === "store") return { fill: "#e0e0e0", stroke: "#b0b0b0" };
  if (type === "prayerRoom" || type === "studyRoom") return { fill: "#e6d9f2", stroke: "#c3a8dd" };
  return { fill: "#eeeeee", stroke: "#cccccc" };
};

// Turns "bedroom2" -> "Bedroom 2", "masterBedroom" -> "Master Bedroom"
export const formatRoomLabel = (type) => {
  const withSpaces = type.replace(/([A-Z])/g, " $1").replace(/(\d+)/, " $1");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).trim();
};