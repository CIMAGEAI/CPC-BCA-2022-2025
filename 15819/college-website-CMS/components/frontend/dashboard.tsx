import * as React from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import Image from "next/image";

export function Dashboard() {
  return (
   <div className="bg-white px-12 py-4 ">
   <div className="max-w-6xl mx-auto">
   <Card className="w-full">
    <CardContent>
      <Image src="/images/campus1.jpg" alt="Dashboard" width={3991} height={2661} className="w-full rounded-lg"/>
    </CardContent>
  </Card>
   </div>
   </div>
  )
}
