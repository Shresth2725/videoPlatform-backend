import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Try to read token from Authorization header or cookies
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized access - No token provided");
  }

  try {
    // Verify token using ACCESS_TOKEN_SECRET
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user by decoded ID
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "User not found for this token");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    // Differentiate between error types
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid access token");
    }
    throw new ApiError(401, "Authentication failed" + error.message);
  }
});
