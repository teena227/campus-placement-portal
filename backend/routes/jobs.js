const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/", protect, getAllJobs);
router.get("/:id", protect, getJobById);
router.post("/", protect, requireRole("admin", "recruiter"), createJob);
router.delete("/:id", protect, requireRole("admin", "recruiter"), deleteJob);

module.exports = router;