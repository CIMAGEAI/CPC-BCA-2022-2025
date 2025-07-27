import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Gallery() {
  const memories = [
    {
      id: 1,
      title: "KRANTITRITH PROGRAM",
      tag: "KRANTITRITH PROGRAM",
      image: "/placeholder.svg?height=400&width=600",
      description:
        "Students of CIMAGE Group of Institutions have participated and won Group Dance Competition (2019-20). Organized by PGDM batch, this event was full of colors and energy. There was fun, dance and college...",
    },
    {
      id: 2,
      title: "CIMAGE ALUMNI MEET DELHI",
      tag: "CIMAGE ALUMNI MEET DELHI",
      image: "/placeholder.svg?height=400&width=600",
      description:
        "Glimpses of Delhi-NCR Alumni Meet organized at Delhi. Many students have participated, few of them were working in MNCs like Microsoft, IBM, Publicis Sapient, HDFC, MTI India, Cognizant, Accenture, etc. It...",
    },
    {
      id: 3,
      title: "INDEPENDENCE DAY CELEBRATION 2023",
      tag: "INDEPENDENCE DAY CELEBRATION 2023",
      image: "/placeholder.svg?height=400&width=600",
      description:
        "Independence Day Celebration at CIMAGE. Prof. Neeraj Agarwal, Director of CIMAGE, hoisted the Flag and addressed the students. On the occasion of Independence Day, many students performed dance, singing, etc...",
    },
    {
      id: 4,
      title: "ANNUAL CULTURAL FEST",
      tag: "CULTURAL EVENT",
      image: "/placeholder.svg?height=400&width=600",
      description:
        "Our annual cultural fest brought together talents from across departments. Students showcased their artistic abilities through music, dance, and theatrical performances that captivated the audience...",
    },
    {
      id: 5,
      title: "TECHNOLOGY SUMMIT 2023",
      tag: "TECH EVENT",
      image: "/placeholder.svg?height=400&width=600",
      description:
        "The Technology Summit featured innovative projects from our engineering students. Industry experts provided valuable feedback and several projects received recognition for their practical applications...",
    },
    {
      id: 6,
      title: "SPORTS CHAMPIONSHIP",
      tag: "SPORTS EVENT",
      image: "/placeholder.svg?height=400&width=600",
      description:
        "Our annual inter-college sports championship saw fierce competition across multiple disciplines. The event fostered team spirit and highlighted the importance of physical fitness alongside academic excellence...",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="Our Memories Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-center">Our Memories</h1>
          <p className="text-sm md:text-base lg:text-lg max-w-2xl text-center px-4">
            Celebrating moments that define our journey together
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="#"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all duration-300 text-sm"
            >
              Home
            </Link>
            <Link
              href="#"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all duration-300 text-sm"
            >
              Our Memories
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-[240px] overflow-hidden">
                <Image
                  src={memory.image || "/placeholder.svg"}
                  alt={memory.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-0">
                  <div className="bg-red-500 text-white text-xs py-1 px-3 rounded-r-full shadow-md">{memory.tag}</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <button className="bg-white text-red-500 px-4 py-2 rounded-full font-medium text-sm transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                    View Gallery
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-red-500 transition-colors duration-300">
                  {memory.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{memory.description}</p>
                <Link
                  href="#"
                  className="inline-flex items-center text-red-500 hover:text-red-600 text-sm font-medium transition-colors duration-300"
                >
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
