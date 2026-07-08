import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../api/project.api";
import { generateLayouts, getLayouts } from "../api/layout.api";
import FloorPlanCanvas from "../components/canvas/FloorPlanCanvas";

const LayoutViewer = () => {
  const { id: projectId } = useParams();
  const [plot, setPlot] = useState(null);
  const [layouts, setLayouts] = useState([]);
  const [activeVariant, setActiveVariant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    const { data } = await getProjectById(projectId);
    setPlot(data.data.plot);
    if (data.data.layouts?.length) {
      setLayouts(data.data.layouts);
      setActiveVariant(data.data.layouts[0].variant);
    }
  };

  useEffect(() => { loadData(); }, [projectId]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await generateLayouts(projectId);
      setLayouts(data.data.layouts);
      setActiveVariant(data.data.layouts[0].variant);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate layouts");
    } finally {
      setLoading(false);
    }
  };

  const activeLayout = layouts.find((l) => l.variant === activeVariant);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Floor Plan</h1>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-slate-900 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Regenerate Layouts"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {layouts.length > 0 && (
        <div className="flex gap-2 mb-4">
          {layouts.map((l) => (
            <button
              key={l.variant}
              onClick={() => setActiveVariant(l.variant)}
              className={`px-3 py-1 rounded border ${
                activeVariant === l.variant ? "bg-slate-900 text-white" : "bg-white"
              }`}
            >
              Layout {l.variant} — {l.score.total}%
            </button>
          ))}
        </div>
      )}

      {activeLayout && plot && (
        <div className="flex gap-6">
          <FloorPlanCanvas rooms={activeLayout.rooms} plot={plot} />
          <div className="bg-white p-4 rounded shadow h-fit">
            <h3 className="font-bold mb-2">Design Insights</h3>
            <p className="text-sm">Area Utilization: {activeLayout.score.areaUtilization}%</p>
            <p className="text-sm">Adjacency Satisfaction: {activeLayout.score.adjacencySatisfaction}%</p>
            <p className="text-sm font-bold mt-2">Overall Score: {activeLayout.score.total}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutViewer;