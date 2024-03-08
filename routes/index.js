import express from "express";
const router = express.Router();

import postRoutes from "./posts.js";
import userRoutes from "./users.js";
import categoryRoutes from "./category.js";
import commentRoutes from "./comment.js";

router.use("/posts", postRoutes);
router.use("/users", userRoutes);
router.use("/category", categoryRoutes);
router.use("/comments", commentRoutes);

export default router;
