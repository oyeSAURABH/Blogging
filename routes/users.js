import express from "express";
const userRoutes = express.Router();

import {
  userLogIn,
  userRegister,
  userRead,
  userToggleAdmin,
  userDelete,
  userUpdate,
  sendOtp,
  verifyOtp,
} from "../app/controllers/user.controllers.js";
import validateCredentials from "../middleware/signup.middleware.js";
import { protectRoutesAdmin } from "../middleware/protectRoutes.js";

userRoutes.post("/send-otp", sendOtp);
userRoutes.post("/verify-otp", verifyOtp, validateCredentials, userRegister);

userRoutes.get("/read", userRead);
userRoutes.post("/signin", userLogIn);
// userRoutes.post("/signup", validateCredentials, userRegister);

//protected routes
userRoutes.put("/toggleAdmin/:id", protectRoutesAdmin, userToggleAdmin);
userRoutes.delete("/remove/:id", protectRoutesAdmin, userDelete);
userRoutes.put("/update/:id", protectRoutesAdmin, userUpdate);

export default userRoutes;
