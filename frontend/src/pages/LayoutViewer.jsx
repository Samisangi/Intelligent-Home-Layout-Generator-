import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../api/project.api";
import { generateLayouts, saveLayoutEdits } from "../api/layout.api";
import FloorPlanCanvas from "../components/canvas/FloorPlanCanvas";
import RoomControls from "../components/canvas/RoomControls";
import { useHistory } from "../hooks/useHistory";
import { exportStageAsPNG, exportStageAsPDF } from "../utils/exportCanvas";

const LayoutViewer = () => {
  const { id: projectId } = useParams();
  const [plot, setPlot] = useState(null);
  const [allLayouts, setAllLayouts] = useState([]);
  const [activeVariant, setActiveVariant] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [saveError, setSaveError] = useState("");
  const stageRef = useRef(null);

  // History tracks ONLY the active variant's rooms array
  const { state: rooms, set: setRooms, reset: resetHistory, undo, redo, canUndo, canRedo } = useHistory([]);

  const loadData = async () => {
    const { data } = await getProjectById(projectId);
    setPlot(data.data.plot);
    if (data.data.layouts?.length) {
      setAllLayouts(data.data.layouts);
      const first = data.data.layouts[0];
      setActiveVariant(first.variant);
      resetHistory(first.rooms);
    }
  };

  useEffect(() => { loadData(); }, [projectId]);

  const switchVariant = (layout) => {
    setActiveVariant(layout.variant);
    setSelectedIndex(null);
    resetHistory(layout.rooms); // fresh history per variant, no cross-contamination
  };

  const handleAddRoom = (newRoom) => {
    setRooms([...rooms, newRoom]);
  };

  const handleDeleteRoom = () => {
    if (selectedIndex === null) return;
    const newRooms = rooms.filter((_, idx) => idx !== selectedIndex);
    setRooms(newRooms);
    setSelectedIndex(null);
  };

  const activeLayout = allLayouts.find((l) => l.variant === activeVariant);

  const handleSaveEdits = async () => {
    setSaveError("");
    try {
      await saveLayoutEdits(projectId, activeLayout._id, rooms);
      setAllLayouts((prev) =>
        prev.map((l) => (l.variant === activeVariant ? { ...l, rooms } : l))
      );
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save — check for overlapping rooms");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Floor Plan</h1>
        <button
          onClick={async () => {
            const { data } = await generateLayouts(projectId);
            setAllLayouts(data.data.layouts);
            switchVariant(data.data.layouts[0]);
          }}
          className="bg-slate-900 text-white px-4 py-2 rounded"
        >
          Regenerate Layouts
        </button>
      </div>

      {allLayouts.length > 0 && (
        <div className="flex gap-2 mb-4">
          {allLayouts.map((l) => (
            <button
              key={l.variant}
              onClick={() => switchVariant(l)}
              className={`px-3 py-1 rounded border ${
                activeVariant === l.variant ? "bg-slate-900 text-white" : "bg-white"
              }`}
            >
              Layout {l.variant} — {l.score.total}%
            </button>
          ))}
        </div>
      )}

      {saveError && <p className="text-red-500 mb-2 text-sm">{saveError}</p>}

      {plot && rooms.length > 0 && (
        <div className="flex gap-6">
          <div>
            <RoomControls
              rooms={rooms}
              plot={plot}
              onAdd={handleAddRoom}
              onDelete={handleDeleteRoom}
              selectedIndex={selectedIndex}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
            />
            <FloorPlanCanvas
              ref={stageRef}
              rooms={rooms}
              plot={plot}
              onRoomsChange={setRooms}
              selectedIndex={selectedIndex}
              onSelectRoom={setSelectedIndex}
            />
            <div className="flex gap-2 mt-3">
              <button onClick={handleSaveEdits} className="bg-emerald-600 text-white px-3 py-1.5 rounded text-sm">
                Save Changes
              </button>
              <button onClick={() => exportStageAsPNG(stageRef, `layout-${activeVariant}.png`)} className="bg-slate-700 text-white px-3 py-1.5 rounded text-sm">
                Export PNG
              </button>
              <button onClick={() => exportStageAsPDF(stageRef, `layout-${activeVariant}.pdf`)} className="bg-slate-700 text-white px-3 py-1.5 rounded text-sm">
                Export PDF
              </button>
            </div>
          </div>

          {activeLayout && (
            <div className="bg-white p-4 rounded shadow h-fit">
              <h3 className="font-bold mb-2">Design Insights</h3>
              <p className="text-sm">Area Utilization: {activeLayout.score.areaUtilization}%</p>
              <p className="text-sm">Adjacency Satisfaction: {activeLayout.score.adjacencySatisfaction}%</p>
              <p className="text-sm font-bold mt-2">Overall Score: {activeLayout.score.total}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LayoutViewer;