"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

const statusConfig = {
  Applied:     { color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",    emoji: "📝" },
  Shortlisted: { color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300", emoji: "⭐" },
  Interview:   { color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300", emoji: "🎯" },
  Rejected:    { color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",      emoji: "❌" },
  Offered:     { color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",  emoji: "🎉" },
};

export default function MyApplications() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/applications/my");
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setFetching(false);
      }
    };
    if (user) fetchApplications();
  }, [user]);

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Loading applications...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Applications 📋</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">{applications.length} applications total</p>
        </div>

        {/* Applications */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-16 text-center dark:bg-gray-800">
            <p className="text-5xl mb-4">📋</p>
            <h3 className="text-xl font-bold text-gray-700 mb-2 dark:text-gray-300">No Applications Yet</h3>
            <p className="text-gray-400 text-sm mb-6 dark:text-gray-500">
              Browse jobs and apply to get started
            </p>
            <button
              onClick={() => router.push("/student/jobs")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden dark:bg-gray-800">
            <table className="w-full">
              <thead className="bg-gray-50 border-b dark:bg-gray-900 dark:border-gray-700">
                <tr>
                  {["Company", "Role", "Applied", "ATS Score", "Status"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b last:border-0 hover:bg-gray-50 transition dark:border-gray-700 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">
                      {app.job?.company}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{app.job?.title}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm dark:text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className={`h-2 rounded-full ${
                              app.atsScore >= 80 ? "bg-green-500" :
                              app.atsScore >= 60 ? "bg-yellow-500" : "bg-red-400"
                            }`}
                            style={{ width: `${app.atsScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {app.atsScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusConfig[app.status]?.color}`}>
                        {statusConfig[app.status]?.emoji} {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}