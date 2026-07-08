import Plot from "../models/Plot.model.js";
import { checkProjectOwnership } from "../utils/checkProjectOwnership.js";
import { success, failure } from "../utils/apiResponse.js";

// @route POST /api/plots/:projectId
export const createOrUpdatePlot = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await checkProjectOwnership(projectId, req.user.id);
    if (!project) return failure(res, 404, "Project not found");

    const { shape, width, depth, roadFacing, setback } = req.body;

    // Basic sanity checks (v1: rectangle/square only, per MVP scope)
    if (!["rectangle", "square"].includes(shape)) {
      return failure(res, 400, "Only rectangle/square plots supported in v1");
    }
    if (width <= 0 || depth <= 0) {
      return failure(res, 400, "Width and depth must be positive numbers");
    }

    // Upsert: one plot per project
    const plot = await Plot.findOneAndUpdate(
      { project: projectId },
      { project: projectId, shape, width, depth, roadFacing, setback },
      { new: true, upsert: true, runValidators: true }
    );

    return success(res, 200, "Plot saved", { plot });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/plots/:projectId
export const getPlot = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await checkProjectOwnership(projectId, req.user.id);
    if (!project) return failure(res, 404, "Project not found");

    const plot = await Plot.findOne({ project: projectId });
    if (!plot) return failure(res, 404, "Plot not set for this project");

    return success(res, 200, "Plot fetched", { plot });
  } catch (err) {
    next(err);
  }
};