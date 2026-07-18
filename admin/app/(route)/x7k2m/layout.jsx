"use client";

import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <main className="ml-[240px] p-6 lg:p-8 bg-slate-50 min-h-screen">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
