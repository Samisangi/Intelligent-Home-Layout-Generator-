import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { generateProjectLayouts, getProjectLayouts } from "../controllers/layout.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/:projectId/generate", generateProjectLayouts);
router.get("/:projectId", getProjectLayouts);

export default router;