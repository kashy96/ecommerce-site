import express from "express";
import { addItemToCart, viewCart, removeFromCart, emptyCart } from "../controllers/cartController.js";

const router = express.Router();
// add a product to the cart for userId=id
router.post("/", addItemToCart);
// get cart details of userId=id
router.get("/:id", viewCart);
// delete productId(passed in body) for userId=id
router.delete("/:id", removeFromCart);
// empty entire cart of userId=id
router.delete("/empty-cart/:id", emptyCart);

export default router;
