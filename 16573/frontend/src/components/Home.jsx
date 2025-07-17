 


import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaLinkedin,
  FaPhone,
  FaWhatsapp,
  FaYoutubeSquare,
  FaInstagram,
} from "react-icons/fa";
import Slider from "react-slick";
import axios from "axios";
import toast from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BACKEND_URL } from "../utils/utils";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.log("Error in fetchCourses", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/announcement/all`);
        setAnnouncements(res.data.data || []);
      } catch (err) {
        console.log("Error fetching announcements", err);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 2, infinite: true, dots: true },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="min-h-screen text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="logo" className="w-7 h-7 md:w-10 md:h-10 rounded-full" />
            <h1 className="md:text-2xl text-orange-500 font-bold">CIMAGE COLLEGE PATNA</h1>
          </div>
          <div className="space-x-4 flex items-center">
            {isLoggedIn && (
              <Link
                to="/access-test"
                className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded cursor-pointer hover:bg-gradient-to-r from-green-400 to-blue-600 hover:text-black duration-300 hover:font-bold"
              >
                Test
              </Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded cursor-pointer hover:bg-gradient-to-r from-yellow-400 to-red-600 hover:text-black duration-300 hover:font-bold"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded cursor-pointer hover:bg-gradient-to-r from-yellow-400 to-red-600 hover:text-black duration-300 hover:font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded cursor-pointer hover:bg-gradient-to-r from-yellow-400 to-red-600 hover:text-black duration-300 hover:font-bold"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Announcements - modern marquee effect with blink */}
        {announcements.length > 0 && (
          <section className="p-4">
            <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6 animate-bounce">
              📣 Latest Announcements
            </h2>
            <div className="relative overflow-hidden w-full rounded shadow">
              <div
                className="flex whitespace-nowrap"
                style={{
                  animation: "scrollLeft 20s linear infinite",
                }}
                onMouseOver={(e) => (e.currentTarget.style.animationPlayState = "paused")}
                onMouseOut={(e) => (e.currentTarget.style.animationPlayState = "running")}
              >
                {announcements.map((item) => (
  <div
    key={item._id}
    className="flex-shrink-0 w-80 h-60 overflow-y-auto bg-gradient-to-br from-pink-300 to-yellow-300 rounded-xl p-4 shadow-2xl border-4 border-indigo-600 mx-4 animate-pulse hover:scale-105 hover:shadow-2xl duration-300
"
  >
    <h3 className="text-xl font-bold text-indigo-900 mb-2 animate-pulse">
      {item.title}
    </h3>

    <details className="text-gray-800 mb-2">
      <summary  className="cursor-pointer font-semibold text-blue-700">
        View Details👇
      </summary>
      <div className="mt-2 whitespace-pre-wrap text-sm">
        {item.description}
      </div>
    </details>

    {item.link && (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition duration-300"
      >
        Visit Link
      </a>
    )}
    <span className="text-xs text-gray-600 block mt-2">
      {new Date(item.createdAt).toLocaleString()}
    </span>
  </div>
))}



              </div>
            </div>
          </section>
        )}

        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-4xl font-semibold text-orange-500">CIMAGE PROFESSIONAL COLLEGE, PATNA</h1>
          <br />
          <p className="text-gray-500">Sharpen your skills with courses crafted by experts.</p>
          <div className="space-x-4 mt-8">
            <Link
              to="/courses"
              className="bg-green-500 text-white p-2 md:py-3 md:px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black"
            >
              Explore courses
            </Link>
            <Link
              to="https://balmikikumar.github.io/portfolio/"
              target="_blank"
              className="bg-white text-black p-2 md:py-3 md:px-6 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white"
            >
              About Me
            </Link>
          </div>
        </section>

        {/* Courses Carousel */}
        <section className="p-10">
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="relative flex-shrink-0 transition-transform duration-300 transform hover:scale-105">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img className="h-32 w-full object-contain" src={course.image?.url} alt={course.title} />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-white">{course.title}</h2>
                      <Link
                        to={`/buy/${course._id}`}
                        className="mt-8 bg-orange-500 text-white py-1 px-4 rounded-full hover:bg-blue-500 duration-300"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr />

        {/* Footer */}
        <footer className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Logo and Social */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">CIMAGE COLLEGE PATNA</h1>
              </div>
              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-2">Follow us</p>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/profile.php?id=100052381876957&sfnsn=wa" target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                  </a>
                  <a href="https://www.instagram.com/balmiki_360" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                  </a>
                  <a href="https://x.com/Bittulal746273" target="_blank" rel="noopener noreferrer">
                    <span className="text-2xl font-bold hover:text-green-600 duration-300">𝕏</span>
                  </a>
                  <a href="https://www.linkedin.com/in/balmiki-kumar-1713a3262" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="text-2xl hover:text-blue-600 duration-300" />
                  </a>
                  <a href="https://youtube.com/@beyondbalmiki" target="_blank" rel="noopener noreferrer">
                    <FaYoutubeSquare className="text-2xl hover:text-red-600 duration-300" />
                  </a>
                  <a href="https://wa.me/7761855039" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp className="text-2xl hover:text-green-400 duration-300" />
                  </a>
                  <a href="tel:+917761855039">
                    <FaPhone className="text-2xl hover:text-green-400 duration-300" />
                  </a>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold md:mb-4">Connects</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://youtube.com/@beyondbalmiki" target="_blank" className="hover:text-white duration-300">YouTube - Beyond Balmiki</a></li>
                <li><a href="https://t.me/+917761855039" target="_blank" className="hover:text-white duration-300">Telegram - Balmiki Kumar</a></li>
                <li><a href="https://github.com/BalmikiKumar" target="_blank" className="hover:text-white duration-300">GitHub - Balmiki Kumar</a></li>
              </ul>
            </div>

            {/* Policy */}
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">© 2025</h3>
              <ul className="space-y-2 text-center text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">Terms & Conditions</li>
                <li className="hover:text-white cursor-pointer duration-300">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer duration-300">Refund & Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
        
      </div>
    </div>
  );
}

export default Home;





