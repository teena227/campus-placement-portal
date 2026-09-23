"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function StudentProfile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resume, setResume] = useState(null);
  const [existingResume, setExistingResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get("/resume/my");
        setExistingResume(response.data);
      } catch (error) {
        setExistingResume(null);
      } finally {
        setFetching(false);
      }
    };
    if (user) fetchResume();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed!");
      setResume(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB!");
      setResume(null);
      return;
    }
    setResume(file);
    setUploaded(false);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed!");
      setResume(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB!");
      setResume(null);
      return;
    }
    setResume(file);
    setUploaded(false);
    setError("");
  };

  const handleUpload = async () => {
    if (!resume) {
      setError("Please select a resume first.");
      return;
    }
    setUploading(true);
    setError("");
    setUploaded(false);
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      const response = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setExistingResume(response.data.resume);
      setUploaded(true);
      setResume(null);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setResume(null);
    setError("");
    const input = document.getElementById("resumeInput");
    if (input) input.value = "";
  };

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Profile</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">Manage your profile and resume</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 dark:bg-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{user?.name}</h2>
              <p className="text-blue-600 text-sm font-medium capitalize dark:text-blue-400">{user?.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Branch", value: user?.branch || "Not set" },
              { label: "Batch", value: user?.batch || "Not set" },
              { label: "CGPA", value: user?.cgpa || "Not set" },
              { label: "Status", value: "Active" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 dark:bg-gray-900">
                <p className="text-xs text-gray-400 mb-1 dark:text-gray-500">{item.label}</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Resume */}
{existingResume && !uploaded && (
  <div className="bg-white rounded-2xl shadow p-6 mb-6 dark:bg-gray-800">
    <h3 className="font-bold text-gray-800 text-lg mb-3 dark:text-gray-100">
      Current Resume
    </h3>

    <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3 dark:bg-green-900/30">

      <div className="flex items-center gap-3">
        <span className="text-2xl">📄</span>

        <div>
          <p className="font-medium text-gray-800 text-sm dark:text-gray-100">
            Resume uploaded ✅
          </p>

          <p className="text-gray-400 text-xs dark:text-gray-500">
            Last updated:{" "}
            {existingResume.updatedAt
              ? new Date(existingResume.updatedAt).toLocaleDateString()
              : existingResume.uploadedAt
              ? new Date(existingResume.uploadedAt).toLocaleDateString()
              : "Recently uploaded"}
          </p>
        </div>
      </div>

   <button
  type="button"
  onClick={async () => {
    try {
      const response = await api.get("/resume/view", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error("Error viewing resume:", error);
      alert("Unable to open resume");
    }
  }}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
>
  View Resume
</button>

    </div>
  </div>
)}

        {/* Upload Resume */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 dark:bg-gray-800">
          <h3 className="font-bold text-gray-800 text-lg mb-4 dark:text-gray-100">
            {existingResume ? "Update Resume" : "Upload Resume"}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("resumeInput").click()}
            className={
              dragOver
                ? "border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                : "border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }
          >
            <p className="text-5xl mb-3">📂</p>
            <p className="text-gray-600 font-medium dark:text-gray-400">
              {resume ? resume.name : "Drag PDF here or click to upload"}
            </p>
            <p className="text-gray-400 text-sm mt-1 dark:text-gray-500">Only PDF files — Max 5MB</p>
            <input
              id="resumeInput"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {resume && !uploaded && (
            <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 dark:bg-blue-900/30">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm dark:text-gray-100">{resume.name}</p>
                  <p className="text-gray-400 text-xs dark:text-gray-500">{(resume.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          )}

          {resume && !uploaded && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          )}

          {uploaded && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-4 text-center dark:bg-green-900/30 dark:border-green-800">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-green-700 font-semibold dark:text-green-400">Resume uploaded successfully!</p>
              <p className="text-green-500 dark:text-green-400 text-sm mt-1">
                Now apply to jobs and check your ATS score
              </p>
            </div>
          )}
        </div>

        {/* ATS Tips */}
        <div className="bg-gradient-to-b from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-3">Resume Tips for ATS</h3>
          <ul className="flex flex-col gap-2 text-sm text-purple-100">
            <li>✓ Add keywords from job description in your resume</li>
            <li>✓ Use simple formatting — avoid tables</li>
            <li>✓ Clearly mention your skills section</li>
            <li>✓ Always upload in PDF format</li>
          </ul>
        </div>

      </div>
    </div>
  );
}