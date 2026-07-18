import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="text-indigo-400 animate-spin" />
        <p className="text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}
