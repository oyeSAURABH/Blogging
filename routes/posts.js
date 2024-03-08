import express from "express";
const postRoutes = express.Router();
//controllers
import {
  ceatePost,
  readPost,
  updatePost,
  deletePost,
  readAuditLogs,
} from "../app/controllers/post.controllers.js";
import upload from "../config/multer.js";
import {
  protectRoutesAll,
  protectRoutesSpecific,
  protectRoutesAdmin,
} from "../middleware/protectRoutes.js";
import auditLogMiddleware from "../middleware/auditlogs.middlerware.js";

postRoutes.get("/read", readPost);
postRoutes.get("/auditlogs", protectRoutesAdmin, readAuditLogs);
postRoutes.post(
  "/create",
  protectRoutesAll,
  upload.single("image"),
  ceatePost,
  auditLogMiddleware
);
postRoutes.put(
  "/update/:id",
  protectRoutesSpecific,
  upload.single("image"),
  updatePost,
  auditLogMiddleware
);
postRoutes.delete(
  "/delete/:id",
  protectRoutesSpecific,
  deletePost,
  auditLogMiddleware
);

export default postRoutes;
