"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";

export default function RecruiterDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    offered: 0,
    totalStudents: 0,
  });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "recruiter")) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/analytics");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setFetching(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Recruiter Dashboard 🏢
          </h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">
            Welcome, {user?.name} — {user?.company}
          </p>
        </div>

        {/* Company Badge */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 flex items-center gap-3 dark:bg-blue-900/30 dark:border-gray-700">
          <span className="text-3xl">🏢</span>
          <div>
            <p className="font-bold text-blue-800 dark:text-blue-300">{user?.company}</p>
            <p className="text-blue-600 text-sm dark:text-blue-400">
              You can only see candidates applied to your company's jobs
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
            <p className="text-gray-500 text-sm mb-1 dark:text-gray-400">Jobs Posted</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.totalJobs}</p>
            <p className="text-gray-400 text-sm mt-1 dark:text-gray-500">Active listings</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
            <p className="text-gray-500 text-sm mb-1 dark:text-gray-400">Total Applicants</p>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{stats.totalApplications}</p>
            <p className="text-gray-400 text-sm mt-1 dark:text-gray-500">Applied to your jobs</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
            <p className="text-gray-500 text-sm mb-1 dark:text-gray-400">Shortlisted</p>
            <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{stats.shortlisted}</p>
            <p className="text-gray-400 text-sm mt-1 dark:text-gray-500">Ready for interview</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
            <p className="text-gray-500 text-sm mb-1 dark:text-gray-400">Offers Given</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">{stats.offered}</p>
            <p className="text-gray-400 text-sm mt-1 dark:text-gray-500">Final selections</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/recruiter/shortlisted"
            className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition flex items-center gap-4 dark:bg-gray-800"
          >
            <span className="text-4xl">⭐</span>
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-100">View Shortlisted</p>
              <p className="text-gray-400 text-sm dark:text-gray-500">
                Check shortlisted candidates for your company
              </p>
            </div>
          </Link>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow p-6 flex items-center gap-4">
            <span className="text-4xl">📊</span>
            <div>
              <p className="font-bold text-white">Conversion Rate</p>
              <p className="text-blue-100 text-sm">
                {stats.totalApplications > 0
                  ? `${Math.round((stats.offered / stats.totalApplications) * 100)}% offers given`
                  : "No applications yet"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}