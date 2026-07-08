import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.use(authMiddleware); // all project routes require auth

router.post("/", createProject);
router.get("/", getMyProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;