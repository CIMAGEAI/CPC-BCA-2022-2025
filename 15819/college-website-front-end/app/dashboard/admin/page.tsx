import Image from "next/image"
import { Bell, ChevronDown, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Hello, Rahul <span className="text-yellow-400">👋</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Nice to have you back, what an exciting day!
              <br />
              Get ready and continue your lesson today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 w-[200px]"
              />
            </div>
            <button className="p-2 rounded-full bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Course */}
            <section>
              <h2 className="text-xl font-bold mb-4">Today's course</h2>
              <div className="space-y-4">
                {/* Biology Course */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-full">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            stroke="#4CAF50"
                            strokeWidth="2"
                          />
                          <path
                            d="M8 12L11 15L16 9"
                            stroke="#4CAF50"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Node js</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          <span>50 min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          <span>6 assignment</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M16 3.13C17.7699 3.58317 19.0078 5.17799 19.0078 7.005C19.0078 8.83201 17.7699 10.4268 16 10.88"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          <span>312 students</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-green-500 font-bold text-xl">79%</div>
                  </div>
                  <div className="mt-4">
                    <Progress value={79} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="text-sm px-6">
                      Skip
                    </Button>
                    <Button className="text-sm px-6 bg-green-500 hover:bg-green-600">Continue</Button>
                  </div>
                </div>

                {/* Color Theory Course */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-50 p-3 rounded-full">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="#FF9800" strokeWidth="2" />
                          <path d="M12 6V18" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />
                          <path d="M6 12H18" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Color Theory</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          <span>45 min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          <span>2 assignment</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M16 3.13C17.7699 3.58317 19.0078 5.17799 19.0078 7.005C19.0078 8.83201 17.7699 10.4268 16 10.88"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          <span>256 students</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-green-500 font-bold text-xl">64%</div>
                  </div>
                  <div className="mt-4">
                    <Progress value={64} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="text-sm px-6">
                      Skip
                    </Button>
                    <Button className="text-sm px-6 bg-green-500 hover:bg-green-600">Continue</Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Class */}
            <section>
              <h2 className="text-xl font-bold mb-4">Your class</h2>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all" className="px-4">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="design" className="px-4">
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="science" className="px-4">
                    Science
                  </TabsTrigger>
                  <TabsTrigger value="coding" className="px-4">
                    Coding
                  </TabsTrigger>
                </TabsList>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-full">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="#4CAF50" strokeWidth="2" />
                          <path
                            d="M8 12L11 15L16 9"
                            stroke="#4CAF50"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">ReactJs</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          <span>45 min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          <span>2 assignment</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M16 3.13C17.7699 3.58317 19.0078 5.17799 19.0078 7.005C19.0078 8.83201 17.7699 10.4268 16 10.88"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          <span>256 students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      alt="Profile"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold">Rahul Kumar</h3>
                  <p className="text-xs text-gray-500">Student, INA</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-indigo-600 font-bold text-xl">24</div>
                  <div className="text-xs text-gray-500">Course</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-indigo-600 font-bold text-xl">18</div>
                  <div className="text-xs text-gray-500">Certification</div>
                </div>
              </div>
            </div>

            {/* Points Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#4CAF50" fillOpacity="0.2" stroke="#4CAF50" strokeWidth="2" />
                    <path d="M12 7V17M7 12H17" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-indigo-600 font-bold text-xl">2400 XP</div>
                  <div className="text-xs text-gray-500">Point</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-sm">
                  Redeem
                </Button>
                <Button className="flex-1 text-sm bg-green-500 hover:bg-green-600">Collect Point</Button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <div className="flex justify-between mb-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=24&width=24"
                      alt="Consultation"
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                  <button className="text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <h3 className="font-semibold mb-1">Consultation</h3>
                <p className="text-xs text-gray-600">Get a mentor to help your learning process</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="flex justify-between mb-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=24&width=24"
                      alt="Set target"
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                  <button className="text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <h3 className="font-semibold mb-1">Set target</h3>
                <p className="text-xs text-gray-600">Set target to reach and your study timeline</p>
              </div>
            </div>

            {/* Learning Activity */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Learning activity</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 bg-indigo-50 text-indigo-600 border-indigo-200"
                  >
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-1"></span>
                    Materials
                  </Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1 bg-pink-50 text-pink-600 border-pink-200">
                    <span className="w-2 h-2 bg-pink-600 rounded-full mr-1"></span>
                    Exams
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>1 3rd semester</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="h-[200px] relative">
                {/* This is a placeholder for the chart - in a real app you'd use a chart library */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 400 200" width="100%" height="100%">
                    {/* Purple line */}
                    <path
                      d="M0,100 C50,80 100,60 150,70 C200,80 250,120 300,90 C350,60 400,80 400,100"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="3"
                      opacity="0.5"
                    />
                    {/* Pink line */}
                    <path
                      d="M0,120 C50,140 100,130 150,120 C200,110 250,140 300,150 C350,160 400,140 400,130"
                      fill="none"
                      stroke="#EC4899"
                      strokeWidth="3"
                      opacity="0.5"
                    />

                    {/* Highlight point */}
                    <circle cx="300" cy="90" r="6" fill="#8B5CF6" />
                    <circle cx="300" cy="90" r="10" fill="#8B5CF6" fillOpacity="0.3" />

                    {/* Vertical line */}
                    <line x1="300" y1="0" x2="300" y2="200" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="4" />

                    {/* Hours label */}
                    <rect x="285" y="60" width="50" height="20" rx="10" fill="#8B5CF6" />
                    <text x="310" y="74" fontSize="10" fill="white" textAnchor="middle" dominantBaseline="middle">
                      4.2 hours
                    </text>

                    {/* X-axis labels */}
                    <text x="0" y="190" fontSize="10" fill="#6B7280" textAnchor="middle">
                      Aug
                    </text>
                    <text x="80" y="190" fontSize="10" fill="#6B7280" textAnchor="middle">
                      Sept
                    </text>
                    <text x="160" y="190" fontSize="10" fill="#6B7280" textAnchor="middle">
                      Oct
                    </text>
                    <text x="240" y="190" fontSize="10" fill="#6B7280" textAnchor="middle">
                      Nov
                    </text>
                    <text x="320" y="190" fontSize="10" fill="#6B7280" textAnchor="middle">
                      Dec
                    </text>
                    <text x="400" y="190" fontSize="10" fill="#6B7280" textAnchor="middle">
                      Jan
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
