import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { FiSearch } from "react-icons/fi";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    const token = adminData?.token;

    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/course/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setFilteredCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
        toast.error("Could not load courses");
      }
    };
    fetchCourses();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("admin"));
      const token = adminData?.token;

      const response = await axios.delete(
        `${BACKEND_URL}/api/v1/course/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course) => course._id !== id);
      setCourses(updatedCourses);
      setFilteredCourses(updatedCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } catch (error) {
      console.log("Delete error: ", error);
      toast.error(error.response?.data?.errors || "Can't delete this course.");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="bg-gray-100 p-8 space-y-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Our Courses</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <Link
          className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300"
          to={"/admin/dashboard"}
        >
          Go to dashboard
        </Link>

        <div className="flex items-center border border-blue-600 rounded-full overflow-hidden bg-white">
          <input
            type="text"
            placeholder="Search course by subject..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 focus:outline-none text-sm w-64 bg-white text-gray-800 border-amber-300"
          />
          <span className="px-3 text-blue-600 text-xl">
            <FiSearch />
          </span>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <p className="text-center text-gray-500">No matching courses found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const discount = course.discount || 0;
            const discountAmount = Math.round(course.price * (discount / 100));
            const payableAmount = course.price - discountAmount;

            return (
              <div key={course._id} className="bg-white shadow-md rounded-lg p-4">
                <img
                  src={course?.image?.url}
                  alt={course.title}
                  className="h-40 w-full object-cover rounded-t-lg"
                />
                <h2 className="text-xl font-semibold mt-4 text-gray-800">
                  {course.title}
                </h2>
              <details>
                <summary>
                  Course Description
                </summary>
                <p className="text-gray-600 mt-2 text-sm">
                  {course.description.length > 200
                    ? `${course.description.slice(0, 200)}...`
                    : course.description}
                </p>
              </details>
                

                <div className="flex justify-between mt-4 text-gray-800 font-bold">
                  <div>
                    <div>Original Price: ₹{course.price}</div>
                    {discount > 0 && (
                      <>
                        <div>
                          Discounted Price:
                          <span className="line-through text-gray-500 ml-2">
                            ₹{course.price}
                          </span>
                        </div>
                        <div>Payable Amount: ₹{payableAmount}</div>
                      </>
                    )}
                    {discount === 0 && (
                      <div>Payable Amount: ₹{course.price}</div>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="text-green-600 text-sm mt-2">
                      {discount}% OFF
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <Link
                    to={`/admin/update-course/${course._id}`}
                    className="bg-orange-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="bg-red-500 text-white py-2 px-4 mt-4 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OurCourses;
