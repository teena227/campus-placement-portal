const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "recruiter"],
      default: "student",
    },
    // Student specific fields
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },
    branch: {
      type: String,
      enum: ["CSE", "IT", "ECE", "ME", "CE", ""],
      default: "",
    },
    batch: {
      type: String,
    },
    // Recruiter specific field
    company: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);