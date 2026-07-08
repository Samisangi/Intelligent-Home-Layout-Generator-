import Project from "../models/Project.model.js";
import Plot from "../models/Plot.model.js";
import Requirement from "../models/Requirement.model.js";
import Layout from "../models/Layout.model.js";
import { success, failure } from "../utils/apiResponse.js";

// @route POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    const { name } = req.body;
    const project = await Project.create({ owner: req.user.id, name });
    return success(res, 201, "Project created", { project });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/projects
export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ updatedAt: -1 });
    return success(res, 200, "Projects fetched", { projects });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/projects/:id
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) return failure(res, 404, "Project not found");

    const plot = await Plot.findOne({ project: project._id });
    const requirement = await Requirement.findOne({ project: project._id });
    const layouts = await Layout.find({ project: project._id });

    return success(res, 200, "Project fetched", { project, plot, requirement, layouts });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!project) return failure(res, 404, "Project not found");
    return success(res, 200, "Project updated", { project });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/projects/:id
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!project) return failure(res, 404, "Project not found");

    // cascade delete related docs
    await Promise.all([
      Plot.deleteMany({ project: project._id }),
      Requirement.deleteMany({ project: project._id }),
      Layout.deleteMany({ project: project._id }),
    ]);

    return success(res, 200, "Project deleted");
  } catch (err) {
    next(err);
  }
};