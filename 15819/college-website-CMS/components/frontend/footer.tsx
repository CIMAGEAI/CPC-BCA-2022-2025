import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Images, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import Logo from "../logo";
import Image from "next/image";
export default function SiteFooter() {
  return (
    <footer className="w-full bg-[#6366F1] text-white px-10 ">
      <div className="container px-4 py-12 md:px-4">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6">
           <Logo/>
            <p className="text-md text-white/90">
            From enrollment to graduation, our comprehensive solution integrates every aspect of college management into one intuitive platform, eliminating silos and creating a unified educational ecosystem.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="rounded-full bg-white p-2 hover:bg-white/90"
              >
                <Twitter className="h-4 w-4 text-[#6366F1]" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white p-2 hover:bg-white/90"
              >
                <Instagram className="h-4 w-4 text-[#6366F1]" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white p-2 hover:bg-white/90"
              >
                <Linkedin className="h-4 w-4 text-[#6366F1]" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white p-2 hover:bg-white/90"
              >
                <Youtube className="h-4 w-4 text-[#6366F1]" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <div className="space-y-2 text-md">
              <p>info.college.co.in</p>
              <p>+91 6206060326</p>
              <p>111-A, Patliputra Patna,Bihar</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Quick Links</h3>
              <nav className="flex flex-col space-y-2 text-md">
                <Link className="hover:underline" href="#">
                  Home
                </Link>
              
                <Link className="hover:underline" href="/AboutUs">
                  AboutUs
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold invisible">Links</h3>
              <nav className="flex flex-col space-y-2 text-md">
                <Link className="hover:underline" href="#">
                  Careers
                </Link>
                
                <Link className="hover:underline" href="contact-us">
                  Contact
                </Link>
                <Link className="hover:underline" href="Gallery">
                  Gallery
                </Link>
               
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-center gap-4 py-6 text-center text-md md:h-16 md:flex-row md:py-0">
          <div className="text-white/60">
            Copyright@{new Date().getFullYear()} All Right Reserved Pagedone.
          </div>
        </div>
      </div>
    </footer>
  );
}
