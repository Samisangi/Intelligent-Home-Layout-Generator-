import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../api/project.api";
import { generateLayouts, getLayouts, saveLayoutEdits } from "../api/layout.api";
import FloorPlanCanvas from "../components/canvas/FloorPlanCanvas";
import { exportStageAsPNG, exportStageAsPDF } from "../utils/exportCanvas";

const LayoutViewer = () => {
  const { id: projectId } = useParams();
  const [plot, setPlot] = useState(null);
  const [layouts, setLayouts] = useState([]);
  const [activeVariant, setActiveVariant] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState("");
  const stageRef = useRef(null);

  const loadData = async () => {
    const { data } = await getProjectById(projectId);
    setPlot(data.data.plot);
    if (data.data.layouts?.length) {
      setLayouts(data.data.layouts);
      setActiveVariant(data.data.layouts[0].variant);
    }
  };

  useEffect(() => { loadData(); }, [projectId]);

  const activeLayout = layouts.find((l) => l.variant === activeVariant);

  const handleRoomsChange = (newRooms) => {
    setLayouts((prev) =>
      prev.map((l) => (l.variant === activeVariant ? { ...l, rooms: newRooms } : l))
    );
    setDirty(true);
  };

  const handleSaveEdits = async () => {
    setSaveError("");
    try {
      await saveLayoutEdits(projectId, activeLayout._id, activeLayout.rooms);
      setDirty(false);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save — check for overlapping rooms");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      {/* ...variant tabs unchanged... */}

      {saveError && <p className="text-red-500 mb-2 text-sm">{saveError}</p>}

      {activeLayout && plot && (
        <div className="flex gap-6">
          <div>
            <FloorPlanCanvas
              ref={stageRef}
              rooms={activeLayout.rooms}
              plot={plot}
              onRoomsChange={handleRoomsChange}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSaveEdits}
                disabled={!dirty}
                className="bg-emerald-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-40"
              >
                {dirty ? "Save Changes" : "Saved"}
              </button>
              <button
                onClick={() => exportStageAsPNG(stageRef, `layout-${activeVariant}.png`)}
                className="bg-slate-700 text-white px-3 py-1.5 rounded text-sm"
              >
                Export PNG
              </button>
              <button
                onClick={() => exportStageAsPDF(stageRef, `layout-${activeVariant}.pdf`)}
                className="bg-slate-700 text-white px-3 py-1.5 rounded text-sm"
              >
                Export PDF
              </button>
            </div>
          </div>
          {/* ...design insights panel unchanged... */}
        </div>
      )}
    </div>
  );
};

export default LayoutViewer;