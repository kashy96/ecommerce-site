import express from "express";
import { createOrder, order, updateOrder, allOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/session/:sessionId", order);
router.patch("/:orderId", updateOrder);
router.get("/", allOrders);

export default router;
