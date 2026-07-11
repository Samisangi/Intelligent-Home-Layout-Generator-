import axiosInstance from "./axiosInstance";

export const generateLayouts = (projectId) =>
  axiosInstance.post(`/layouts/${projectId}/generate`);
export const getLayouts = (projectId) => axiosInstance.get(`/layouts/${projectId}`);export const saveLayoutEdits = (projectId, layoutId, rooms) =>
  axiosInstance.put(`/layouts/${projectId}/${layoutId}`, { rooms });
export const rescoreLayout = (projectId, layoutId) =>
  axiosInstance.post(`/layouts/${projectId}/${layoutId}/rescore`);