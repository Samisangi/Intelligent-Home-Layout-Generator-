import Plot from "../models/Plot.model.js";
import Requirement from "../models/Requirement.model.js";
import Layout from "../models/Layout.model.js";
import { generateLayouts } from "../services/layoutEngine/index.js";
import { checkProjectOwnership } from "../utils/checkProjectOwnership.js";
import { success, failure } from "../utils/apiResponse.js";

// @route POST /api/layouts/:projectId/generate
export const generateProjectLayouts = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await checkProjectOwnership(projectId, req.user.id);
    if (!project) return failure(res, 404, "Project not found");

    const plot = await Plot.findOne({ project: projectId });
    const requirement = await Requirement.findOne({ project: projectId });

    if (!plot) return failure(res, 400, "Set plot information before generating layouts");
    if (!requirement) return failure(res, 400, "Set house requirements before generating layouts");

    let layouts;
    try {
      layouts = generateLayouts(plot, requirement);
    } catch (engineErr) {
      // Feasibility or engine errors are user-facing, not server errors
      return failure(res, 422, engineErr.message);
    }

    // Replace any previous layouts for this project
    await Layout.deleteMany({ project: projectId });
    const saved = await Layout.insertMany(
      layouts.map((l) => ({ project: projectId, ...l }))
    );

    project.status = "generated";
    await project.save();

    return success(res, 201, "Layouts generated", { layouts: saved });
  } catch (err) {
    next(err);
  }
};
// @route PUT /api/layouts/:projectId/:layoutId
export const updateLayoutRooms = async (req, res, next) => {
  try {
    const { projectId, layoutId } = req.params;
    const project = await checkProjectOwnership(projectId, req.user.id);
    if (!project) return failure(res, 404, "Project not found");

    const { rooms } = req.body;
    if (!Array.isArray(rooms) || rooms.length === 0) {
      return failure(res, 400, "Rooms array is required");
    }

    // Basic overlap re-check on manual edits — reuse existing constraint logic
    const overlapCheck = checkManualOverlap(rooms);
    if (overlapCheck) {
      return failure(res, 422, `Manual edit causes overlap between ${overlapCheck[0]} and ${overlapCheck[1]}`);
    }

    const layout = await Layout.findOneAndUpdate(
      { _id: layoutId, project: projectId },
      { rooms },
      { new: true }
    );
    if (!layout) return failure(res, 404, "Layout not found");

    return success(res, 200, "Layout updated", { layout });
  } catch (err) {
    next(err);
  }
};

// Lightweight overlap check that also identifies WHICH rooms collide,
// so the frontend can highlight the offending pair to the user.
function checkManualOverlap(rooms) {
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const a = rooms[i], b = rooms[j];
      const overlapX = a.x < b.x + b.width && b.x < a.x + a.width;
      const overlapY = a.y < b.y + b.height && b.y < a.y + a.height;
      if (overlapX && overlapY) return [a.type, b.type];
    }
  }
  return null;
}

// @route GET /api/layouts/:projectId
export const getProjectLayouts = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await checkProjectOwnership(projectId, req.user.id);
    if (!project) return failure(res, 404, "Project not found");

    const layouts = await Layout.find({ project: projectId }).sort({ "score.total": -1 });
    return success(res, 200, "Layouts fetched", { layouts });
  } catch (err) {
    next(err);
  }
};