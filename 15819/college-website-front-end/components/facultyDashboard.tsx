import React from "react";

const FacultyDirectory = () => {
  const facultyData = [
    {
      id: 1,
      name: "Rahul Kumar Goswami",
      mobile: "9999999999",
      subject: "Science",
      qualification: "PhD",
    },
    {
      id: 2,
      name: "Priya Sharma",
      mobile: "8888888888",
      subject: "Mathematics",
      qualification: "PhD",
    },
    {
      id: 3,
      name: "Amit Singh",
      mobile: "7777777777",
      subject: "Computer Science",
      qualification: "M.Tech",
    },
    {
      id: 4,
      name: "Sneha Patel",
      mobile: "6666666666",
      subject: "English Literature",
      qualification: "M.Phil",
    },
    {
      id: 5,
      name: "Vikram Desai",
      mobile: "5555555555",
      subject: "Physics",
      qualification: "PhD",
    },
    {
      id: 6,
      name: "Neha Joshi",
      mobile: "4444444444",
      subject: "Chemistry",
      qualification: "M.Sc",
    },
    {
      id: 7,
      name: "Rajesh Kumar",
      mobile: "3333333333",
      subject: "History",
      qualification: "PhD",
    },
    {
      id: 8,
      name: "Sunita Verma",
      mobile: "2222222222",
      subject: "Geography",
      qualification: "M.Ed",
    },
  ];

  const columns = [
    { key: "name", label: "Faculty Name" },
    { key: "mobile", label: "Mobile Number" },
    { key: "subject", label: "Subject" },
    { key: "qualification", label: "Qualification" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          Faculty Directory
        </h1>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-hidden shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-700 text-white">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="py-3 px-4 text-left font-semibold"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="py-3 px-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {facultyData.map((faculty) => (
                <tr key={faculty.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={`${faculty.id}-${column.key}`}
                      className="py-3 px-4"
                    >
                      {faculty[column.key] ?? "N/A"}
                    </td>
                  ))}
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-500 hover:text-blue-700">
                        👁️
                      </button>
                      <button className="p-1 text-green-500 hover:text-green-700">
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tablet View */}
        <div className="hidden md:block lg:hidden overflow-hidden shadow-md rounded-lg mt-8">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Faculty</th>
                <th className="py-3 px-4 text-left font-semibold">Subject</th>
                <th className="py-3 px-4 text-left font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {facultyData.map((faculty) => (
                <tr key={faculty.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{faculty.name}</div>
                    <div className="text-sm text-gray-500">{faculty.mobile}</div>
                  </td>
                  <td className="py-3 px-4">{faculty.subject}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {faculty.qualification}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 mt-8">
          {facultyData.map((faculty) => (
            <div
              key={faculty.id}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-blue-800">
                    {faculty.name}
                  </h3>
                  <p className="text-blue-600">{faculty.subject}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {faculty.qualification}
                </span>
              </div>
              <div className="mt-2 border-t border-gray-100 pt-2 text-sm text-gray-700">
                📞 {faculty.mobile}
              </div>
              <div className="mt-3 flex justify-end space-x-2">
                <button className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-3 py-1.5">
                  Contact
                </button>
                <button className="text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-3 py-1.5">
                  Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyDirectory;
