"use client";

import React, { useState } from "react";
import { Send, Star, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const categories = [
  "Product Features",
  "Bug Report",
  "UI/UX",
  "Performance",
  "Customer Service",
  "Other",
];

const categoryEmojis = {
  "Product Features": "✨",
  "Bug Report": "🐛",
  "UI/UX": "🎨",
  Performance: "⚡",
  "Customer Service": "💬",
  Other: "📝",
};

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    category: "",
    rating: 0,
    comment: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim() || formData.userName.trim().length < 2) {
      newErrors.userName = "Name must be at least 2 characters";
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      newErrors.userEmail = "Please enter a valid email";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.rating || formData.rating < 1) {
      newErrors.rating = "Please select a rating";
    }

    if (!formData.comment.trim() || formData.comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        toast.success("Feedback submitted successfully!");
        setFormData({
          userName: "",
          userEmail: "",
          category: "",
          rating: 0,
          comment: "",
        });
        setErrors({});

        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        toast.error(data.message || "Failed to submit feedback");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-8 md:p-12 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-3">Thank You!</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Your feedback has been submitted successfully. We truly appreciate your
          time and will use your input to improve our services.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-100 shadow-xl rounded-2xl p-6 md:p-8 space-y-6 animate-slide-up"
      noValidate
    >
      {/* Header inside the form card */}
      <div className="text-center md:text-left border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Acowale Feedback</h2>
        <p className="text-sm text-slate-500 mt-1">Please spare a moment to share your valuable thoughts with us.</p>
      </div>

      {/* Name & Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-semibold text-slate-600 mb-2"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.userName
              ? "border-red-400 focus:border-red-500"
              : "border-slate-200 focus:border-blue-500 focus:bg-white"
              } text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 ${errors.userName
                ? "focus:ring-red-100"
                : "focus:ring-blue-100"
              } transition-all duration-200`}
          />
          {errors.userName && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.userName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="userEmail"
            className="block text-sm font-semibold text-slate-600 mb-2"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.userEmail
              ? "border-red-400 focus:border-red-500"
              : "border-slate-200 focus:border-blue-500 focus:bg-white"
              } text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 ${errors.userEmail
                ? "focus:ring-red-100"
                : "focus:ring-blue-100"
              } transition-all duration-200`}
          />
          {errors.userEmail && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.userEmail}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-slate-600 mb-3">
          Select Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, category: cat }));
                if (errors.category)
                  setErrors((prev) => ({ ...prev, category: "" }));
              }}
              className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 ${formData.category === cat
                ? "bg-blue-50 border-blue-300 text-blue-600 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-700"
                }`}
            >
              <span className="mr-1.5">{categoryEmojis[cat]}</span>
              {cat}
            </button>
          ))}
        </div>
        {errors.category && (
          <p className="mt-2 text-xs text-red-500 font-medium">{errors.category}</p>
        )}
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-slate-600 mb-3">
          Overall Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, rating: star }));
                if (errors.rating)
                  setErrors((prev) => ({ ...prev, rating: "" }));
              }}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-1 transition-transform duration-150 hover:scale-110 active:scale-95"
            >
              <Star
                size={30}
                className={`transition-colors duration-150 ${star <= (hoveredStar || formData.rating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-300"
                  }`}
              />
            </button>
          ))}
          {formData.rating > 0 && (
            <span className="ml-3 text-sm text-slate-500 font-semibold">
              {formData.rating} / 5
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="mt-2 text-xs text-red-500 font-medium">{errors.rating}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-semibold text-slate-600 mb-2"
        >
          Add Comments <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us about your experience... (minimum 10 characters)"
          className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.comment
            ? "border-red-400 focus:border-red-500"
            : "border-slate-200 focus:border-blue-500 focus:bg-white"
            } text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 ${errors.comment
              ? "focus:ring-red-100"
              : "focus:ring-blue-100"
            } transition-all duration-200 resize-none`}
        />
        <div className="flex items-center justify-between mt-1.5">
          {errors.comment ? (
            <p className="text-xs text-red-500 font-medium">{errors.comment}</p>
          ) : (
            <span />
          )}
          <span
            className={`text-xs ${formData.comment.length > 1000
              ? "text-red-500"
              : "text-slate-400"
              }`}
          >
            {formData.comment.length} / 1000
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={18} />
            Submit Feedback
          </>
        )}
      </button>
    </form>
  );
}
