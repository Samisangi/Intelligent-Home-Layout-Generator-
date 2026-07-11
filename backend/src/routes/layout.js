import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { generateProjectLayouts, getProjectLayouts } from "../controllers/layout.controller.js";
import { generateProjectLayouts, getProjectLayouts, updateLayoutRooms, rescoreLayout } from "../controllers/layout.controller.js";
// ...
const router = express.Router();

router.use(authMiddleware);

router.post("/:projectId/generate", generateProjectLayouts);
router.post("/:projectId/:layoutId/rescore", rescoreLayout);

router.get("/:projectId", getProjectLayouts);
router.put("/:projectId/:layoutId", updateLayoutRooms);
export default router;