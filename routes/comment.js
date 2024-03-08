import express from "express";
const commentRoutes = express.Router();
import { filterComment } from "../middleware/gaaliyaFilter.js";
import { RecaptchaV2 } from "express-recaptcha";
import dotenv from "dotenv";
dotenv.config();

import {
  readComment,
  readAllComment,
  ceateComment,
  approveComment,
  deleteComment,
} from "../app/controllers/comment.controllers.js";
import {
  protectRoutesSpecific,
  protectRoutesAll,
} from "../middleware/protectRoutes.js";

// const RECAPTCHA_SITE_KEY = process.env.siteKeyCaptcha;
// const RECAPTCHA_SECRET_KEY = process.env.secretKeyCaptcha;
const RECAPTCHA_SITE_KEY = "6LdEmoopAAAAAF5xoagy5rgEHI5RQWdmNJYlRg1D";
const RECAPTCHA_SECRET_KEY = "6LdEmoopAAAAAJMN-UBvJBngeKDiZVC1mygfoc1_";

const recaptchaMiddleware = new RecaptchaV2(
  RECAPTCHA_SITE_KEY,
  RECAPTCHA_SECRET_KEY
);
commentRoutes.get("/read/:id", readComment);
commentRoutes.get("/readall/:id", protectRoutesSpecific, readAllComment);
commentRoutes.post(
  "/create/:id",
  protectRoutesAll,
  recaptchaMiddleware.middleware.verify,
  filterComment,
  ceateComment
);
commentRoutes.put("/approve/:id", protectRoutesSpecific, approveComment);
commentRoutes.delete("/remove/:id", protectRoutesSpecific, deleteComment);

export default commentRoutes;
