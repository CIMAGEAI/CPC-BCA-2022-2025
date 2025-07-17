import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function TestAccess() {
  const [tests, setTests] = useState([]);
  const [enteredCodes, setEnteredCodes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/test/all`);
        setTests(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load tests");
      }
    };
    fetchTests();
  }, []);

  const handleCodeChange = (e, testId) => {
    setEnteredCodes((prev) => ({ ...prev, [testId]: e.target.value }));
  };

  const handleStartTest = (test) => {
    if (enteredCodes[test._id] === test.accessCode) {
      window.open(test.testLink, "_blank");
    } else {
      toast.error("Invalid access code");
    }
  };

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-10 min-h-screen px-4 bg-emerald-300 relative">
      {/* Responsive Back Button */}
      <button
        onClick={() => navigate("/")}
        className="bg-orange-400 hover:bg-orange-600 text-white px-4 py-2 rounded shadow fixed top-4 left-4 z-10 md:static md:mb-4"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-8 text-indigo-800 text-center mt-14 md:mt-0">
        Available Tests
      </h2>

      {/* Search bar */}
      <input
        type="text"
        name="searchTest"
        autoComplete="off"
        placeholder="Search by subject"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-6 bg-amber-100 focus:bg-amber-200 focus:ring-2 focus:ring-indigo-400 transition"
      />

      {filteredTests.length === 0 && (
        <p className="text-center text-red-600 text-2xl">
          {tests.length === 0
            ? "No tests available right now. Please contact your teachers."
            : "No tests found for your search."}
        </p>
      )}

      {filteredTests.map((test) => (
        <div
          key={test._id}
          className="border rounded-lg p-6 shadow-md mb-8 bg-amber-50 hover:shadow-xl duration-300"
        >
          <h3 className="text-xl font-semibold text-indigo-700">
            Subject :- {test.title}
          </h3>

          <details>
            <summary className="text-gray-600 cursor-pointer mt-2">
              Test Details 👇
            </summary>
            <p className="text-gray-700 mb-4">{test.description}</p>
          </details>

          <input
            type="password"
            name={`accessCode-${test._id}`}
            autoComplete="new-password"
            placeholder="Enter access code"
            value={enteredCodes[test._id] || ""}
            onChange={(e) => handleCodeChange(e, test._id)}
            className="border px-3 py-2 rounded w-full mb-4 bg-pink-100 focus:bg-pink-200 focus:ring-2 focus:ring-indigo-400 transition"
          />

          <button
            onClick={() => handleStartTest(test)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
          >
            Start Test
          </button>
        </div>
      ))}
    </div>
  );
}

export default TestAccess;
