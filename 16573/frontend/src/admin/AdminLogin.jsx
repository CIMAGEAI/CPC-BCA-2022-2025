 

//for announcements
import React, { useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.token) {
        toast.success("Login successful");

        // localStorage me proper tarike se store karo
        localStorage.setItem(
          "admin",
          JSON.stringify({
            token: response.data.token,
            user: response.data.admin,
          })
        );

        navigate("/admin/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Admin Login failed!!!");
      } else {
        toast.error("Network error");
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-pink-300 to-red-400 ">
      <div className="h-screen container mx-auto flex items-center justify-center text-white">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to={"/"} className="text-xl font-bold text-orange-500">
              Cimage College Patna
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={"/admin/signup"}
              className="bg-transparent border border-gray-500 py-2 px-4 rounded-md cursor-pointer hover:bg-gradient-to-r from-yellow-400 to-red-600 hover:text-black duration-300 hover:font-bold"
            >
              Signup
            </Link>
            <Link
              to={"/courses"}
              className="bg-orange-500 py-2 px-4 rounded-md cursor-pointer hover:bg-gradient-to-r from-yellow-400 to-red-600 hover:text-black duration-300 hover:font-bold"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* Login Form */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-orange-500">Cimage College Patna</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Log in to access admin dashboard!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="text-gray-400 mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@email.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
                />
                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>
            {errorMessage && (
              <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
            )}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

