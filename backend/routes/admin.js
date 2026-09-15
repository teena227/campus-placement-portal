const express = require("express");
const router = express.Router();
const { getAnalytics, exportCSV } = require("../controllers/adminController");
const { protect, requireRole } = require("../middleware/auth");

router.get(
  "/analytics",
  protect,
  requireRole("admin", "recruiter"),
  getAnalytics
);

router.get(
  "/export-csv",
  protect,
  requireRole("admin"),
  exportCSV
);

module.exports = router;