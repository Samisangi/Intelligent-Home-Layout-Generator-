import { forwardRef } from "react";
import { Stage, Layer, Rect } from "react-konva";
import RoomShape, { SCALE } from "./RoomShape";

const FloorPlanCanvas = forwardRef(
  ({ rooms, plot, onRoomsChange, selectedIndex, onSelectRoom, editable = true }, ref) => {
    const stageWidth = plot.width * SCALE + 40;
    const stageHeight = plot.depth * SCALE + 40;

    const handleChange = (index, updatedRoom) => {
      const newRooms = [...rooms];
      newRooms[index] = updatedRoom;
      onRoomsChange(newRooms);
    };

    return (
      <Stage
        ref={ref}
        width={stageWidth}
        height={stageHeight}
        className="border rounded-lg bg-white"
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) onSelectRoom(null);
        }}
      >
        <Layer x={20} y={20}>
          <Rect width={plot.width * SCALE} height={plot.depth * SCALE} stroke="#333" strokeWidth={2} dash={[6, 4]} />
          {rooms.map((room, idx) => (
            <RoomShape
              key={idx}
              room={room}
              plot={plot}
              isSelected={editable && selectedIndex === idx}
              onSelect={() => editable && onSelectRoom(idx)}
              onChange={(updated) => handleChange(idx, updated)}
            />
          ))}
        </Layer>
      </Stage>
    );
  }
);

export default FloorPlanCanvas;
export { SCALE };