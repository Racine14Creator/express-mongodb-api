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
