"use client";

import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your admin profile
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100">
          Profile Information
        </h3>

        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <User size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Name
              </p>
              <p className="text-slate-800 text-sm font-semibold mt-0.5">
                {user?.name || "Admin"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
              <Mail size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Email
              </p>
              <p className="text-slate-800 text-sm font-semibold mt-0.5">
                {user?.email || "admin@acowale.com"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Shield size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Role
              </p>
              <p className="text-slate-800 text-sm font-semibold mt-0.5 capitalize">
                {user?.role || "admin"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
