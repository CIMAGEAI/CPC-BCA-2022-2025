import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function UpdateCourse() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [courseLink, setCourseLink] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [pdf, setPdf] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/course/${id}`);
        const course = res.data.course;

        setTitle(course.title);
        setDescription(course.description);
        setPrice(course.price);
        setDiscount(course.discount);
        setCourseLink(course.courseLink || "");
        setImagePreview(course.image?.url || "");
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch course");
      }
    };

    fetchCourse();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
    };
  };

  const handlePdfChange = (e) => {
    setPdf(e.target.files[0]);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    if (!title || !description || !price) {
      return toast.error("Title, Description, and Price are required");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("courseLink", courseLink);
    if (image) formData.append("image", image);
    if (pdf) formData.append("pdf", pdf);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const res = await axios.put(`${BACKEND_URL}/api/v1/course/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success(res.data.message || "Course updated successfully");
      navigate("/admin/our-courses");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.errors || "Update failed");
    }
  };

  return (
    <div>
      <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-8">Update Course</h3>

          <form onSubmit={handleUpdateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-amber-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-amber-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-amber-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Discount (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-amber-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Link (Optional)</label>
              <input
                type="url"
                value={courseLink}
                onChange={(e) => setCourseLink(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 border rounded-md bg-amber-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Image</label>
              <div className="flex justify-center">
                <img
                  src={imagePreview || "/imgPL.webp"}
                  alt="Preview"
                  className="w-full max-w-sm rounded-md"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-md bg-amber-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course PDF (Optional)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="w-full px-3 py-2 border rounded-md bg-amber-200"
              />
              {pdf && <p className="text-green-700 text-sm mt-1">Selected: {pdf.name}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Update Course
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateCourse;

