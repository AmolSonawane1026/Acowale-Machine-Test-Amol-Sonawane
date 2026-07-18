"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "../../../lib/api";
import FeedbackTable from "../../../components/FeedbackTable";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

const categories = [
  "All",
  "Product Features",
  "Bug Report",
  "UI/UX",
  "Performance",
  "Customer Service",
  "Other",
];

const statuses = ["All", "New", "In Review", "Resolved"];

const statusBadgeClass = {
  New: "badge-new",
  "In Review": "badge-in-review",
  Resolved: "badge-resolved",
};

export default function FeedbackListPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const fetchFeedbacks = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", "10");
      params.set("sortBy", "createdAt");

      if (search) params.set("search", search);
      if (category !== "All") params.set("category", category);
      if (status !== "All") params.set("status", status);

      const res = await api.get(`/feedback?${params.toString()}`);

      if (res.data.success) {
        setFeedbacks(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  }, [search, category, status]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchFeedbacks(1);
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchFeedbacks]);

  const handleStatusChange = async (fb) => {
    setShowStatusModal(fb);
  };

  const confirmStatusChange = async (newStatus) => {
    if (!showStatusModal) return;

    try {
      const res = await api.patch(`/feedback/${showStatusModal._id}`, {
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(`Status updated to "${newStatus}"`);
        setShowStatusModal(null);
        fetchFeedbacks(pagination.current);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (fb) => {
    setShowDeleteModal(fb);
  };

  const confirmDelete = async () => {
    if (!showDeleteModal) return;

    try {
      const res = await api.delete(`/feedback/${showDeleteModal._id}`);

      if (res.data.success) {
        toast.success("Feedback deleted");
        setShowDeleteModal(null);
        fetchFeedbacks(pagination.current);
      }
    } catch (error) {
      toast.error("Failed to delete feedback");
    }
  };

  const handleView = (fb) => {
    setSelectedFeedback(fb);
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Feedback Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          View, filter, and manage all customer feedback
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or comment..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white text-slate-800">
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-white text-slate-800">
                {s === "All" ? "All Statuses" : s}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {(search || category !== "All" || status !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setStatus("All");
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-sm transition-all font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Active filters count */}
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
          <Filter size={12} />
          <span>
            Showing {feedbacks.length} of {pagination.total} results
          </span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Loading feedbacks..." />
      ) : (
        <FeedbackTable
          feedbacks={feedbacks}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => fetchFeedbacks(pagination.current - 1)}
            disabled={pagination.current <= 1}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} className="text-slate-500" />
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => fetchFeedbacks(page)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                  page === pagination.current
                    ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => fetchFeedbacks(pagination.current + 1)}
            disabled={pagination.current >= pagination.pages}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} className="text-slate-500" />
          </button>
        </div>
      )}

      {/* View Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Feedback Detail</h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold">Name</span>
                <p className="text-slate-800 font-semibold mt-0.5">{selectedFeedback.userName}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold">Email</span>
                <p className="text-slate-800 mt-0.5">{selectedFeedback.userEmail}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold">Category</span>
                <p className="text-slate-800 mt-0.5">{selectedFeedback.category}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold">Rating</span>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s <= selectedFeedback.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold">Comment</span>
                <p className="text-slate-600 mt-0.5 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedFeedback.comment}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold">Status</span>
                <p className="mt-0.5">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadgeClass[selectedFeedback.status] || "badge-new"}`}>
                    {selectedFeedback.status}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold">
                  Submitted On
                </span>
                <p className="text-slate-500 text-xs mt-0.5">
                  {new Date(selectedFeedback.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slide-up">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Update Status
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              Change status for <span className="text-slate-800 font-bold">{showStatusModal.userName}</span>&apos;s feedback
            </p>

            <div className="space-y-2">
              {["New", "In Review", "Resolved"].map((s) => {
                const isCurrent = s === showStatusModal.status;
                
                // Hide 'New' option if the status has already progressed past it
                if (s === "New" && showStatusModal.status !== "New") {
                  return null;
                }
                
                return (
                  <button
                    key={s}
                    onClick={() => confirmStatusChange(s)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isCurrent
                        ? "bg-blue-50 text-blue-600 border border-blue-200 opacity-60 cursor-not-allowed shadow-sm"
                        : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowStatusModal(null)}
              className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slide-up">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Delete Feedback
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              Are you sure you want to delete feedback from{" "}
              <span className="text-slate-800 font-bold">{showDeleteModal.userName}</span>?
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
