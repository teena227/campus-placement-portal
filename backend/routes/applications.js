const express = require("express");
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  getAllApplications,
  updateStatus,
  checkATS,
} = require("../controllers/applicationController");
const { protect, requireRole } = require("../middleware/auth");

router.post("/apply", protect, requireRole("student"), applyJob);
router.get("/my", protect, requireRole("student"), getMyApplications);
router.get("/all", protect, requireRole("admin", "recruiter"), getAllApplications);
router.patch("/:id/status", protect, requireRole("admin", "recruiter"), updateStatus);
router.get("/ats-check/:jobId", protect, requireRole("student"), checkATS);

module.exports = router;