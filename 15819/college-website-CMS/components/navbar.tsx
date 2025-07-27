import React from "react";
import Image from "next/image";
import Link from "next/link"; // FIXED: Use Link from 'next/link', not 'lucide-react'

const menuItems = {
  title: "MENU",
  items: [
    {
      icon: "/icon/home.png",
      label: "Home",
      href: "/dashboard/admin",
    },
    // {
    //   icon: "/icon/graduation.png",
    //   label: "Student",
    //   href: "/dashboard/student",
    // },
    {
      icon: "/icon/faculty.png",
      label: "Faculty",
      href: "/dashboard/faculty",
    },
    {
      icon: "/icon/courses.png",
      label: "Books",
      href: "/dashboard/books",
    },
    // {
    //   icon: "/icon/schedule.png",
    //   label: "Schedule",
    //   href: "/schedule",
    // },
    // {
    //   icon: "/icon/grades.png",
    //   label: "Grades",
    //   href: "/dashboard/grades",
    // },
    // {
    //   icon: "/icon/setting.png",
    //   label: "Settings",
    //   href: "/settings",
    // },
  ],
};

export default function Menu() {
  return (
    <div className="">
      <div className="">
        <span className="font-semibold text-gray-500 hidden lg:block">{menuItems.title}</span>
        <div className="mt-4 space-y-3">
          {menuItems.items.map((item) => (
            <Link href={item.href} key={item.label} className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded">
              <Image src={item.icon} alt={item.label} width={20} height={20} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
