import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    user: {
      id: req.user._id,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

export const getAllUsers = async (req, res) => {};

export const updateUserProfile = async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = ["user", "admin", "superadmin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Allowed roles are: user, admin, superadmin",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
