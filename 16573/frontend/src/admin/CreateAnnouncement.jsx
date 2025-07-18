import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function CreateAnnouncement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/announcement/all`);
      setAnnouncements(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load announcements");
    }
  };

  const handleCreate = async () => {
    if (!title || !description) {
      toast.error("Title and description are required.");
      return;
    }
    try {
      setLoading(true);

      const admin = JSON.parse(localStorage.getItem("admin"));
      const token = admin?.token;

      const res = await axios.post(
        `${BACKEND_URL}/api/v1/announcement/create`,
        { title, description, link },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Announcement created");
        fetchAnnouncements();
        setTitle("");
        setDescription("");
        setLink("");
      } else {
        toast.error(res.data.message || "Failed to create announcement");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const admin = JSON.parse(localStorage.getItem("admin"));
      const token = admin?.token;

      const res = await axios.delete(`${BACKEND_URL}/api/v1/announcement/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Announcement deleted");
        fetchAnnouncements();
      } else {
        toast.error(res.data.message || "Failed to delete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting announcement");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-pink-200 to-indigo-300 p-4 relative">
      {/* Back button fixed top-left corner on all screens */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="bg-orange-400 hover:bg-orange-600 text-white px-4 py-2 rounded shadow fixed top-4 left-4 z-50 flex items-center space-x-2"
      >
        <FaArrowLeft />
        <span className="hidden md:inline">Back to Dashboard</span>
      </button>

      {/* form */}
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl w-full mb-8 mt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">
          Create Announcement
        </h2>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 bg-green-300"
            placeholder="Enter announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 bg-indigo-400"
            rows="4"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Optional Link</label>
          <input
            type="url"
            className="w-full border rounded px-3 py-2 bg-fuchsia-400"
            placeholder="https://example.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded"
        >
          {loading ? "Creating..." : "Create Announcement"}
        </button>
      </div>

      {/* list announcements */}
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-800">
          Existing Announcements
        </h2>
        {announcements.length === 0 ? (
          <p className="text-center text-gray-500">No announcements yet.</p>
        ) : (
          <ul className="space-y-4">
            {announcements.map((a) => (
              <li
                key={a._id}
                className="border rounded p-4 flex justify-between items-center"
              >
                <div className="w-3/4">
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="text-gray-700 truncate">{a.description}</p>
                  {a.link && (
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      {a.link}
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CreateAnnouncement;
