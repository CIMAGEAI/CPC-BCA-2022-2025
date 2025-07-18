"use client";

import React, { useState, useEffect } from "react";

const BookIssuanceSystem = () => {
  // State for books, students, and issued books
  const [books, setBooks] = useState([
    { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", available: true, category: "Fiction" },
    { id: 2, title: "1984", author: "George Orwell", available: true, category: "Fiction" },
    { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", available: true, category: "Fiction" },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", available: true, category: "Fiction" },
    { id: 5, title: "Clean Code", author: "Robert C. Martin", available: true, category: "Programming" },
    { id: 6, title: "Design Patterns", author: "Erich Gamma et al.", available: true, category: "Programming" },
    { id: 7, title: "A Brief History of Time", author: "Stephen Hawking", available: true, category: "Science" },
    { id: 8, title: "The Origin of Species", author: "Charles Darwin", available: true, category: "Science" },
  ]);

  const [students, setStudents] = useState([
    { id: 1, name: "Rahul Kumar", rollNo: "STU001", course: "Computer Science" },
    { id: 2, name: "Priya Sharma", rollNo: "STU002", course: "Physics" },
    { id: 3, name: "Amar Singh", rollNo: "STU003", course: "Mathematics" },
    { id: 4, name: "Divya Patel", rollNo: "STU004", course: "English Literature" },
  ]);

  const [issuedBooks, setIssuedBooks] = useState([
    { id: 1, bookId: 3, studentId: 2, issueDate: "2025-04-15", returnDate: "2025-05-15" },
    { id: 2, bookId: 7, studentId: 1, issueDate: "2025-04-20", returnDate: "2025-05-20" },
  ]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("issue"); // "issue" or "records"
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Update book availability based on issued books
  useEffect(() => {
    const updatedBooks = books.map(book => {
      const isIssued = issuedBooks.some(issued => issued.bookId === book.id);
      return { ...book, available: !isIssued };
    });
    setBooks(updatedBooks);
    
    // Update filtered books
    filterBooks(searchTerm, updatedBooks);
  }, [issuedBooks]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter books based on search term
  const filterBooks = (term, bookList = books) => {
    const filtered = bookList.filter(book => 
      book.title.toLowerCase().includes(term.toLowerCase()) || 
      book.author.toLowerCase().includes(term.toLowerCase()) ||
      book.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterBooks(term);
  };

  // Find student name by ID
  const getStudentName = (studentId: number) => {
    const student = students.find(student => student.id === studentId);
    return student ? student.name : "Unknown Student";
  };

  // Find book title by ID
  const getBookTitle = (bookId) => {
    const book = books.find(book => book.id === bookId);
    return book ? book.title : "Unknown Book";
  };

  // Calculate days remaining until return
  const getDaysRemaining = (returnDate) => {
    const today = new Date();
    const returnDay = new Date(returnDate);
    const diffTime = returnDay - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Issue a book to a student
  const issueBook = (e) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedBook || !returnDate) {
      alert("Please fill all the fields");
      return;
    }

    // Convert string IDs to numbers
    const bookId = parseInt(selectedBook);
    const studentId = parseInt(selectedStudent);
    
    // Check if book is already issued
    if (issuedBooks.some(issued => issued.bookId === bookId)) {
      alert("This book is already issued to another student.");
      return;
    }

    // Create new issued book record
    const newIssuedBook = {
      id: issuedBooks.length + 1,
      bookId,
      studentId,
      issueDate: new Date().toISOString().split("T")[0],
      returnDate
    };

    // Update issued books
    setIssuedBooks([...issuedBooks, newIssuedBook]);
    
    // Show success message
    setSuccessMessage(`Book "${getBookTitle(bookId)}" has been issued to ${getStudentName(studentId)}`);
    setTimeout(() => setSuccessMessage(""), 3000);
    
    // Reset form
    setSelectedStudent("");
    setSelectedBook("");
    setReturnDate("");
  };

  // Return a book
  const returnBook = (issuedBookId) => {
    // Remove the issued book record
    const updatedIssuedBooks = issuedBooks.filter(book => book.id !== issuedBookId);
    setIssuedBooks(updatedIssuedBooks);
    
    // Show success message
    setSuccessMessage("Book has been returned successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Initialize filtered books
  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-blue-700 text-white rounded-lg shadow-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                <svg className="w-8 h-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Book Issuance System
              </h1>
              <p className="text-blue-100">Manage book issuance to students</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full py-2 px-4 rounded-lg border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <svg
                className="absolute right-3 top-2.5 w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md transition-all duration-500 ease-in-out">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 rounded-lg bg-blue-100 p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "issue" ? "bg-white shadow" : "text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("issue")}
            >
              Issue Book
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "records" ? "bg-white shadow" : "text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("records")}
            >
              Issued Records
            </button>
          </div>
        </div>

        {/* Issue Book Form */}
        {activeTab === "issue" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Issue a Book</h2>
                <form onSubmit={issueBook}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="student">
                      Select Student
                    </label>
                    <select
                      id="student"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      required
                    >
                      <option value="">Choose a student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.rollNo})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="book">
                      Select Book
                    </label>
                    <select
                      id="book"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedBook}
                      onChange={(e) => setSelectedBook(e.target.value)}
                      required
                    >
                      <option value="">Choose a book</option>
                      {books
                        .filter((book) => book.available)
                        .map((book) => (
                          <option key={book.id} value={book.id}>
                            {book.title} by {book.author}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="returnDate">
                      Return Date
                    </label>
                    <input
                      type="date"
                      id="returnDate"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Issue Book
                  </button>
                </form>
              </div>
            </div>

            {/* Available Books */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">Available Books</h2>
                </div>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBooks.map((book) => (
                        <tr key={book.id} className={book.available ? "" : "bg-gray-50"}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {book.available ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Issued
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {book.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.author}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.category}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile View */}
                <div className="md:hidden">
                  <ul className="divide-y divide-gray-200">
                    {filteredBooks.map((book) => (
                      <li key={book.id} className={`p-4 hover:bg-gray-50 ${book.available ? "" : "bg-gray-50"}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{book.title}</h3>
                            <p className="text-sm text-gray-500">{book.author}</p>
                            <p className="text-xs text-gray-400">{book.category}</p>
                          </div>
                          <div>
                            {book.available ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Issued
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Issued Books Records */}
        {activeTab === "records" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Issued Books</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {issuedBooks.length} Books Issued
              </span>
            </div>
            
            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {issuedBooks.map((issued) => {
                    const daysRemaining = getDaysRemaining(issued.returnDate);
                    const isOverdue = daysRemaining < 0;
                    
                    return (
                      <tr key={issued.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {getBookTitle(issued.bookId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getStudentName(issued.studentId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(issued.issueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(issued.returnDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isOverdue ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Overdue by {Math.abs(daysRemaining)} days
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {daysRemaining} days remaining
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => returnBook(issued.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Return Book
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Tablet View */}
            <div className="hidden md:block lg:hidden">
              <div className="grid grid-cols-2 gap-4 p-4">
                {issuedBooks.map((issued) => {
                  const daysRemaining = getDaysRemaining(issued.returnDate);
                  const isOverdue = daysRemaining < 0;
                  
                  return (
                    <div key={issued.id} className="border rounded-lg overflow-hidden bg-white">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-800">{getBookTitle(issued.bookId)}</h3>
                      </div>
                      <div className="p-4">
                        <p className="text-sm"><span className="font-medium">Student:</span> {getStudentName(issued.studentId)}</p>
                        <p className="text-sm mt-1"><span className="font-medium">Issued:</span> {new Date(issued.issueDate).toLocaleDateString()}</p>
                        <p className="text-sm mt-1"><span className="font-medium">Return:</span> {new Date(issued.returnDate).toLocaleDateString()}</p>
                        <div className="mt-3">
                          {isOverdue ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Overdue by {Math.abs(daysRemaining)} days
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {daysRemaining} days remaining
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => returnBook(issued.id)}
                          className="mt-4 w-full text-center py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                        >
                          Return Book
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Mobile View */}
            <div className="md:hidden">
              <ul className="divide-y divide-gray-200">
                {issuedBooks.map((issued) => {
                  const daysRemaining = getDaysRemaining(issued.returnDate);
                  const isOverdue = daysRemaining < 0;
                  
                  return (
                    <li key={issued.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{getBookTitle(issued.bookId)}</h3>
                        {isOverdue ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {daysRemaining}d left
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{getStudentName(issued.studentId)}</p>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Issued: {new Date(issued.issueDate).toLocaleDateString()}</span>
                        <span>Return: {new Date(issued.returnDate).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => returnBook(issued.id)}
                        className="mt-3 w-full text-center py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                      >
                        Return Book
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            {issuedBooks.length === 0 && (
              <div className="py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No books issued</h3>
                <p className="mt-1 text-sm text-gray-500">There are currently no books issued to students.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookIssuanceSystem;