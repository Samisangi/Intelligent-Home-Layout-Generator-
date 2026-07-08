import Requirement from "../models/Requirement.model.js";
import { checkProjectOwnership } from "../utils/checkProjectOwnership.js";
import { success, failure } from "../utils/apiResponse.js";

// @route POST /api/requirements/:projectId
export const createOrUpdateRequirement = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await checkProjectOwnership(projectId, req.user.id);
    if (!project) return failure(res, 404, "Project not found");

    const {
      bedrooms, bathrooms, kitchenType, livingRoomSize,
      dining, garageCars, floors, extras, priorities,
    } = req.body;

    if (bedrooms < 1 || bedrooms > 10) {
      return failure(res, 400, "Bedrooms must be between 1 and 10");
    }
    if (bathrooms < 1) {
      return failure(res, 400, "At least 1 bathroom is required");
    }

    const requirement = await Requirement.findOneAndUpdate(
      { project: projectId },
      {
        project: projectId, bedrooms, bathrooms, kitchenType,
        livingRoomSize, dining, garageCars, floors, extras, priorities,
      },
      { new: true, upsert: true, runValidators: true }
    );

    return success(res, 200, "Requirements saved", { requirement });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/requirements/:projectId
export const getRequirement = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await checkProjectOwnership(projectId, req.user.id);
    if (!project) return failure(res, 404, "Project not found");

    const requirement = await Requirement.findOne({ project: projectId });
    if (!requirement) return failure(res, 404, "Requirements not set for this project");

    return success(res, 200, "Requirements fetched", { requirement });
  } catch (err) {
    next(err);
  }
};