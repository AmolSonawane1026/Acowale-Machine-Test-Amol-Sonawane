"use client";

import React from "react";
import { Star, MoreVertical, Eye, Trash2, RefreshCw } from "lucide-react";

const statusBadgeClass = {
  New: "badge-new",
  "In Review": "badge-in-review",
  Resolved: "badge-resolved",
};

export default function FeedbackTable({
  feedbacks = [],
  onStatusChange,
  onDelete,
  onView,
}) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const showActions = !!(onView || onStatusChange || onDelete);

  if (feedbacks.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <p className="text-slate-500 text-sm">No feedback entries found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Date
              </th>
              {showActions && (
                <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {feedbacks.map((fb) => (
              <tr
                key={fb._id}
                className="hover:bg-slate-50/50 transition-colors duration-150"
              >
                {/* User */}
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-800 text-sm">
                    {fb.userName}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {fb.userEmail}
                  </p>
                </td>

                {/* Category */}
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600 font-medium">{fb.category}</span>
                </td>

                {/* Rating */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={
                          s <= fb.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                        }
                      />
                    ))}
                  </div>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      statusBadgeClass[fb.status] || "badge-new"
                    }`}
                  >
                    {fb.status}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-500 font-medium">
                    {formatDate(fb.createdAt)}
                  </span>
                </td>

                {/* Actions */}
                {showActions && (
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <button
                          onClick={() => onView(fb)}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all"
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>
                      )}
                      {onStatusChange && (
                        <button
                          onClick={() => onStatusChange(fb)}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          title="Update status"
                        >
                          <RefreshCw size={15} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(fb)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
