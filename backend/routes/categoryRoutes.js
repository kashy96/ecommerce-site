import express from "express";
import { categories } from "../controllers/categoryController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";

const router = express.Router();
// router.get('/', isAuthenticated, admin, categories);
router.get('/', categories);

export default router;
