import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
import { useNavigate } from "react-router-dom";

function TestCreate() {
  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [testLink, setTestLink] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/test/all`);
      setTests(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch tests");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    if (!token) {
      toast.error("Admin not logged in");
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/test/create`,
        {
          title,
          description,
          testLink,
          accessCode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message || "Test created successfully");
      setTitle("");
      setDescription("");
      setTestLink("");
      setAccessCode("");
      fetchTests();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error creating test");
    }
  };

  const handleDelete = async (testId) => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    if (!token) {
      toast.error("Admin not logged in");
      return;
    }

    try {
      await axios.delete(`${BACKEND_URL}/api/v1/test/delete/${testId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Test deleted");
      fetchTests();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting test");
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
        <h3 className="text-3xl font-semibold mb-6 text-indigo-700">Create Test</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-indigo-800">Subject</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-amber-100 focus:bg-amber-200"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-indigo-800">Test Details/Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-green-100 focus:bg-green-200"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-indigo-800">Test Link</label>
            <input
              type="url"
              value={testLink}
              onChange={(e) => setTestLink(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-cyan-100 focus:bg-cyan-200"
              placeholder="https://example.com/test"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-indigo-800">Access Code</label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-rose-100 focus:bg-rose-200"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
          >
            Submit
          </button>
        </form>

        {/* list of tests */}
        <div className="mt-8">
          <h4 className="text-2xl font-semibold mb-4 text-indigo-700">Existing Tests</h4>
          {tests.length === 0 && (
            <p className="text-gray-500">No tests created yet.</p>
          )}
          {tests.map((test) => (
            <div
              key={test._id}
              className="p-4 border rounded mb-4 bg-indigo-50 shadow"
            >
              <h5 className="font-semibold text-indigo-800">{test.title}</h5>
              <p>{test.description}</p>
              <p className="text-sm text-blue-700 break-words">{test.testLink}</p>
              <p className="text-xs text-gray-600">Access Code: {test.accessCode}</p>
              <button
                onClick={() => handleDelete(test._id)}
                className="text-red-600 hover:underline mt-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestCreate;
