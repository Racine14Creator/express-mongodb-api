import exp from "express";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

import {
  getProfile,
  updateUserProfile,
  getAllUsers
} from "../controllers/user.controller.js";

const router = exp.Router();

// Protect the route with authentication middleware
router.get("/profile", protect, getProfile);

// Get All users (Admin only)

router.get("/", protect, authorize("admin", "superadmin"), getAllUsers);

// Update Role of the user (Admin only)
router.patch("/:id/role", protect, authorize("superadmin"), updateUserProfile);

export default router;
