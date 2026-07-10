import { useRef, useEffect } from "react";
import { Group, Rect, Text, Transformer } from "react-konva";
import { getRoomStyle, formatRoomLabel } from "../../utils/roomStyles";

const SCALE = 10; // 1 ft = 10px
const GRID_FT = 0.5; // snap to nearest 0.5 ft

const snap = (val) => Math.round(val / (GRID_FT * SCALE)) * (GRID_FT * SCALE);

const RoomShape = ({ room, isSelected, onSelect, onChange, plot }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const style = getRoomStyle(room.type);
  const label = formatRoomLabel(room.type);

  const px = room.x * SCALE;
  const py = room.y * SCALE;
  const pw = room.width * SCALE;
  const ph = room.height * SCALE;

  const maxX = plot.width * SCALE;
  const maxY = plot.depth * SCALE;

  const handleDragEnd = (e) => {
    let newX = snap(e.target.x());
    let newY = snap(e.target.y());
    // Clamp within plot boundary
    newX = Math.max(0, Math.min(newX, maxX - pw));
    newY = Math.max(0, Math.min(newY, maxY - ph));
    onChange({ ...room, x: newX / SCALE, y: newY / SCALE });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    const newWidth = snap(node.width() * scaleX);
    const newHeight = snap(node.height() * scaleY);

    onChange({
      ...room,
      x: node.x() / SCALE,
      y: node.y() / SCALE,
      width: newWidth / SCALE,
      height: newHeight / SCALE,
    });
  };

  return (
    <>
      <Group
        x={px}
        y={py}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
      >
        <Rect
          ref={shapeRef}
          width={pw}
          height={ph}
          fill={style.fill}
          stroke={isSelected ? "#2563eb" : style.stroke}
          strokeWidth={isSelected ? 3 : 2}
          onTransformEnd={handleTransformEnd}
        />
        <Text text={label} width={pw} y={ph / 2 - 16} align="center" fontSize={12} fontStyle="bold" fill="#333" listening={false} />
        <Text
          text={`${room.width.toFixed(1)}' x ${room.height.toFixed(1)}'`}
          width={pw} y={ph / 2} align="center" fontSize={10} fill="#666" listening={false}
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // Prevent shrinking below a sane minimum (5ft x 5ft)
            if (newBox.width < 5 * SCALE || newBox.height < 5 * SCALE) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default RoomShape;
export { SCALE };