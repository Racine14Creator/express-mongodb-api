export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden, you don't have permission to access this resource",
      });
    }
    next();
  };
};

export const adminDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the admin dashboard.",
  });
};
