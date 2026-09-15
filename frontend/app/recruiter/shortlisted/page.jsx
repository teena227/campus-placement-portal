"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utils/api";

const statusConfig = {
  Shortlisted: { color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300" },
  Interview:   { color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
  Offered:     { color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
};

export default function RecruiterShortlisted() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [applicants, setApplicants] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "recruiter")) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchShortlisted = async () => {
      try {
        const response = await api.get("/applications/all");
        const shortlisted = response.data.filter(
          (a) =>
            a.status === "Shortlisted" ||
            a.status === "Interview" ||
            a.status === "Offered"
        );
        setApplicants(shortlisted);
      } catch (error) {
        console.error("Error fetching shortlisted:", error);
      } finally {
        setFetching(false);
      }
    };
    if (user) fetchShortlisted();
  }, [user]);

  // Export CSV — sirf apni company ka
  const handleExport = async () => {
    try {
      const response = await api.get("/admin/export-csv", {
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${user?.company}_shortlisted.csv`;
      link.click();
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Shortlisted Candidates ⭐
            </h1>
            <p className="text-gray-500 mt-1 dark:text-gray-400">
              {user?.company} — {applicants.length} candidates
            </p>
          </div>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Export CSV 📥
          </button>
        </div>

        {applicants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-16 text-center dark:bg-gray-800">
            <p className="text-6xl mb-4">📋</p>
            <h3 className="text-xl font-bold text-gray-700 mb-2 dark:text-gray-300">
              No Shortlisted Candidates Yet
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto dark:text-gray-500">
              Once TPC Admin shortlists candidates for your company's jobs,
              they will appear here.
            </p>
            <button
              onClick={() => router.push("/recruiter/dashboard")}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden dark:bg-gray-800">
            <table className="w-full">
              <thead className="bg-gray-50 border-b dark:bg-gray-900 dark:border-gray-700">
                <tr>
                  {["Name", "Branch", "CGPA", "Job", "ATS Score", "Status"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applicants.map((a) => (
                  <tr key={a._id} className="border-b last:border-0 hover:bg-gray-50 transition dark:border-gray-700 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 dark:text-gray-100">{a.student?.name}</p>
                      <p className="text-gray-400 text-xs dark:text-gray-500">{a.student?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-400">
                        {a.student?.branch}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                      {a.student?.cgpa}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800 text-sm dark:text-gray-100">{a.job?.title}</p>
                      <p className="text-blue-600 text-xs dark:text-blue-400">{a.job?.company}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className={`h-2 rounded-full ${
                              a.atsScore >= 80 ? "bg-green-500" :
                              a.atsScore >= 60 ? "bg-yellow-500" : "bg-red-400"
                            }`}
                            style={{ width: `${a.atsScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {a.atsScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusConfig[a.status]?.color}`}>
                        {a.status}
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