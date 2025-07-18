import HeaderDashboard from '@/components/dashboardHeader';
import Logo from '@/components/logo'
import Menu from '@/components/navbar';
import React, {ReactNode} from 'react'

export default function DashboardLayout({children}:Readonly<{children:React.ReactNode;}>){
    return<div className='h-screen flex'>
            
            {/* Left */}
            <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-2">
               <div className='w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 '>
                <Logo/>
               </div>
               <Menu/>
            </div>

            {/* Right */}
            <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll p-2">
            <HeaderDashboard/>
            {children}
            </div>
        </div>

}