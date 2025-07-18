import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [courseLink, setCourseLink] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [pdf, setPdf] = useState(null);

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handlePdfChange = (e) => {
    setPdf(e.target.files[0]);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !image) {
      toast.error("Please fill in all required fields including image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("courseLink", courseLink);
    formData.append("image", image);
    if (pdf) formData.append("pdf", pdf);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/course/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Course created successfully");
      navigate("/admin/our-courses");

      setTitle("");
      setDescription("");
      setPrice("");
      setDiscount("");
      setCourseLink("");
      setImage("");
      setImagePreview("");
      setPdf(null);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.errors || "Failed to create course");
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-r from-sky-100 to-emerald-100">
      {/* Responsive Back Button */}
      <button
        className="bg-orange-400 hover:bg-orange-600 text-white px-4 py-2 rounded shadow fixed top-4 left-4 z-10 md:static md:mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg bg-white mt-14 md:mt-0">
        <h3 className="text-2xl font-semibold mb-8 text-indigo-700">Create Course</h3>

        <form onSubmit={handleCreateCourse} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-lg">Title</label>
            <input
              type="text"
              placeholder="Enter your course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none bg-amber-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-lg">Description</label>
            <input
              type="text"
              placeholder="Enter your course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none bg-amber-200"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-lg">Price</label>
            <input
              type="number"
              placeholder="Enter your course price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none bg-amber-200"
            />
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <label className="block text-lg">Discount %</label>
            <input
              type="number"
              placeholder="Enter discount %. Ex: 10"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none bg-amber-200"
            />
          </div>

          {/* Course Link */}
          <div className="space-y-2">
            <label className="block text-lg">Course Video Link (optional)</label>
            <input
              type="text"
              placeholder="https://youtube.com/..."
              value={courseLink}
              onChange={(e) => setCourseLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none bg-amber-200"
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="block text-lg">Course Image</label>
            <div className="flex items-center justify-center">
              <img
                src={imagePreview ? imagePreview : "/imgPL.webp"}
                alt="Preview"
                className="w-full max-w-sm h-auto rounded-md object-cover"
              />
            </div>
            <input
              type="file"
              onChange={changePhotoHandler}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none bg-amber-200"
            />
          </div>

          {/* PDF */}
          <div className="space-y-2">
            <label className="block text-lg">Course PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none bg-amber-200"
            />
            {pdf && (
              <p className="text-green-700 text-sm mt-1">Selected: {pdf.name}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default CourseCreate;
