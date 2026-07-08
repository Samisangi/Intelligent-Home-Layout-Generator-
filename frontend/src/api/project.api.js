import axiosInstance from "./axiosInstance";

export const createProject = (payload) => axiosInstance.post("/projects", payload);
export const getMyProjects = () => axiosInstance.get("/projects");
export const getProjectById = (id) => axiosInstance.get(`/projects/${id}`);

export const savePlot = (projectId, payload) => axiosInstance.post(`/plots/${projectId}`, payload);
export const saveRequirement = (projectId, payload) =>
  axiosInstance.post(`/requirements/${projectId}`, payload);