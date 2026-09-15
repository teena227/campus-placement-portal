"use client";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import api from "@/utils/api";

const COLORS = ["#3B82F6", "#EF4444", "#A855F7", "#22C55E"];

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const { darkMode } = useTheme();
  const gridColor = darkMode ? "#374151" : "#E5E7EB";
  const axisColor = darkMode ? "#9CA3AF" : "#6B7280";
  const tooltipStyle = darkMode
    ? { backgroundColor: "#1F2937", border: "1px solid #374151", color: "#F3F4F6" }
    : undefined;
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
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/analytics");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setFetching(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  const pieData = [
    { name: "Shortlisted", value: stats.shortlisted || 0 },
    { name: "Rejected", value: stats.totalApplications - stats.shortlisted - stats.offered || 0 },
    { name: "Offered", value: stats.offered || 0 },
  ];

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Admin Dashboard 📊</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">
            Welcome, {user?.name} — here's the placement overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Jobs", value: stats.totalJobs, color: "text-blue-600 dark:text-blue-400", emoji: "💼" },
            { label: "Total Applications", value: stats.totalApplications, color: "text-purple-600 dark:text-purple-400", emoji: "📋" },
            { label: "Shortlisted", value: stats.shortlisted, color: "text-yellow-600 dark:text-yellow-400", emoji: "⭐" },
            { label: "Offers Given", value: stats.offered, color: "text-green-600 dark:text-green-400", emoji: "🎉" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm dark:text-gray-400">{stat.label}</p>
                <span className="text-2xl">{stat.emoji}</span>
              </div>
              <p className={`text-4xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
            <h3 className="font-bold text-gray-800 mb-4 dark:text-gray-100">Overview</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { name: "Students", value: stats.totalStudents },
                { name: "Jobs", value: stats.totalJobs },
                { name: "Applications", value: stats.totalApplications },
                { name: "Shortlisted", value: stats.shortlisted },
                { name: "Offered", value: stats.offered },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} />
                <YAxis tick={{ fill: axisColor }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
            <h3 className="font-bold text-gray-800 mb-4 dark:text-gray-100">
              Application Status Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/jobs"
            className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition flex items-center gap-4 dark:bg-gray-800">
            <span className="text-4xl">💼</span>
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-100">Manage Jobs</p>
              <p className="text-gray-400 text-sm dark:text-gray-500">Create and manage job postings</p>
            </div>
          </Link>
          <Link href="/admin/applicants"
            className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition flex items-center gap-4 dark:bg-gray-800">
            <span className="text-4xl">👥</span>
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-100">View Applicants</p>
              <p className="text-gray-400 text-sm dark:text-gray-500">Filter, shortlist and export</p>
            </div>
          </Link>
          <div className="bg-gradient-to-b from-blue-600 to-purple-600 rounded-2xl shadow p-6 flex items-center gap-4">
            <span className="text-4xl">🎓</span>
            <div>
              <p className="font-bold text-white">Total Students</p>
              <p className="text-blue-100 text-sm">{stats.totalStudents} registered</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}