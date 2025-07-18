import Course from '@/components/frontend/course';
import { Dashboard } from '@/components/frontend/dashboard';
import Facility from '@/components/frontend/facility';
import Features from '@/components/frontend/feature';
import SiteFooter from '@/components/frontend/footer';
import LogoCloude from '@/components/frontend/logo-cloude';
import MidSection from '@/components/frontend/mid-section';
import SiteHeader from '@/components/site-header';
import React from 'react';

export default function Home() {
  return (
   <div>
    <SiteHeader session={null}/>
    <MidSection/>
    <LogoCloude/>
    <Facility/>
    <Course/>
    <Dashboard/>
    <Features/>
    <SiteFooter/>
   </div>
  );
}
