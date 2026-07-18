"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const monthNames = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 shadow-lg rounded-xl px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500 mt-1">
          Feedbacks: <span className="text-blue-600 font-bold">{payload[0].value}</span>
        </p>
        {payload[1] && (
          <p className="text-xs text-slate-500 mt-0.5">
            Avg Rating: <span className="text-amber-500 font-bold">{payload[1].value}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function TrendChart({ data = [] }) {
  let chartData = data.map((item) => ({
    name: `${monthNames[item._id.month]} ${item._id.year}`,
    count: item.count,
    avgRating: Math.round(item.avgRating * 10) / 10,
  }));

  if (chartData.length === 1) {
    const item = data[0];
    let prevMonth = item._id.month - 1;
    let prevYear = item._id.year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    chartData.unshift({
      name: `${monthNames[prevMonth]} ${prevYear}`,
      count: 0,
      avgRating: 0,
    });
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] text-sm text-slate-500">
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#colorCount)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
