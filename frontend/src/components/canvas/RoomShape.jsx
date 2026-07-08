import { Group, Rect, Text } from "react-konva";
import { getRoomStyle, formatRoomLabel } from "../../utils/roomStyles";

const SCALE = 10; // 1 ft = 10px

const RoomShape = ({ room }) => {
  const style = getRoomStyle(room.type);
  const label = formatRoomLabel(room.type);

  const px = room.x * SCALE;
  const py = room.y * SCALE;
  const pw = room.width * SCALE;
  const ph = room.height * SCALE;

  return (
    <Group x={px} y={py}>
      <Rect
        width={pw}
        height={ph}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={2}
      />
      <Text
        text={label}
        width={pw}
        y={ph / 2 - 16}
        align="center"
        fontSize={12}
        fontStyle="bold"
        fill="#333"
      />
      <Text
        text={`${room.width.toFixed(0)}' x ${room.height.toFixed(0)}'`}
        width={pw}
        y={ph / 2}
        align="center"
        fontSize={10}
        fill="#666"
      />
    </Group>
  );
};

export default RoomShape;
export { SCALE };