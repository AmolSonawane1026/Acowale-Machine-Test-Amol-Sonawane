"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 shadow-lg rounded-xl px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">{payload[0].name}</p>
        <p className="text-xs text-slate-500 mt-1">
          Count: <span className="text-slate-800 font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function CategoryChart({ data = [] }) {
  const chartData = data.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] text-sm text-slate-500">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              opacity={0.85}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-xs text-slate-400 ml-1">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
