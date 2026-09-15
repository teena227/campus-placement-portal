"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

const statusConfig = {
  Applied:     { color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
  Shortlisted: { color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300" },
  Interview:   { color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
  Rejected:    { color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" },
  Offered:     { color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
};

export default function AdminApplicants() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [applicants, setApplicants] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCGPA, setFilterCGPA] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await api.get("/applications/all");
        setApplicants(response.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setFetching(false);
      }
    };
    if (user) fetchApplicants();
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      setApplicants(applicants.map((a) =>
        a._id === id ? { ...a, status: newStatus } : a
      ));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/admin/export-csv", {
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "applicants.csv";
      link.click();
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const filtered = applicants.filter((a) => {
    const matchBranch = filterBranch === "All" || a.student?.branch === filterBranch;
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    const matchCGPA = filterCGPA === "" || a.student?.cgpa >= parseFloat(filterCGPA);
    const matchSearch =
      a.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.student?.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.job?.company?.toLowerCase().includes(search.toLowerCase());
    return matchBranch && matchStatus && matchCGPA && matchSearch;
  });

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Loading applicants...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Applicants 👥</h1>
            <p className="text-gray-500 mt-1 dark:text-gray-400">{filtered.length} applicants found</p>
          </div>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Export CSV 📥
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 dark:bg-gray-800">
          <input
            type="text"
            placeholder="Search name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
          />
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="All">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="All">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offered">Offered</option>
          </select>
          <input
            type="number"
            placeholder="Min CGPA (e.g. 7.5)"
            value={filterCGPA}
            onChange={(e) => setFilterCGPA(e.target.value)}
            step="0.1"
            min="0"
            max="10"
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto dark:bg-gray-800">
          <table className="w-full">
            <thead className="bg-gray-50 border-b dark:bg-gray-900 dark:border-gray-700">
              <tr>
                {["Name", "Branch", "CGPA", "Job Applied", "ATS Score", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400 dark:text-gray-500">
                    <p className="text-4xl mb-2">🔍</p>
                    <p>No applicants found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
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
                    <td className="px-6 py-4">
                      <select
                        value={a.status}
                        onChange={(e) => handleStatusChange(a._id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 dark:text-gray-100"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Offered">Offered</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}