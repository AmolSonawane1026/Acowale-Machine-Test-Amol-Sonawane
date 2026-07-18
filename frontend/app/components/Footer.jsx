import React from "react";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[rgba(5,5,15,0.8)] backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Acowale 
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Machine Test 
            by Amol Sonawane
          </p>
        </div>
      </div>
    </footer>
  );
}
