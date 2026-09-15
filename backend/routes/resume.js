const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadResume, getMyResume } = require("../controllers/resumeController");
const { protect, requireRole } = require("../middleware/auth");

// Multer — store in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  "/upload",
  protect,
  requireRole("student"),
  upload.single("resume"),
  uploadResume
);

router.get("/my", protect, requireRole("student"), getMyResume);

module.exports = router;