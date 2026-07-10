import { useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import RoomShape, { SCALE } from "./RoomShape";

const FloorPlanCanvas = ({ rooms, plot, onRoomsChange, editable = true }) => {
  const [selectedId, setSelectedId] = useState(null);
  const stageWidth = plot.width * SCALE + 40;
  const stageHeight = plot.depth * SCALE + 40;

  const handleChange = (index, updatedRoom) => {
    const newRooms = [...rooms];
    newRooms[index] = updatedRoom;
    onRoomsChange(newRooms);
  };

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      className="border rounded-lg bg-white"
      onMouseDown={(e) => {
        // Deselect when clicking empty canvas area
        if (e.target === e.target.getStage()) setSelectedId(null);
      }}
    >
      <Layer x={20} y={20}>
        <Rect width={plot.width * SCALE} height={plot.depth * SCALE} stroke="#333" strokeWidth={2} dash={[6, 4]} />
        {rooms.map((room, idx) => (
          <RoomShape
            key={idx}
            room={room}
            plot={plot}
            isSelected={editable && selectedId === idx}
            onSelect={() => editable && setSelectedId(idx)}
            onChange={(updated) => handleChange(idx, updated)}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default FloorPlanCanvas;