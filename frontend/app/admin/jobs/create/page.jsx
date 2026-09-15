"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import api from "@/utils/api";

export default function CreateJob() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    stipend: "",
    deadline: "",
    minCGPA: "",
    batch: "",
    description: "",
    skills: "",
    branch: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBranchToggle = (branch) => {
    setFormData((prev) => ({
      ...prev,
      branch: prev.branch.includes(branch)
        ? prev.branch.filter((b) => b !== branch)
        : [...prev.branch, branch],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Validation
    if (formData.branch.length === 0) {
      setError("Please select at least one branch");
      setSubmitting(false);
      return;
    }

    try {
      await api.post("/jobs", {
        ...formData,
        minCGPA: parseFloat(formData.minCGPA),
        skills: formData.skills.split(",").map((s) => s.trim()),
      });

      setSuccess(true);
      setTimeout(() => router.push("/admin/jobs"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline text-sm mb-2 flex items-center gap-1 dark:text-blue-400"
          >
            ← Back to Jobs
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Post New Job 💼</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">Fill in the details to post a new job</p>
        </div>

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center mb-6 dark:bg-green-900/30 dark:border-green-800">
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-green-700 font-bold text-lg dark:text-green-400">Job Posted Successfully!</p>
            <p className="text-green-500 dark:text-green-400 text-sm mt-1">Redirecting to jobs page...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-5 dark:bg-gray-800">

          {/* Title + Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Software Developer Intern"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Google"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Location + Stipend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Bangalore / Remote"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
                Stipend
              </label>
              <input
                type="text"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="₹50,000/month"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Min CGPA + Batch + Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
                Min CGPA *
              </label>
              <input
                type="number"
                name="minCGPA"
                value={formData.minCGPA}
                onChange={handleChange}
                placeholder="7.5"
                step="0.1"
                min="0"
                max="10"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
                Batch *
              </label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="2025"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
                Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
              Required Skills * (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, Git"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block dark:text-gray-300">
              Eligible Branches *
            </label>
            <div className="flex flex-wrap gap-3">
              {["CSE", "IT", "ECE", "ME", "CE"].map((branch) => (
                <button
                  key={branch}
                  type="button"
                  onClick={() => handleBranchToggle(branch)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition border
                    ${formData.branch.includes(branch)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400"
                    }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities and requirements..."
              required
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || success}
            className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "Posting Job..." : "Post Job"}
          </button>
        </form>

      </div>
    </div>
  );
}