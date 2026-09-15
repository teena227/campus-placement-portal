"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          api.get("/applications/my"),
          api.get("/jobs"),
        ]);
        setApplications(appsRes.data);
        setJobs(jobsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetching(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const statusConfig = {
    Applied:     { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
    Shortlisted: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" },
    Interview:   { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
    Rejected:    { color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
    Offered:     { color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  };

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">Here's your placement overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
            <p className="text-gray-500 text-sm mb-1 dark:text-gray-400">Jobs Available</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{jobs.length}</p>
            <p className="text-gray-400 text-sm mt-1 dark:text-gray-500">Active listings</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
            <p className="text-gray-500 text-sm mb-1 dark:text-gray-400">Applications Sent</p>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{applications.length}</p>
            <p className="text-gray-400 text-sm mt-1 dark:text-gray-500">
              {applications.filter(a => a.status === "Applied").length} under review
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
            <p className="text-gray-500 text-sm mb-1 dark:text-gray-400">Interviews Scheduled</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
              {applications.filter(a => a.status === "Interview").length}
            </p>
            <p className="text-gray-400 text-sm mt-1 dark:text-gray-500">Good luck!</p>
          </div>
        </div>

        {/* Quick Actions + Recent Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
            <h3 className="font-bold text-gray-800 mb-4 dark:text-gray-100">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <Link href="/student/jobs"
                className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-xl transition dark:bg-blue-900/30 dark:text-blue-400">
                <span className="text-xl">💼</span>
                <span className="font-medium">Browse Jobs</span>
              </Link>
              <Link href="/student/applications"
                className="flex items-center gap-3 bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-xl transition dark:bg-purple-900/30">
                <span className="text-xl">📋</span>
                <span className="font-medium">My Applications</span>
              </Link>
              <Link href="/student/profile"
                className="flex items-center gap-3 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-xl transition dark:bg-green-900/30 dark:text-green-400">
                <span className="text-xl">📄</span>
                <span className="font-medium">Upload Resume</span>
              </Link>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
            <h3 className="font-bold text-gray-800 mb-4 dark:text-gray-100">Recent Applications</h3>
            {applications.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-sm">No applications yet</p>
                <Link href="/student/jobs"
                  className="text-blue-600 text-sm hover:underline mt-1 block dark:text-blue-400">
                  Browse jobs →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {applications.slice(0, 3).map((app) => (
                  <div key={app._id} className="flex items-center justify-between py-2 border-b last:border-0 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{app.job?.company}</p>
                      <p className="text-gray-400 text-sm dark:text-gray-500">{app.job?.title}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusConfig[app.status]?.color}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ATS Banner */}
        <div className="bg-gradient-to-b from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">Upload Your Resume!</h3>
              <p className="text-blue-100 text-sm">
                Check ATS score — see how well your resume matches jobs
              </p>
            </div>
            <Link href="/student/profile"
              className="bg-white text-blue-600 px-5 py-2 rounded-xl font-semibold hover:bg-blue-50 transition dark:bg-gray-800 dark:text-blue-400">
              Upload Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}