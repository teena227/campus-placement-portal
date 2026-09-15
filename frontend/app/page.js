"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "student") router.push("/student/dashboard");
      else if (user.role === "admin") router.push("/admin/dashboard");
      else if (user.role === "recruiter") router.push("/recruiter/dashboard");
    }
  }, [user, loading]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-blue-700 dark:text-blue-400 mb-4">
          Campus Placement Portal
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
          Smart job matching for students. Powerful tools for administrators.
          The best talent for recruiters.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
          <div className="text-4xl mb-3">🎯</div>

          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">
            ATS Matching
          </h3>

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Upload your resume and instantly see how well it matches the job.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
          <div className="text-4xl mb-3">📊</div>

          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">
            Live Tracking
          </h3>

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Track your application status in real time, from Applied to Offer.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
          <div className="text-4xl mb-3">🏫</div>

          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">
            Admin Control
          </h3>

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Powerful dashboard for placement administrators to filter, export,
            and manage applications.
          </p>
        </div>

      </div>
    </main>
  );
}