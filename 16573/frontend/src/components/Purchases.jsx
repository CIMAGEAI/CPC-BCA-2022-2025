 

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Purchases() {
  const [purchases, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setPurchase(response.data.courseData);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Failed to fetch purchase data");
      }
    };
    if (token) fetchPurchases();
  }, [token]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/login");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen animated-diagonal-bg text-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-pink-600 bg-opacity-40 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-300">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="mb-4">
              <Link to="/settings" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <h2 className="text-xl font-semibold mt-6 md:mt-0 mb-6">My Purchases</h2>

        {/* Error message */}
        {errorMessage && (
          <div className="text-red-300 text-center mb-4">{errorMessage}</div>
        )}

        {/* Render purchases */}
        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((purchase, index) => {
              const originalPrice = purchase.price || 0;
              const discountPercent = purchase.discount || 0;
              const discountedPrice = originalPrice - (originalPrice * discountPercent) / 100;

              return (
                <div
                  key={index}
                  className="bg-white text-black rounded-lg shadow-md p-6 mb-6 flex flex-col items-center"
                >
                  <img
                    className="rounded-lg w-full h-48 object-cover"
                    src={purchase.image?.url || "https://via.placeholder.com/200"}
                    alt={purchase.title}
                  />

                  <div className="text-center mt-4 w-full">
                    <h3 className="text-lg font-bold">{purchase.title}</h3>
                    <p className="text-gray-600">
                      {purchase.description.length > 100
                        ? `${purchase.description.slice(0, 100)}...`
                        : purchase.description}
                    </p>

                    <div className="mt-2">
                      <span className="text-sm text-gray-500 line-through mr-2">
                        ₹ {originalPrice.toFixed(2)}
                      </span>
                      <span className="text-green-700 font-semibold text-sm">
                        ₹ {discountedPrice.toFixed(2)} only
                      </span>
                    </div>

                    {/* View PDF */}
                    {purchase.pdfUrl ? (
                      <a
                        href={purchase.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        View PDF
                      </a>
                    ) : (
                      <p className="mt-4 text-gray-500 italic">No downloadable file</p>
                    )}

                    {/* Watch Video */}
                    {purchase.courseLink ? (
                      <a
                        href={purchase.courseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                      >
                        Watch Video
                      </a>
                    ) : (
                      <p className="mt-2 text-gray-500 italic">No video link</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-200">
            You have no purchases yet, just go and buy now 😊
          </p>
        )}
      </div>
    </div>
  );
}

export default Purchases;


