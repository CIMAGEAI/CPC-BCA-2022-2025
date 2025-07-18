"use client"

import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">i</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>

        <p className="text-gray-600 text-lg mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors px-4 py-2"
          >
            <Home size={20} />
            <span>Go to Homepage</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-purple-500 hover:text-purple-700 transition-colors px-4 py-2"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
        </div>

        <div className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} College Project</div>
      </div>
    </div>
  )
}
