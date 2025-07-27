"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomCarousel from "../custom-carousel";
import TextInput from "@/components/FormInputs/TextInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import Logo from "@/components/logo";
import PasswordInput from "@/components/FormInputs/PasswordInput";
import { LockIcon, LogInIcon, MailIcon } from "lucide-react";
import { toast } from "react-toastify";

export type LoginInputProps = {
  email: string;
  password: string;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputProps>();
  const router = useRouter();

  async function onSubmit(data: LoginInputProps) {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/user/login", {
        method: "POST",
        headers: { 
          "Accept":"application/json",
          "Content-Type": "application/json" },
        credentials: "include", // to send cookies (for JWT auth)
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found. Please register first.");
        } else if (response.status === 401) {
          throw new Error("Invalid email or password.");
        } else {
          throw new Error(result.error || "Login failed");
        }
      }

      // Store user info in localStorage or session if needed
      localStorage.setItem("user", JSON.stringify(result.data));
      
      toast.success("✅ Login successful");
      router.push("/dashboard/admin"); // Redirect after successful login
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full lg:grid h-screen lg:min-h-[600px] lg:grid-cols-2 relative">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6 mt-5 md:mt-5">
          <div className="absolute left-1/3 md:top-5 md:left-5">
            <Logo />
          </div>
          <div className="grid gap-2 text-center mt-10 md:mt-0">
            <h1 className="text-3xl font-bold">Login to your account</h1>
            <p className="text-gray-500">Enter your credentials to continue</p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
        label="Email Address"
        register={register}
        name="email"
        type="email"
        errors={errors}
        placeholder="Enter your e-mail"
      />
      <PasswordInput
        label="Password"
        register={register}
        name="password"
        type="password"
        errors={errors}
        placeholder="Enter your password"
      />
            <SubmitButton
              buttonIcon={LogInIcon}
              title="Sign In"
              loading={isLoading}
              loadingTitle="Signing in..."
            />
          </form>
  
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <CustomCarousel />
      </div>
    </div>
  );
}