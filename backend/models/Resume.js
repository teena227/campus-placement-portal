const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
       originalName: {
  type: String,
  default: "resume.pdf",
},
    extractedText: {
      type: String,
      default: "",
    },
 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);