// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import Home from './components/Home'
// import Login from './components/Login'
// import Signup from './components/Signup'
// import { Route, Router, Routes } from 'react-router-dom'
// import  { Toaster } from 'react-hot-toast';
// import Courses from './components/Courses'
// import Purchases from './components/Purchases'
// import Buy from './components/Buy'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//      <div>
       
//        <Routes>
//         <Route path="/" element={<Home />}> </Route>
//         <Route path="/Login" element={<Login />} />
//         <Route path="/Signup" element={<Signup />} />

//         {/* Other routes */}
//         <Route path="/courses" element={<Courses />} />
//         <Route path="/purchases" element={<Purchases />}></Route>
//         <Route path="/buy/:courseId" element={<Buy />} />
//        </Routes>
        
//        <Toaster />
//      </div>
//   )
// }

// export default App



// import { useState } from 'react';
// import './App.css';
// import Home from './components/Home';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import Courses from './components/Courses';
// import Purchases from './components/Purchases';
// import Buy from './components/Buy';

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       {/* Wrap Routes inside BrowserRouter */}
//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/courses" element={<Courses />} />
//           <Route path="/purchases" element={<Purchases />} />
//           <Route path="/buy/:courseId" element={<Buy />} />
//         </Routes>
//       </Router>

//       {/* Toast Notifications */}
//       <Toaster />
//     </div>
//   );
// }

// export default App;











// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
// import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext.jsx";  // Ensure correct path

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );











// // App.jsx
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Courses from "./components/Courses";
// import Purchases from "./Purchases";
// import Login from "./Login"; // if you have this
// import Home from "./Home";   // if you have a homepage

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/courses" element={<Courses />} />
//       <Route path="/purchases" element={<Purchases />} />
//       <Route path="/login" element={<Login />} />
//     </Routes>
//   );
// }

// export default App; // ✅ This is important




























// import React from "react";
// import { Routes, Route } from "react-router-dom";

// // Corrected paths based on your file structure
// import Courses from "./components/Courses";
// import Purchases from "./components/Purchases";
// import Login from "./components/Login";
// import Buy from "./components/Buy";
// // import any other components as needed

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Courses />} />
//       <Route path="/courses" element={<Courses />} />
//       <Route path="/purchases" element={<Purchases />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/buy/:courseId" element={<Buy />} />
//       {/* Add a fallback route or 404 page if needed */}
//     </Routes>
//   );
// }

// export default App;














// ******************* 2 attempt ********************



import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import Purchases from "./components/Purchases";
import Buy from "./components/Buy";
import Courses from "./components/Courses";

import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import CourseCreate from "./admin/CourseCreate";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourses from "./admin/OurCourses";

import TestCreate from "./admin/TestCreate";

import AccessTest from "./components/TestAccess";
 




import PDFViewer from "./components/PDFViewer"; // Assuming you have a PDFViewer component
import CreateAnnouncement from "./admin/CreateAnnouncement";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  return (
    <div>
      {/* <div>
        <PDFViewer />
      </div> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Other Routes */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />

        {/* without checking user is login or not visit Purchase page */}
        {/* <Route path="/purchases" element={<Purchases/>}
        /> */}

        
        {/* This route only for authenticated user or logged in user  */}
 <Route
          path="/purchases"
          element={user ? <Purchases /> : <Navigate to={"/login"} />}
        />



 


        {/* Admin Routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

{/* without protected route */}
        {/* <Route path="/admin/dashboard" element={<Dashboard />} /> */}

        {/* Protected Route */}
        <Route
          path="/admin/dashboard"
          element={admin ? <Dashboard /> : <Navigate to={"/admin/login"} />}
        />

        <Route path="/admin/create-course" element={<CourseCreate />} />
        <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
        <Route path="/admin/our-courses" element={<OurCourses />} />

        <Route path="/admin/create-test" element={<TestCreate />} />

        <Route path="/access-test" element={<AccessTest />} />
        <Route path="/admin/create-announcement" element={<CreateAnnouncement />} />



      </Routes>
      <Toaster />
    </div>
  );
}

export default App;