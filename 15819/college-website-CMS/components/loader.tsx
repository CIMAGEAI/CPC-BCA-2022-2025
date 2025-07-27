// components/Loader.tsx
"use client"; // REQUIRED!

import Lottie from "lottie-react";
import animationData from "../public/loader.json";

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="w-40">
        <Lottie animationData={animationData} loop autoplay />
      </div>
    </div>
  );
}
