"use client";

import React from "react";
import Link from "next/link";
import { MessageSquareHeart } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          {/* Logo - Centered */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md transition-shadow duration-300">
              <MessageSquareHeart size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-slate-800">
                Acowale
              </span>
              <span className="text-blue-600 ml-1">Feedback</span>
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
