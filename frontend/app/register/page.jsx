"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    cgpa: "",
    branch: "",
    batch: "",
    company: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    const response = await api.post("/auth/register", formData);
    const { token, role, name, company, branch, batch, cgpa } = response.data;
    login({ token, role, name, company, branch, batch, cgpa });
    if (role === "student") router.push("/student/dashboard");
    else if (role === "admin") router.push("/admin/dashboard");
    else router.push("/recruiter/dashboard");
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 from-blue-50 to-white flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md dark:bg-gray-800">

        <h2 className="text-3xl font-bold text-blue-700 mb-2 text-center dark:text-blue-400">
          Create Account
        </h2>
        <p className="text-gray-500 text-center mb-6 dark:text-gray-400">
          Join the placement portal
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
              Register as
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="student">Student</option>
              <option value="admin">TPC Admin</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Student fields */}
          {formData.role === "student" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
                    CGPA
                  </label>
                  <input
                    type="number"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    placeholder="8.5"
                    step="0.1"
                    min="0"
                    max="10"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
                    Batch
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    placeholder="2026"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
                  Branch
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                </select>
              </div>
            </>
          )}

          {/* Recruiter fields */}
          {formData.role === "recruiter" && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google, Flipkart"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 mt-2"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline dark:text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}