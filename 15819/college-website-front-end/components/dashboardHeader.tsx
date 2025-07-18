"use client";

import * as React from "react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";



const data = {
  user: {
    name: "Admin",
    email: "",
    avatar: "",
  },
};



export default function HeaderDashboard() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter()
  const fetchLogout = async()=>{
    try {
      const response = await fetch("http://localhost:8000/api/v1/user/logout", {
        method: "GET",
        headers: { 
          "Accept":"application/json",
          "Content-Type": "application/json" },
        credentials: "include", // to send cookies (for JWT auth)
        
      });
  
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Logout failed");
      }
  
      toast.success("✅ Logout successful");
      router.push("/"); 
    } catch (error: any) {
          toast.error(error.message || "Something went wrong");
          console.error("Logout error:", error);
        }
  }
  return (
    <div className="w-full bg-white border-b shadow-sm px-1 sm:px-2 md:px-2">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <span className="sr-only">Toggle theme</span>
            <Sun className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Plus className="h-5 w-5" />
            <span className="sr-only">Add new</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 p-2 rounded-lg"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={data.user.avatar} alt={data.user.name} />
                  <AvatarFallback>Cp</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start text-sm">
                  <span className="font-medium">{data.user.name}</span>
                  <span className="text-xs text-gray-500">
                    {data.user.email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={data.user.avatar}
                      alt={data.user.name}
                    />
                    <AvatarFallback>Ck</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">{data.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {data.user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator /> */}
              <DropdownMenuItem >
                <Button variant="outline" onClick={fetchLogout}>
                <LogOut className="mr-2 h-4 w-4"  />
                Log out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function Sun({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
