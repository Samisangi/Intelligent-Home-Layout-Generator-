import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProjects } from "../api/project.api";
import { useAuthStore } from "../store/authStore";

const statusColor = {
  draft: "bg-gray-100 text-gray-700",
  generated: "bg-blue-100 text-blue-700",
  finalized: "bg-emerald-100 text-emerald-700",
};

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMyProjects();
        setProjects(data.data.projects);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Welcome{user?.name ? `, ${user.name}` : ""}</h1>
          <p className="text-sm text-gray-500">Your house layout projects</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/projects/new")}
            className="bg-slate-900 text-white px-4 py-2 rounded"
          >
            + New Project
          </button>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="border px-4 py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading projects...</p>}

      {!loading && projects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-3">No projects yet.</p>
          <button
            onClick={() => navigate("/projects/new")}
            className="bg-slate-900 text-white px-4 py-2 rounded"
          >
            Create your first project
          </button>
        </div>
      )}

      <div className="grid gap-3">
        {projects.map((p) => (
          <div
            key={p._id}
            onClick={() => navigate(`/projects/${p._id}`)}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-gray-400">
                Updated {new Date(p.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColor[p.status] || statusColor.draft}`}>
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;