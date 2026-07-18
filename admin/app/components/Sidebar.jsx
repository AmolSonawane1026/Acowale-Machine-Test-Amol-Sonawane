"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
  MessageSquareHeart,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/x7k2m/overview",
    icon: LayoutDashboard,
  },
  {
    label: "Feedbacks",
    href: "/x7k2m/fe-bk",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/x7k2m/st-ng",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-white border-r border-slate-200 flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-slate-200">
        <Link href="/x7k2m/overview" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <MessageSquareHeart size={18} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-800 block leading-tight">
              Acowale Feedback
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-blue-600" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
