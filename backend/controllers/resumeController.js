const cloudinary = require("cloudinary").v2;
const Resume = require("../models/Resume");

const pdfParse = require("pdf-parse");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Extract text from PDF with error handling
    let extractedText = "";
    try {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text;
    } catch (parseError) {
      console.log("PDF parse warning:", parseError.message);
      extractedText = "";
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: "placement-portal/resumes",
            format: "pdf",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // Save or update in DB
    const resume = await Resume.findOneAndUpdate(
      { student: req.user.userId },
      {
        student: req.user.userId,
        cloudinaryUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        extractedText,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume: {
        cloudinaryUrl: resume.cloudinaryUrl,
        uploadedAt: resume.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ student: req.user.userId });
    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadResume, getMyResume };