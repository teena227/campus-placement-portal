"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";

export default function AdminJobs() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setFetching(false);
      }
    };
    if (user) fetchJobs();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Loading jobs...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Manage Jobs 💼</h1>
            <p className="text-gray-500 mt-1 dark:text-gray-400">{filteredJobs.length} jobs posted</p>
          </div>
          <Link
            href="/admin/jobs/create"
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            + Post New Job
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        <div className="flex flex-col gap-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow dark:text-gray-500 dark:bg-gray-800">
              <p className="text-5xl mb-4">💼</p>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">No jobs posted yet</p>
              <p className="text-sm mt-1">Click "Post New Job" to add one</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-800 text-lg dark:text-gray-100">{job.title}</h3>
                      <span className="bg-green-100 dark:bg-green-900/40 text-green-700 text-xs px-3 py-1 rounded-full font-semibold dark:text-green-400">
                        {job.stipend}
                      </span>
                    </div>
                    <p className="text-blue-600 font-medium mb-2 dark:text-blue-400">{job.company}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3 dark:text-gray-400">
                      <span>📍 {job.location}</span>
                      <span>🎓 Min CGPA: {job.minCGPA}</span>
                      <span>📅 {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Link
                      href="/admin/applicants"
                      className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition text-center dark:bg-purple-900/30"
                    >
                      View Applicants
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition dark:bg-red-900/30 dark:text-red-400"
                    >
                      Delete Job
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}