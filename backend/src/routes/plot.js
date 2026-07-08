import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createOrUpdatePlot, getPlot } from "../controllers/plot.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/:projectId", createOrUpdatePlot);
router.get("/:projectId", getPlot);

export default router;