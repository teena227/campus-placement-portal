const Job = require("../models/Job");
const User = require("../models/User");

// GET /api/jobs — get all jobs
const getAllJobs = async (req, res) => {
  try {
    let query = {};

    
    if (req.user.role === "recruiter") {
      query = { postedBy: req.user.userId };
    }

    const jobs = await Job.find(query)
      .populate("postedBy", "name email company")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/jobs/:id — get single job
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email company"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/jobs — create job (admin or recruiter)
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      skills,
      stipend,
      deadline,
      minCGPA,
      branch,
      batch,
    } = req.body;

    // Get poster details
    const poster = await User.findById(req.user.userId);

    const companyName =
      req.user.role === "recruiter" ? poster.company : company;

    const job = await Job.create({
      title,
      company: companyName,
      location,
      description,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()),
      stipend,
      deadline,
      minCGPA,
      branch,
      batch,
      postedBy: req.user.userId,
      companyName,
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/jobs/:id — delete job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (
      req.user.role === "recruiter" &&
      job.postedBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllJobs, getJobById, createJob, deleteJob };