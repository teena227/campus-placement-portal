"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function JobDetail() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [checking, setChecking] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${params.id}`);
        setJob(response.data);
      } catch (error) {
        router.push("/student/jobs");
      } finally {
        setFetching(false);
      }
    };
    if (user) fetchJob();
  }, [user, params.id]);

  const handleCheckATS = async () => {
    setChecking(true);
    try {
      const response = await api.get(`/applications/ats-check/${params.id}`);
      setAtsScore(response.data.atsScore);
    } catch (err) {
      setError(err.response?.data?.message || "Upload your resume first!");
    } finally {
      setChecking(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    setError("");
    try {
      await api.post("/applications/apply", { jobId: params.id });
      setApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply. Try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline text-sm mb-4 flex items-center gap-1 dark:text-blue-400"
        >
          ← Back to Jobs
        </button>

        {/* Job Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 dark:bg-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1 dark:text-gray-100">{job.title}</h1>
              <p className="text-blue-600 font-semibold text-lg dark:text-blue-400">{job.company}</p>
            </div>
            <span className="bg-green-100 dark:bg-green-900/40 text-green-700 px-4 py-2 rounded-xl font-semibold text-sm dark:text-green-400">
              {job.stipend}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4 dark:text-gray-400">
            <span>📍 {job.location}</span>
            <span>🎓 Min CGPA: {job.minCGPA}</span>
            <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
            <span>🎓 Batch: {job.batch}</span>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 mb-2 dark:text-gray-400">Required Skills:</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-2 dark:text-gray-400">Eligible Branches:</p>
            <div className="flex flex-wrap gap-2">
              {job.branch.map((b, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-400">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 dark:bg-gray-800">
          <h3 className="font-bold text-gray-800 text-lg mb-3 dark:text-gray-100">Job Description</h3>
          <p className="text-gray-600 leading-relaxed dark:text-gray-400">{job.description}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {/* ATS Score */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 dark:bg-gray-800">
          <h3 className="font-bold text-gray-800 text-lg mb-2 dark:text-gray-100">Check ATS Score 🎯</h3>
          <p className="text-gray-500 text-sm mb-4 dark:text-gray-400">
            See how well your resume matches this job
          </p>

          {atsScore === null ? (
            <button
              onClick={handleCheckATS}
              disabled={checking}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {checking ? "Analyzing resume..." : "Check ATS Match Score"}
            </button>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">Resume Match</p>
                <p className={`text-2xl font-bold ${atsScore >= 80 ? "text-green-600 dark:text-green-400" :
                    atsScore >= 60 ? "text-yellow-600 dark:text-yellow-400" : "text-red-500 dark:text-red-400"}`}>
                  {atsScore}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3 dark:bg-gray-700">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ${atsScore >= 80 ? "bg-green-500" :
                      atsScore >= 60 ? "bg-yellow-500" : "bg-red-400"}`}
                  style={{ width: `${atsScore}%` }}
                />
              </div>
              <p className={`text-sm font-medium ${atsScore >= 80 ? "text-green-600 dark:text-green-400" :
                  atsScore >= 60 ? "text-yellow-600 dark:text-yellow-400" : "text-red-500 dark:text-red-400"}`}>
                {atsScore >= 80 ? "Great match! You should apply." :
                  atsScore >= 60 ? "Decent match. Consider improving your resume." :
                    "Low match. Update your resume with relevant skills."}
              </p>
            </div>
          )}
        </div>

        {/* Apply Button */}

        {/* Check deadline */}
        {new Date() > new Date(job.deadline) ? (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 py-4 rounded-2xl text-center font-semibold dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            ❌ Application Deadline Passed — {new Date(job.deadline).toLocaleDateString()}
          </div>
        ) : !applied ? (
          <button
            onClick={handleApply}
            disabled={applying}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {applying ? "Submitting Application..." : "Apply Now 🚀"}
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center dark:bg-green-900/30 dark:border-green-800">
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-green-700 font-bold text-lg dark:text-green-400">Application Submitted!</p>
            <p className="text-green-500 dark:text-green-400 text-sm mt-1">Track your status in My Applications</p>
            <button
              onClick={() => router.push("/student/applications")}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              View My Applications
            </button>
          </div>
        )}

      </div>
    </div>
  );
}