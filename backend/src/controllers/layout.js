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