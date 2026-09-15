const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

const getAnalytics = async (req, res) => {
  try {
    let jobQuery = {};
    let appQuery = {};

    if (req.user.role === "recruiter") {
      const user = await User.findById(req.user.userId);
      const companyJobs = await Job.find({ company: user.company });
      const jobIds = companyJobs.map((j) => j._id);
      jobQuery = { company: user.company };
      appQuery = { job: { $in: jobIds } };
    }

    const totalJobs = await Job.countDocuments(jobQuery);
    const totalApplications = await Application.countDocuments(appQuery);
    const shortlisted = await Application.countDocuments({
      ...appQuery,
      status: "Shortlisted",
    });
    const offered = await Application.countDocuments({
      ...appQuery,
      status: "Offered",
    });
    const totalStudents = await User.countDocuments({ role: "student" });

    res.json({
      totalJobs,
      totalApplications,
      shortlisted,
      offered,
      totalStudents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const exportCSV = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "recruiter") {
      const user = await User.findById(req.user.userId);
      const companyJobs = await Job.find({ company: user.company });
      const jobIds = companyJobs.map((j) => j._id);
      query = { job: { $in: jobIds } };
    }

    const applications = await Application.find(query)
      .populate("student", "name email branch batch cgpa")
      .populate("job", "title company");

    const headers = [
      "Name", "Email", "Branch", "Batch",
      "CGPA", "Job", "Company", "Status", "ATS Score",
    ];

    const rows = applications.map((a) => [
      a.student?.name || "",
      a.student?.email || "",
      a.student?.branch || "",
      a.student?.batch || "",
      a.student?.cgpa || "",
      a.job?.title || "",
      a.job?.company || "",
      a.status,
      a.atsScore,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=applicants.csv");
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics, exportCSV };