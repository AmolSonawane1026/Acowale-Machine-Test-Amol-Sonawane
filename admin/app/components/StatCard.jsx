import React from "react";

export default function StatCard({ label, value, icon: Icon, trend, color = "indigo" }) {
  const colorMap = {
    indigo: {
      iconBg: "bg-blue-50 border border-blue-100",
      iconColor: "text-blue-600",
      trendColor: "text-blue-500",
    },
    emerald: {
      iconBg: "bg-emerald-50 border border-emerald-100",
      iconColor: "text-emerald-600",
      trendColor: "text-emerald-500",
    },
    amber: {
      iconBg: "bg-amber-50 border border-amber-100",
      iconColor: "text-amber-600",
      trendColor: "text-amber-500",
    },
    blue: {
      iconBg: "bg-blue-50 border border-blue-100",
      iconColor: "text-blue-600",
      trendColor: "text-blue-500",
    },
    purple: {
      iconBg: "bg-purple-50 border border-purple-100",
      iconColor: "text-purple-600",
      trendColor: "text-purple-500",
    },
  };

  const colors = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center`}
        >
          {Icon && <Icon size={20} className={colors.iconColor} />}
        </div>
        {trend && (
          <span className={`text-xs font-semibold ${colors.trendColor}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}
