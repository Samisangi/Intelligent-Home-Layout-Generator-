import { useState } from "react";
import { ADDABLE_ROOM_TYPES } from "../../utils/roomStyles";

const RoomControls = ({ rooms, plot, onAdd, onDelete, selectedIndex, canUndo, canRedo, onUndo, onRedo }) => {
  const [newType, setNewType] = useState(ADDABLE_ROOM_TYPES[0]);

  const handleAdd = () => {
    // Count existing rooms of this base type to auto-number (bedroom2, bedroom3...)
    const existingCount = rooms.filter((r) => r.type.startsWith(newType)).length;
    const label = existingCount > 0 ? `${newType}${existingCount + 1}` : newType;

    // Default placement: top-left corner, small default size, user drags it into place
    onAdd({
      type: label,
      x: 1,
      y: 1,
      width: 10,
      height: 10,
    });
  };

  return (
    <div className="flex flex-wrap gap-2 items-center mb-3">
      <select
        value={newType}
        onChange={(e) => setNewType(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        {ADDABLE_ROOM_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <button onClick={handleAdd} className="bg-slate-700 text-white px-3 py-1 rounded text-sm">
        + Add Room
      </button>
      <button
        onClick={onDelete}
        disabled={selectedIndex === null}
        className="bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-40"
      >
        Delete Selected
      </button>
      <div className="border-l pl-2 flex gap-2">
        <button onClick={onUndo} disabled={!canUndo} className="px-3 py-1 rounded text-sm border disabled:opacity-40">
          ↶ Undo
        </button>
        <button onClick={onRedo} disabled={!canRedo} className="px-3 py-1 rounded text-sm border disabled:opacity-40">
          ↷ Redo
        </button>
      </div>
    </div>
  );
};

export default RoomControls;