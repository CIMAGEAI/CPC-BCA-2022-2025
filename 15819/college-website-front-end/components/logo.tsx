import React from 'react'
import Link from "next/link";
import { GraduationCap } from 'lucide-react';
export default function Logo( ){
     return(
            <Link href={"/"} className="flex items-center space-x-2">
            <div className="bg-blue-600 rounded-full p-1">
              <span className="font-bold text-white">
                  <GraduationCap className='w-8 h-8'/>

              </span>
            </div>
            <span className="font-bold text-xl">College</span>
          </Link>
       
    );
}
