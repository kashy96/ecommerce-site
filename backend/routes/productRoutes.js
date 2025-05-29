import express from "express";
import { product, products, addProduct, dashboardProducts } from "../controllers/productController.js";
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get('/', dashboardProducts);
router.get('/all', products);
router.get('/:slug', product);
// router.get('/all-products', products);
router.post('/add', addProduct);

export default router;
