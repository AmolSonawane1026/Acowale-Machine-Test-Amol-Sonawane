"use client";

import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FeedbackForm from "./components/FeedbackForm";

import Image from "next/image";
import feedbackIllustration from "../public/feedback_illustration.png";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* <Navbar /> */}

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 w-full min-h-screen">
        
        {/* Left panel - Vector Illustration Section */}
        <div className="lg:col-span-5 bg-blue-600 text-white p-8 md:p-12 lg:p-16 flex flex-col justify-start gap-10 lg:gap-14 relative overflow-hidden">
          {/* Background design elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -z-0 translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700/40 rounded-full blur-3xl -z-0 -translate-x-20 translate-y-20" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4 lg:text-4xl">
              Acowale Feedback
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed max-w-sm">
              Your opinion matters to us. Let us know how we are doing and help us make the experience even better.
            </p>
          </div>

          {/* Generated Customer Feedback Illustration */}
          <div className="relative z-10 my-10 lg:my-0 flex justify-center items-center w-full">
            <Image 
              src={feedbackIllustration} 
              alt="Feedback Illustration" 
              className="w-full max-w-[350px] lg:max-w-[460px] object-contain drop-shadow-2xl rounded-3xl"
              priority
            />
          </div>

          {/* <div className="relative z-10 text-[10px] text-blue-200">
            © {new Date().getFullYear()} Acowale Technologies. Built with precision.
          </div> */}
        </div>

        {/* Right panel - Form Section */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-2xl w-full mx-auto">
            <FeedbackForm />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
