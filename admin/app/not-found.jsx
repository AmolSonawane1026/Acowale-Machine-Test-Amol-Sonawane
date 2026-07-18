"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, FileQuestion, LogIn } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-md w-full animate-fade-in space-y-6">
        {/* Animated Icon Card */}
        <div className="relative mx-auto w-24 h-24 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center shadow-md animate-bounce [animation-duration:3s]">
          <FileQuestion size={44} className="text-blue-600" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        </div>

        {/* 404 Heading */}
        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
            Sorry, we couldn&apos;t find the page you are looking for. It might have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all shadow-sm active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          
        </div>

       
      </div>
    </div>
  );
}
