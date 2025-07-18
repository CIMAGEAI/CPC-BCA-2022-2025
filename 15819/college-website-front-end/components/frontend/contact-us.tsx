"use client";
import React, { useState } from "react";
import Logo from "../logo";
import { useForm } from "react-hook-form";
import TextInput from "../FormInputs/TextInput";
import PasswordInput from "../FormInputs/PasswordInput";
import SubmitButton from "../FormInputs/SubmitButton";
import { Mail, MailIcon, Send, TextIcon, User } from "lucide-react";
import TextArea from "../FormInputs/TextAreaInput";
import PhoneInput from "../FormInputs/PhoneInput";
import toast from "react-hot-toast";
export type ContactUsInputProps = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};

const ContactV1: React.FC = () => {
 const [isLoading, setIsLoading] = useState(false);
   const {
     register,
     handleSubmit,
     reset,
     formState: { errors },
   } = useForm<ContactUsInputProps>();
  //  async function onSubmit(data: RegisterInputProps) {
  //    console.log(data);
  //  }


   async function onSubmit(data: ContactUsInputProps) {
       setIsLoading(true);
       try {
         const response = await fetch("http://localhost:8000/api/v1/message/contact", {
           method: "POST",
           headers: { 
             "Accept":"application/json",
             "Content-Type": "application/json" },
           
           body: JSON.stringify(data),
         });
   
         const result = await response.json();
   
         if (!response.ok) {
          throw new Error(result.error || "Something went wrong while sending MESSAGE");

         }
   
         // Store user info in localStorage or session if needed
         localStorage.setItem("user", JSON.stringify(result.data));
         
         toast.success("✅ MESSAGE successful send");
       } catch (error: any) {
         toast.error(error.message || "Something went wrong");
         console.error("Occurred ERROR while sending you message:", error);
       } finally {
         setIsLoading(false);
       }
     }

  return (
    
    <section className="bg-gray-100 py-5 px-4">

      <Logo/>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl lg:text-5xl font-bold text-green-900 mb-2 py-10">
          Contact-Us
        </h2>
        <p className="text-gray-600 mb-8 pb-4">
        To emerge as a center of excellence in education, inspiring students to realize their potential and contribute meaningfully to society through innovation, ethical leadership, and professional expertise.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-4">
            <div className="bg-green-800 text-white p-6 rounded-2xl">
              <h3 className="font-semibold text-5xl mb-2">
              Our Mission
              </h3>
              <p className="text-sm mb-4 py-4">
           
              To provide quality education that blends theoretical knowledge with practical skills, fostering an environment of research, innovation, and entrepreneurship while instilling values of social responsibility and ethical conduct.
              </p>
             
            </div>
            <div className="bg-lime-400 p-6 rounded-2xl">
              <h3 className="font-semibold mb-2 text-4xl">
              We're Here to Help
              </h3>
              <p className="text-sm mb-4 py-4">
              Our dedicated team is committed to providing prompt and helpful assistance to all prospective and current students, parents, alumni, and visitors. We welcome your inquiries and look forward to connecting with you.
              </p>
        
            </div>
          </div>

          <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Sign up to get your college onboard</h3>
            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
           
            <TextInput
             label="Full Name"
             register={register}
             name="fullname"
             type="text"
             errors={errors}
             placeholder="Enter your Full Name"
             icon={User}
           />
         
           <TextInput
             label="Email Address"
             register={register}
             name="email"
             type="email"
             errors={errors}
             placeholder="Enter your e-mail"
             icon={Mail}
           />
 
         
           <PhoneInput
             label="Phone"
             register={register}
             name="phone"
             errors={errors}
             placeholder="Enter your Phone Number"
           />
            <TextArea
             label="Enquiry Reason"
             register={register}
             name="enquiryReason"
             errors={errors}
            
           />
           
           <SubmitButton
           buttonIcon={Send}
             title="Submit"
             loading={isLoading}
             loadingTitle="Sending In please wait..."
           />
         </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactV1;
