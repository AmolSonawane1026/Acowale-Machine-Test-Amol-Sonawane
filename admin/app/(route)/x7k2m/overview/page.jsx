"use client";

import React, { useState, useEffect } from "react";
import api from "../../../lib/api";
import StatCard from "../../../components/StatCard";
import CategoryChart from "../../../components/CategoryChart";
import TrendChart from "../../../components/TrendChart";
import FeedbackTable from "../../../components/FeedbackTable";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  MessageSquare,
  Star,
  TrendingUp,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

export default function OverviewPage() {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasFetched = React.useRef(false);

  // States for lazy loading recent feedback
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const recentRef = React.useRef(null);
  const recentFetched = React.useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !recentFetched.current) {
          recentFetched.current = true;
          fetchRecentFeedback();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (recentRef.current) {
      observer.observe(recentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  const fetchData = async () => {
    try {
      const [statsRes, summaryRes] = await Promise.all([
        api.get("/analytics/stats"),
        api.get("/analytics/summary"),
      ]);

      if (statsRes.data.success && summaryRes.data.success) {
        setStats(statsRes.data.data);
        setAnalytics(summaryRes.data.data);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentFeedback = async () => {
    setLoadingRecent(true);
    try {
      const res = await api.get("/analytics/recent");
      if (res.data.success) {
        setRecentFeedback(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load recent feedback");
    } finally {
      setLoadingRecent(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const promises = [
        api.get("/analytics/stats"),
        api.get("/analytics/summary"),
      ];
      if (recentFetched.current) {
        promises.push(api.get("/analytics/recent"));
      }

      const results = await Promise.all(promises);

      if (results[0].data.success) setStats(results[0].data.data);
      if (results[1].data.success) setAnalytics(results[1].data.data);
      if (results[2] && results[2].data.success) {
        setRecentFeedback(results[2].data.data);
      }

      toast.success("Dashboard metrics updated");
    } catch (error) {
      toast.error("Failed to refresh dashboard data");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  if (!analytics || !stats) {
    return (
      <div className="text-center py-20 text-slate-500">
        Failed to load analytics data.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Analytics and insights from customer feedback
          </p>
        </div>
        <div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all font-semibold shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Feedback"
          value={stats.totalFeedback}
          icon={MessageSquare}
          color="indigo"
        />
        <StatCard
          label="New"
          value={stats.new}
          icon={Clock}
          color="blue"
        />
        <StatCard
          label="Resolved"
          value={stats.resolved}
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            Category Distribution
          </h3>
          <CategoryChart data={analytics.categoryDistribution} />
        </div>

        {/* Monthly Trend */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            Monthly Trend
          </h3>
          <TrendChart data={analytics.monthlyTrend} />
        </div>
      </div>


      {/* Recent Feedback - Lazy Loaded on Scroll */}
      <div ref={recentRef} className="space-y-3 min-h-[150px]">
        <h3 className="text-sm font-bold text-slate-800">
          Recent Feedback
        </h3>
        {loadingRecent ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 flex items-center justify-center">
            <p className="text-sm text-slate-500 animate-pulse">Loading recent feedback...</p>
          </div>
        ) : (
          <FeedbackTable feedbacks={recentFeedback} />
        )}
      </div>
    </div>
  );
}
