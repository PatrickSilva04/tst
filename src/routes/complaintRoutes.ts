const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utils/auth");
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint
} = require("../controllers/complaintController");

// All complaint routes require authentication
router.post("/complaints", authenticateToken, createComplaint);
router.get("/complaints", authenticateToken, getComplaints);
router.get("/complaints/:id", authenticateToken, getComplaintById);
router.put("/complaints/:id", authenticateToken, updateComplaint);

module.exports = router;

