const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getMonthlySummary, categorizeExpense } = require("../controllers/aiController");

const router = express.Router();

// Generate monthly summary
router.get("/monthly-summary", protect, getMonthlySummary);

// Categorize an expense
router.post("/categorize", protect, categorizeExpense);

module.exports = router;
