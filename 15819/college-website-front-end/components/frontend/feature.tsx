import Image from "next/image"
import Notice from "./notice"
import MarqueNotice from "./marquenotice"

export default function CollegeFeatures() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Transform your educational institution from the inside out</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
          Our College Management System streamlines administrative workflows, empowers faculty, and enhances student experiences through intelligent automation and data-driven insights.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Study Assistant */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Discover Your Potential in a World-Class Learning Environment</h3>
              <p className="text-gray-600 mt-2">
               we are dedicated to fostering innovation, academic excellence, and character development. 
    Our dynamic learning environment blends cutting-edge technology with a rich educational heritage to prepare students for global success.
    Join a community where your potential meets endless possibilities.
              </p>
            </div>
            <div className="bg-gray-100 p-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 p-3 flex items-center">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="ml-3 text-sm font-medium text-gray-700">Instruction's</div>
                </div>
                <div className="p-4 relative">
                  <div className="flex">
                    <div className="w-16 flex-shrink-0">
                      <div className="space-y-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                       
                      </div>
                    </div>
                    <div className="flex-1">
                      <Notice/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Course Generation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Notice</h3>
              <p className="text-gray-600 mt-2">
                  This is a Notice Section
              </p>
            </div>
            <div className="bg-gray-100 p-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="border border-gray-200 rounded-lg p-3 mb-4">
                  <MarqueNotice/>
                  
                  </div>

                  <div className="mb-2 text-sm font-medium text-gray-700">Decide on the notice type</div>

                  <div className="space-y-2">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-sm">Banner notice appears at top/bottom of page</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-sm">Modal popup appears in center of screen</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-sm">Sidebar notification slides in from side</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {/* Smart Calendar */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Calendar</h3>
            <p className="text-gray-600">
              AI-powered scheduling that automatically organizes your classes, study sessions, and extracurricular
              activities.
            </p>
          </div>

          {/* Resource Library */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Resource Library</h3>
            <p className="text-gray-600">
              Access thousands of textbooks, research papers, and study materials tailored to your courses.
            </p>
          </div>

          {/* Collaboration Hub */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaboration Hub</h3>
            <p className="text-gray-600">
              Connect with classmates for group projects, study sessions, and knowledge sharing in real-time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
