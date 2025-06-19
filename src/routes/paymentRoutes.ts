const express = require("express");
const router = express.Router();
import { authenticateToken } from "../utils/auth";
const {
  processPayment,
  getPayments,
  getPaymentById
} = require("../controllers/paymentController");

// All payment routes require authentication
router.post("/payments", authenticateToken, processPayment);
router.get("/payments", authenticateToken, getPayments);
router.get("/payments/:id", authenticateToken, getPaymentById);

module.exports = router;

