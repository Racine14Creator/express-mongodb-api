import exp from "express";

import protect from "../middleware/auth.middleware.js";

import { getProfile } from "../controllers/user.controller.js";

const router = exp.Router();

// Protect the route with authentication middleware
router.get("/profile", protect, getProfile);

export default router;
