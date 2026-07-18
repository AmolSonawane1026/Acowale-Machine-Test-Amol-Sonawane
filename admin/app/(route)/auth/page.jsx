"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/x7k2m/overview");
    }
  }, [isAuthenticated, router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        const result = await login(values.email, values.password);

        if (result.success) {
          toast.success("Welcome back!");
          router.push("/x7k2m/overview");
        } else {
          toast.error(result.message || "Invalid credentials");
        }
      } catch (error) {
        const msg =
          error.response?.data?.message || "Login failed. Please try again.";
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white border border-slate-200 shadow-xl rounded-2xl p-8 space-y-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-600 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  formik.touched.email && formik.errors.email
                    ? "text-red-400"
                    : "text-slate-400"
                }`}
              />
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Please enter your email here"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1.5 text-xs font-semibold text-red-500 animate-fade-in animate-duration-150">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-600 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  formik.touched.password && formik.errors.password
                    ? "text-red-400"
                    : "text-slate-400"
                }`}
              />
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1.5 text-xs font-semibold text-red-500 animate-fade-in animate-duration-150">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>

          
        </form>
      </div>
    </div>
  );
}

