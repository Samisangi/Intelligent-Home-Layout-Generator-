import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createOrUpdateRequirement, getRequirement } from "../controllers/requirement.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/:projectId", createOrUpdateRequirement);
router.get("/:projectId", getRequirement);

export default router;