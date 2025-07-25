 


import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Filter courses based on title search
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      {/* Hamburger button for mobile */}
      <button className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800" onClick={toggleSidebar}>
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-100 w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0">
          <img src={logo} alt="Logo" className="rounded-full h-12 w-12" />
          <span className="text-xl text-orange-500 font-bold ml-2">Cimage College Patna</span>
        </div>
        <nav>
          <ul>
            <li className="nav-item">
              <a href="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </a>
            </li>
            <li className="nav-item text-blue-500">
              <a href="#" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </a>
            </li>
            <li className="nav-item">
              <a href="/purchases" className="flex items-center">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </a>
            </li>
            <li className="nav-item">
              {isLoggedIn ? (
                <Link to="/" className="flex items-center" onClick={handleLogout}>
                  <IoLogOut className="mr-2" /> Logout
                </Link>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 animate-bg transition-colors">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold">Courses</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type here to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-blue-600 rounded-l-full px-4 py-2 h-10 focus:outline-none bg-amber-50"
              />
              <button className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center">
                <FiSearch className="text-xl text-white-600" />
              </button>
            </div>
            <FaCircleUser className="text-4xl text-blue-600" />
          </div>
        </header>

        {/* Course Cards */}
        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filteredCourses.length === 0 ? (
            <p className="text-center text-gray-500">No matching courses found</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const price = Number(course.price);
                const discount = Number(course.discount) || 0;
                const discountAmount = price * (discount / 100);
                const finalPrice = price - discountAmount;

                return (
                  <div
                    key={course._id}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
                  >
                    <img
                      src={course.image?.url}
                      alt={course.title}
                      className="rounded mb-4"
                    />
                    <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                    <p className="text-gray-600 mb-4">
                      <details>
                        <summary>Course Description</summary>
                        {course.description.length > 100
                          ? `${course.description.slice(0, 100)}...`
                          : course.description}
                      </details>
                    </p>
                    <div className="mb-4 text-sm text-gray-700">
                      <p>Original Price: ₹{price}</p>
                      <p>
                        Discount: {discount}% (₹{discountAmount.toFixed(2)})
                      </p>
                      <p className="font-semibold text-lg">
                        Payable Amount: ₹{finalPrice.toFixed(2)}
                      </p>
                    </div>
                    <Link
                      to={`/buy/${course._id}`}
                      className="bg-orange-500 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-900 duration-300 block text-center"
                    >
                      Buy Now
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Courses;



 