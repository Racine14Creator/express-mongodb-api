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

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users: users.map((user) => ({
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get public users
export const getPublicUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      message: "Public users retrieved successfully",
      users: users.map((user) => ({
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, error: err });
  }
};

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

// Delete user controller
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const targetUser = await User.findById(id);

    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const requestingUser = req.user;

    const isSelfDeletion =
      requestingUser._id.toString() === targetUser._id.toString();

    // Only admin or superadmin can delete other users, and users can delete themselves
    if (
      !isSelfDeletion &&
      !["admin", "superadmin"].includes(requestingUser.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this user",
      });
    }

    if (
      targetUser.role === "superadmin" &&
      requestingUser.role !== "superadmin" &&
      !isSelfDeletion
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete a superadmin",
      });
    }

    // Protect superadmin can't be delete by other superadmin
    if (
      targetUser.role === "superadmin" &&
      requestingUser.role === "superadmin" &&
      !isSelfDeletion
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete a superadmin",
      });
    }

    // Prevent deletion of the last superadmin
    if (isSelfDeletion && requestingUser.role === "superadmin") {
      const sueradminCount = await User.countDocuments({ role: "superadmin" });

      if (sueradminCount <= 1) {
        return res.status(403).json({
          success: false,
          message: "You cannot delete yourself as the last superadmin",
        });
      }
    }

    // Delete the user

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      user: targetUser,
      message: isSelfDeletion
        ? "Your account has been deleted successfully"
        : "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
