import express from "express";
const categoryRoutes = express.Router();

//controllers
import {
  ceateCategory,
  readCategory,
  updateCategory,
  deleteCategory,
} from "../app/controllers/category.controllers.js";
import { protectRoutesAdmin } from "../middleware/protectRoutes.js";

categoryRoutes.get("/read", readCategory);
categoryRoutes.post("/create", protectRoutesAdmin, ceateCategory);
categoryRoutes.put("/update/:id", protectRoutesAdmin, updateCategory);
categoryRoutes.delete("/delete/:id", protectRoutesAdmin, deleteCategory);

export default categoryRoutes;
