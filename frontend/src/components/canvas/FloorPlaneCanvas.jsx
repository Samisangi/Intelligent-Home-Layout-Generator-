import { Stage, Layer, Rect } from "react-konva";
import RoomShape, { SCALE } from "./RoomShape";

/**
 * Renders one layout variant as an interactive Konva canvas.
 * plot = { width, depth } in ft, used to draw the outer boundary.
 */
const FloorPlanCanvas = ({ rooms, plot }) => {
  const stageWidth = plot.width * SCALE + 40;
  const stageHeight = plot.depth * SCALE + 40;

  return (
    <Stage width={stageWidth} height={stageHeight} className="border rounded-lg bg-white">
      <Layer x={20} y={20}>
        {/* Plot boundary */}
        <Rect
          width={plot.width * SCALE}
          height={plot.depth * SCALE}
          stroke="#333"
          strokeWidth={2}
          dash={[6, 4]}
        />
        {rooms.map((room, idx) => (
          <RoomShape key={idx} room={room} />
        ))}
      </Layer>
    </Stage>
  );
};

export default FloorPlanCanvas;