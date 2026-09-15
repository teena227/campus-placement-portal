const Application = require("../models/Application");
const Resume = require("../models/Resume");
const Job = require("../models/Job");

// Calculate ATS score
const calculateATS = (resumeText, job) => {
  if (!resumeText) return 0;

  const text = resumeText.toLowerCase();

  // ── Helper functions ──
  const tokenize = (str) =>
    str.toLowerCase().match(/\b[a-z][a-z0-9+#.]*\b/g) || [];

  const computeTF = (tokens) => {
    const tf = {};
    tokens.forEach((t) => (tf[t] = (tf[t] || 0) + 1));
    Object.keys(tf).forEach((t) => (tf[t] /= tokens.length));
    return tf;
  };

  const cosineSimilarity = (vecA, vecB) => {
    const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    let dot = 0, magA = 0, magB = 0;
    keys.forEach((k) => {
      const a = vecA[k] || 0;
      const b = vecB[k] || 0;
      dot += a * b;
      magA += a * a;
      magB += b * b;
    });
    return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
  };

  // ── 1. TF-IDF Cosine Similarity (40% weight) ──
  const resumeTokens = tokenize(resumeText);
  const jdText = `${job.title} ${job.description || ""} ${job.skills.join(" ")}`;
  const jdTokens = tokenize(jdText);

  const resumeTF = computeTF(resumeTokens);
  const jdTF = computeTF(jdTokens);
  const cosineSim = cosineSimilarity(resumeTF, jdTF);
  const similarityScore = Math.round(cosineSim * 100 * 0.4);

  // ── 2. Skills Match (30% weight) ──
  const skills = job.skills.map((s) => s.toLowerCase());
  let skillMatched = 0;

  skills.forEach((skill) => {
    if (text.includes(skill)) {
      skillMatched += 1;
    } else if (
      text.split(/\s+/).some(
        (word) => word.includes(skill) || skill.includes(word)
      )
    ) {
      skillMatched += 0.5;
    }
  });

  const skillScore =
    skills.length > 0
      ? Math.round((skillMatched / skills.length) * 30)
      : 0;

  // ── 3. Experience Keywords (15% weight) ──
  const expKeywords = [
    "experience", "worked", "developed", "built",
    "designed", "implemented", "managed", "led",
    "created", "intern", "project", "deployed",
  ];
  const expMatched = expKeywords.filter((k) => text.includes(k)).length;
  const expScore = Math.round((expMatched / expKeywords.length) * 15);

  // ── 4. Education Keywords (10% weight) ──
  const eduKeywords = [
    "b.tech", "btech", "bachelor", "engineering",
    "computer science", "cse", "it", "cgpa",
    "gpa", "university", "college",
  ];
  const eduMatched = eduKeywords.filter((k) => text.includes(k)).length;
  const eduScore = Math.round((eduMatched / eduKeywords.length) * 10);

  // ── 5. Action Words (5% weight) ──
  const actionWords = [
    "achieved", "improved", "reduced", "increased",
    "launched", "optimized", "automated", "integrated",
    "tested", "debugged", "collaborated", "contributed",
  ];
  const actionMatched = actionWords.filter((k) => text.includes(k)).length;
  const actionScore = Math.round(Math.min(actionMatched / 5, 1) * 5);

  // ── Final Score ──
  const finalScore =
    similarityScore + skillScore + expScore + eduScore + actionScore;

  return Math.min(Math.max(finalScore, text.length > 100 ? 10 : 0), 100);
};

// POST /api/applications/apply
const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const existing = await Application.findOne({
      student: req.user.userId,
      job: jobId,
    });
    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Deadline check
    const now = new Date();
    const deadline = new Date(job.deadline);
    if (now > deadline) {
      return res.status(400).json({ message: "Application deadline has passed" });
    }

    const resume = await Resume.findOne({ student: req.user.userId });
    const atsScore = resume ? calculateATS(resume.extractedText, job) : 0;

    const application = await Application.create({
      student: req.user.userId,
      job: jobId,
      atsScore,
    });

    res.status(201).json({ message: "Applied successfully", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user.userId,
    })
      .populate("job", "title company location stipend deadline")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllApplications = async (req, res) => {
  try {
    let query = {};

    // Recruiter sirf apni company ke jobs ke applications dekhe
    if (req.user.role === "recruiter") {
      const user = await require("../models/User").findById(req.user.userId);
      const companyJobs = await Job.find({ company: user.company });
      const jobIds = companyJobs.map((j) => j._id);
      query = { job: { $in: jobIds } };
    }

    const applications = await Application.find(query)
      .populate("student", "name email branch batch cgpa")
      .populate("job", "title company")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/applications/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id)
      .populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }


    if (req.user.role === "recruiter") {
      const job = await Job.findById(application.job);
      if (job.postedBy.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    application.status = status;
    await application.save();

    res.json({ message: "Status updated", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/applications/ats-check/:jobId
const checkATS = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const resume = await Resume.findOne({ student: req.user.userId });
    if (!resume) {
      return res.status(404).json({
        message: "Please upload your resume first",
      });
    }

    const atsScore = calculateATS(resume.extractedText, job);
    res.json({ atsScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getAllApplications,
  updateStatus,
  checkATS,
};