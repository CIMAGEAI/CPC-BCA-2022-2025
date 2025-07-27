"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Carousel data
const courses = [
  {
    id: "bca",
    title: "BCA",
    image: "/images/student.jpg",
    badge: "BCA",
    description: "Top BCA college with IT Add-On Courses.",
  },
  {
    id: "bba",
    title: "BBA",
    image: "/images/student1.jpg",
    badge: "BBA",
    description: "Business skills for the modern workplace.",
  },
  {
    id: "bsc-it",
    title: "B.Sc-IT",
    image: "/images/student2.jpg",
    badge: "B.Sc-IT",
    description: "BSc IT with cutting-edge curriculum.",
  },
  {
    id: "bbm",
    title: "BBM",
    image: "/images/studentLab.jpg",
    badge: "BBM",
    description: "Best BBM college with great placements.",
  },
];

export default function CourseCarousel() {
  const [index, setIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3); // default for desktop

  // Adjust visible items based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(2); // mobile
      } else {
        setItemsToShow(3); // tablet/desktop
      }
    };
    handleResize(); // set on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = () => {
    setIndex((prev) => (prev + 1) % courses.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

  const getVisibleCourses = () => {
    const wrapped = [...courses, ...courses]; // loop around
    return wrapped.slice(index, index + itemsToShow);
  };

  return (
    <div className="w-full bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">UG & PG Courses</h2>
          <div className="flex gap-2">
            <Button variant="destructive" size="icon" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div className="flex overflow-hidden">
          <div className="flex gap-4 transition-transform duration-500 ease-in-out w-full">
            {getVisibleCourses().map((course) => (
              <div
                key={course.id}
                className="flex-1 min-w-0 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm font-bold">
                    {course.badge}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-4">{course.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
