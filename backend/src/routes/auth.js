import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  getProfile,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { registerRules, loginRules, validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", registerRules, validate, register);
router.post("/login", loginRules, validate, login);
router.post("/refresh", refresh);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getProfile);

export default router;