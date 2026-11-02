import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Extract the token from the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }

    // Attach the user to the request object
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};
export default protect;
