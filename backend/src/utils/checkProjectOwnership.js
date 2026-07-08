import Project from "../models/Project.model.js";

// Verifies the project belongs to the requesting user.
// Returns the project doc, or null if not found/not owned.
export const checkProjectOwnership = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  return project;
};