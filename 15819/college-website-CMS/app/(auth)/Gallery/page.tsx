"use client"

import { EnhancedGallery } from "@/components/enhanced-gallery"
import Logo from "@/components/logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function EnhancedGalleryPage() {
  const [activeTab, setActiveTab] = useState("all")

  const allImages = [
    {
      id: 1,
      src: "/images/LabRoom.jpg",
      alt: "Meeting Room",
      title: "Meeting Room",
      category: "room",
    },
    {
      id: 2,
      src: "/images/college.jpg",
      alt: "College",
      title: "College Infrastructure",
      category: "room",
    },
    {
      id: 3,
      src: "/images/computerLab.jpg",
      alt: "Hi-Tech Lab",
      title: "Hi-Tech Lab",
      category: "room",
    },
    {
      id: 4,
      src: "/images/NewBuilding.jpg",
      alt: "College Building",
      title: "College Building",
      category: "room",
    },
    {
      id: 5,
      src: "/images/G.jpg",
      alt: "Rahul Goswami",
      title: "Rahul Goswami",
      category: "cultural",
    },
    {
      id: 6,
      src: "/images/student.jpg",
      alt: "VR Presentation",
      title: "VR Presentation",
      category: "events",
    },
    {
      id: 7,
      src: "/images/server image.jpg",
      alt: "Server",
      title: "Server",
      category: "events",
    },
    {
      id: 8,
      src: "/images/college_cover.jpg",
      alt: "PlayGround",
      title: "PlayGround",
      category: "sports",
    },
    {
      id: 9,
      src: "/images/cafe.jpg",
      alt: "Workshop ClassRoom",
      title: "Workshop",
      category: "events",
    },
    {
      id: 10,
      src: "/images/seminarRoom.jpg",
      alt: "ClassRoom",
      title: "ClassRoom",
      category: "room",
    },
    {
      id: 11,
      src: "/images/student1.jpg",
      alt: "Grouping",
      title: "Grouping",
      category: "events",
    },
    {
      id: 12,
      src: "/images/studentLab.jpg",
      alt: "Science Lab",
      title: "Science Lab",
      category: "events",
    },
    {
      id: 13,
      src: "/images/computerLabWithStudent.jpg",
      alt: "LabRoom",
      title: "LabRoom",
      category: "room",
    },
    {
      id: 14,
      src: "/images/student2.jpg",
      alt: "Group Revision",
      title: "Revision",
      category: "room",
    },
    {
      id: 15,
      src: "/images/laptop.jpg",
      alt: "Testing Class",
      title: "Test Class",
      category: "room",
    },
    {
      id: 16,
      src: "/images/degree.jpg",
      alt: "Degree",
      title: "Passout",
      category: "cultural",
    },
    {
      id: 17,
      src: "/images/ClassRoomSecond.jpg",
      alt: "ClassRoom",
      title: "ClassRoom",
      category: "room",
    },
    {
      id: 18,
      src: "/images/sports.jpg",
      alt: "Football Tournament",
      title: "Football Tournament",
      category: "sports",
    },
    {
      id: 19,
      src: "/images/kabadi.jpg",
      alt: "Racing Tournament",
      title: "Racing Tournament",
      category: "sports",
    },
    {
      id: 20,
      src: "/images/sports1.jpg",
      alt: "Tournament",
      title: "Tournament",
      category: "sports",
    },
    {
      id: 21,
      src: "/images/spmobile.jpg",
      alt: "Android workshop",
      title: "Android Workshop",
      category: "events",
    },
    {
      id: 22,
      src: "/images/Holi.jpg",
      alt: "Holi Festival",
      title: "Holi Festival",
      category: "cultural",
    },
    {
      id: 23,
      src: "/images/FresherPary.jpg",
      alt: "Complete Degree",
      title: "Complete Degree",
      category: "cultural",
    },
    {
      id: 24,
      src: "/images/VacationTime.jpg",
      alt: "Small Vacation",
      title: "Small Vacation",
      category: "cultural",
    },
  ]

  const filteredImages = activeTab === "all" ? allImages : allImages.filter((img) => img.category === activeTab)

  return (

    <div className="container mx-auto px-4 py-12">
                      <Logo/>
      <h1 className="text-3xl font-bold text-center mb-8">Gallery</h1>

      <Tabs defaultValue="all" className="w-full mb-8" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
            <TabsTrigger value="room">Infrastructure</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <EnhancedGallery images={filteredImages} />
        </TabsContent>
        <TabsContent value="cultural">
          <EnhancedGallery images={filteredImages} />
        </TabsContent>
        <TabsContent value="room">
          <EnhancedGallery images={filteredImages} />
        </TabsContent>
        <TabsContent value="events">
          <EnhancedGallery images={filteredImages} />
        </TabsContent>
        <TabsContent value="sports">
          <EnhancedGallery images={filteredImages} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
