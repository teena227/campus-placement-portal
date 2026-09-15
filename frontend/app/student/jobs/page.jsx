"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function StudentJobs() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
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

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchBranch =
      filterBranch === "All" || job.branch.includes(filterBranch);
    return matchSearch && matchBranch;
  });

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Loading jobs...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Browse Jobs 💼</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">{filteredJobs.length} jobs available</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by title, company, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:border-gray-600 dark:bg-gray-800"
          />
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="All">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-2 text-center py-16 text-gray-400 dark:text-gray-500">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg">No jobs found</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition dark:bg-gray-800">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg dark:text-gray-100">{job.title}</h3>
                    <p className="text-blue-600 font-medium dark:text-blue-400">{job.company}</p>
                  </div>
                  <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 px-3 py-1 rounded-full font-semibold dark:text-green-400">
                    {job.stipend}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3 dark:text-gray-400">
                  <span>📍 {job.location}</span>
                  <span>🎓 Min CGPA: {job.minCGPA}</span>
                  <span>📅 {new Date(job.deadline).toLocaleDateString()}</span>
                  {new Date() > new Date(job.deadline) && (
                    <span className="text-xs bg-red-100 dark:bg-red-900/40 text-red-600 px-3 py-1 rounded-full font-medium dark:text-red-400">
                      Deadline Passed
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.branch.map((b, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-400">
                      {b}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => router.push(`/student/jobs/${job._id}`)}
                  className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  View & Apply →
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}