import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, savePlot, saveRequirement } from "../api/project.api";

const NewProject = () => {
  const [step, setStep] = useState(1);
  const [projectId, setProjectId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [plot, setPlot] = useState({
    shape: "rectangle", width: 40, depth: 60, roadFacing: "east",
    setback: { front: 5, back: 3, left: 3, right: 3 },
  });

  const [requirement, setRequirement] = useState({
    bedrooms: 3, bathrooms: 2, kitchenType: "open", livingRoomSize: "large",
    dining: "connected", garageCars: 1, floors: "ground",
    extras: { prayerRoom: false, studyRoom: false, store: false, balcony: false, laundry: false },
    priorities: [],
  });

  const handleCreateProject = async () => {
    setError("");
    try {
      const { data } = await createProject({ name: `Project ${Date.now()}` });
      setProjectId(data.data.project._id);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleSavePlot = async () => {
    setError("");
    try {
      await savePlot(projectId, plot);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save plot");
    }
  };

  const handleSaveRequirement = async () => {
    setError("");
    try {
      await saveRequirement(projectId, requirement);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save requirements");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {step === 1 && (
        <div>
          <h2 className="font-bold text-lg mb-3">Step 1: Create Project</h2>
          <button onClick={handleCreateProject} className="bg-slate-900 text-white px-4 py-2 rounded">
            Create Project
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <h2 className="font-bold text-lg mb-3">Step 2: Plot Information</h2>
          <label className="block text-sm">Width (ft)
            <input type="number" className="w-full border rounded p-2"
              value={plot.width} onChange={(e) => setPlot({ ...plot, width: +e.target.value })} />
          </label>
          <label className="block text-sm">Depth (ft)
            <input type="number" className="w-full border rounded p-2"
              value={plot.depth} onChange={(e) => setPlot({ ...plot, depth: +e.target.value })} />
          </label>
          <label className="block text-sm">Road Facing
            <select className="w-full border rounded p-2"
              value={plot.roadFacing} onChange={(e) => setPlot({ ...plot, roadFacing: e.target.value })}>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
              <option value="corner">Corner</option>
              <option value="dual">Dual Road</option>
            </select>
          </label>
          <button onClick={handleSavePlot} className="bg-slate-900 text-white px-4 py-2 rounded">
            Next: Requirements
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <h2 className="font-bold text-lg mb-3">Step 3: House Requirements</h2>
          <label className="block text-sm">Bedrooms
            <input type="number" min={1} max={10} className="w-full border rounded p-2"
              value={requirement.bedrooms}
              onChange={(e) => setRequirement({ ...requirement, bedrooms: +e.target.value })} />
          </label>
          <label className="block text-sm">Bathrooms
            <input type="number" min={1} className="w-full border rounded p-2"
              value={requirement.bathrooms}
              onChange={(e) => setRequirement({ ...requirement, bathrooms: +e.target.value })} />
          </label>
          <label className="block text-sm">Living Room Size
            <select className="w-full border rounded p-2"
              value={requirement.livingRoomSize}
              onChange={(e) => setRequirement({ ...requirement, livingRoomSize: e.target.value })}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="luxury">Luxury</option>
            </select>
          </label>
          <label className="block text-sm">Garage (cars)
            <input type="number" min={0} className="w-full border rounded p-2"
              value={requirement.garageCars}
              onChange={(e) => setRequirement({ ...requirement, garageCars: +e.target.value })} />
          </label>
          <button onClick={handleSaveRequirement} className="bg-slate-900 text-white px-4 py-2 rounded">
            Generate Layouts
          </button>
        </div>
      )}
    </div>
  );
};

export default NewProject;