 
  // ****************2nd attempt **********

import React, { useState, useEffect } from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../utils/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const progressData = [
  { task: "Course Completion", progress: 75 },
  { task: "Orders Processing", progress: 50 },
];

function Dashboard() {
  const [showDetails, setShowDetails] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  const [inputPassword, setInputPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockCountdown, setBlockCountdown] = useState(0);

  useEffect(() => {
    const lastFailedTime = localStorage.getItem("admin_last_failed_time");
    if (lastFailedTime) {
      const blockUntil = Number(lastFailedTime) + 4 * 60 * 60 * 1000;
      const now = Date.now();
      if (now < blockUntil) {
        setIsBlocked(true);
        setBlockCountdown(Math.ceil((blockUntil - now) / 1000));
      } else {
        localStorage.removeItem("admin_last_failed_time");
        setIsBlocked(false);
        setAttemptsLeft(3);
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isBlocked && blockCountdown > 0) {
      interval = setInterval(() => {
        setBlockCountdown((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAttemptsLeft(3);
            localStorage.removeItem("admin_last_failed_time");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBlocked, blockCountdown]);

  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/all-users`, {
          withCredentials: true,
        });
        const usersData = response.data?.users || response.data?.data || null;
        if (usersData) {
          setUsers(usersData);
          setFilteredUsers(usersData);
        } else {
          setErrorUsers("Unexpected data format");
        }
      } catch (error) {
        setErrorUsers("Failed to fetch users.");
      } finally {
        setLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  const handleAccessSubmit = async () => {
    if (isBlocked) {
      const minutes = Math.ceil(blockCountdown / 60);
      toast.error(`Access blocked due to 3 wrong attempts. Try again in ${minutes} minute${minutes !== 1 ? 's' : ''}`);
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/verify-password`,
        { password: inputPassword },
        { withCredentials: true }
      );
      if (response.data.success) {
        setAccessGranted(true);
        toast.success("Access granted!");
        setAttemptsLeft(3);
        localStorage.removeItem("admin_last_failed_time");
      } else {
        handleFailedAttempt();
      }
    } catch (err) {
      handleFailedAttempt();
    }
  };

  const handleFailedAttempt = () => {
    const newAttemptsLeft = attemptsLeft - 1;
    setAttemptsLeft(newAttemptsLeft);
    if (newAttemptsLeft <= 0) {
      localStorage.setItem("admin_last_failed_time", Date.now().toString());
      setIsBlocked(true);
      setBlockCountdown(4 * 60 * 60);
      toast.error("Blocked for 4 hours after 3 failed attempts");
    } else {
      toast.error(`Invalid password. ${newAttemptsLeft} attempt${newAttemptsLeft !== 1 ? 's' : ''} left.👉 You will be blocked for 4 hours after 3 failed attempts.`);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = users.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const email = user.email?.toLowerCase() || "";
      return (
        fullName.includes(e.target.value.toLowerCase()) ||
        email.includes(e.target.value.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white p-6">
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="Admin Logo" className="rounded-full h-24 w-24 mb-4" />
          <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin/our-courses">
            <button className="w-full bg-green-700 hover:bg-green-600 py-2 rounded-lg">Our Courses</button>
          </Link>
          <Link to="/admin/create-test">
            <button className="w-full bg-purple-600 hover:bg-purple-500 py-2 rounded-lg">Create Test</button>
          </Link>
          <Link to="/admin/create-course">
            <button className="w-full bg-orange-500 hover:bg-orange-400 py-2 rounded-lg">Create Course</button>
          </Link>
          <Link to="/admin/create-announcement">
            <button className="w-full bg-pink-600 hover:bg-pink-500 py-2 rounded-lg">Create Announcement</button>
          </Link>
          <Link to="/">
            <button className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg">Home</button>
          </Link>
          <Link to="/admin/login">
            <button
              onClick={handleLogout}
              className="w-full bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg"
            >
              Logout
            </button>
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex flex-col space-y-6 items-center">
        <section className="bg-white p-8 rounded-lg shadow-xl text-center w-full max-w-4xl text-gray-800">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Admin Dashboard!</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {progressData.map((item, index) => (
              <div
                key={index}
                onClick={() => setShowDetails(!showDetails)}
                className="bg-blue-500 p-6 rounded-lg text-white hover:bg-blue-400 cursor-pointer shadow-lg transition"
              >
                <h3 className="text-2xl font-semibold">{item.task}</h3>
                <p className="mt-4 text-lg">Progress: {item.progress}%</p>
                <div className="w-full bg-gray-300 h-2 mt-2 rounded-full">
                  <div className="h-2 bg-green-600 rounded-full" style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <section className="mt-12 text-left w-full">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-3xl font-semibold text-gray-900">Registered Users</h2>
              {accessGranted && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      const doc = new jsPDF();
                      autoTable(doc, {
                        head: [[
                          "#", "Name", "Email", "Mobile", "Purchased Courses", "Signup Date", "Last Login", "Last Purchase"
                        ]],
                        body: filteredUsers.map((user, index) => [
                          index + 1,
                          `${user.firstName || ""} ${user.lastName || ""}`,
                          user.email,
                          user.mobile || "-",
                          user.purchases?.map((p) => (typeof p === "string" ? p : p?.title || "N/A")).join(", ") || "None",
                          formatDate(user.createdAt),
                          formatDate(user.lastLoginAt),
                          formatDate(user.lastPurchaseAt)
                        ]),
                      });
                      doc.save("registered_users.pdf");
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => {
                      const worksheet = XLSX.utils.json_to_sheet(filteredUsers.map((user, index) => ({
                        SNo: index + 1,
                        Name: `${user.firstName || ""} ${user.lastName || ""}`,
                        Email: user.email,
                        Mobile: user.mobile || "-",
                        PurchasedCourses: user.purchases?.map((p) => (typeof p === "string" ? p : p?.title || "N/A")).join(", ") || "None",
                        SignupDate: formatDate(user.createdAt),
                        LastLogin: formatDate(user.lastLoginAt),
                        LastPurchase: formatDate(user.lastPurchaseAt),
                      })));
                      const workbook = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
                      XLSX.writeFile(workbook, "registered_users.xlsx");
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow"
                  >
                    Download Excel
                  </button>
                </div>
              )}
              {!accessGranted && (
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Enter access code"
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    className="border px-3 py-1 rounded text-red-600 bg-emerald-300"
                  />
                  <button
                    onClick={handleAccessSubmit}
                    className={`bg-blue-600 text-white px-4 rounded ${
                      isBlocked || attemptsLeft <= 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isBlocked || attemptsLeft <= 0}
                  >
                    {isBlocked
                      ? `Blocked (${Math.ceil(blockCountdown / 60)}m)`
                      : `Submit${attemptsLeft < 3 ? ` (${attemptsLeft} left)` : ""}`}
                  </button>
                </div>
              )}
            </div>
            {accessGranted && (
              <>
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="border px-3 py-2 rounded w-full mb-4 bg-pink-100 focus:bg-pink-200 focus:ring-2 focus:ring-indigo-400 transition"
                  autoComplete="off"
                />
                {loadingUsers ? (
                  <p>Loading users...</p>
                ) : errorUsers ? (
                  <p className="text-red-600">{errorUsers}</p>
                ) : filteredUsers.length === 0 ? (
                  <p>No matching users found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                      <thead className="bg-indigo-600 text-white">
                        <tr>
                          <th className="py-2 px-4 border">#</th>
                          <th className="py-2 px-4 border">Name</th>
                          <th className="py-2 px-4 border">Email</th>
                          <th className="py-2 px-4 border">Mobile</th>
                          <th className="py-2 px-4 border">Purchased Courses</th>
                          <th className="py-2 px-4 border">Signup Date</th>
                          <th className="py-2 px-4 border">Last Login</th>
                          <th className="py-2 px-4 border">Last Purchase</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, index) => (
                          <tr key={user._id || index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                            <td className="py-2 px-4 border text-center">{index + 1}</td>
                            <td className="py-2 px-4 border">{user.firstName} {user.lastName}</td>
                            <td className="py-2 px-4 border">{user.email}</td>
                            <td className="py-2 px-4 border">{user.mobile}</td>
                            <td className="py-2 px-4 border">
                              {user.purchases?.map((p, i) => (typeof p === "string" ? p : p?.title || "N/A")).join(", ") || "None"}
                            </td>
                            <td className="py-2 px-4 border">{formatDate(user.createdAt)}</td>
                            <td className="py-2 px-4 border">{formatDate(user.lastLoginAt)}</td>
                            <td className="py-2 px-4 border">{formatDate(user.lastPurchaseAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;









