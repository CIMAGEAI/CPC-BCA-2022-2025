import { ArrowRight } from "lucide-react"
import * as React from "react"

export default function Facility() {
  return (
    <div className="bg-white px-2 py-2 ">
    <div className="max-w-12xl mx-auto">
     <div className="w-full bg-[#0118D8] text-white py-4 px-4 rounded-lg">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-6xl font-bold text-center mb-6">Our Best Features</h2>

        <p className="text-center mb-6 max-w-6xl mx-auto">
          College is ranked as top BCA college in Patna Bihar which offers world-class education
          and highest Campus Placement.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <FeatureItem text="World Class Infrastructure" />
          <FeatureItem text="Hi-Tech Digital Library" />
          <FeatureItem text="Ranked No.1 College in Bihar by Times of India" />
          <FeatureItem text="Best B-School of India East by ASSOCHAM" />
          <FeatureItem text="Modern Facility Computer Labs" />
          <FeatureItem text="Triple mode education (Classroom/Zoom/Youtube)" />
          <FeatureItem text="Job Oriented Trainings with IT Collaboration" />
          <FeatureItem text="Most Emerging Institute for Management Education Award" />
        </div>
      </div>
    </div>
       
        </div>
        </div>
   
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 py-2">
      <ArrowRight className="h-5 w-5 text-white shrink-0 mt-0.5" />
      <span>{text}</span>
    </div>
  )
}
