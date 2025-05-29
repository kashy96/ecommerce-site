import jwt from "jsonwebtoken";
import dotenv from "dotenv"; 
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";

dotenv.config();

export const admin = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies; 

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user || req.user.role !== "admin") {
    return next(new ErrorHandler("Access denied - Admins only", 403));
  }

  next();
});
