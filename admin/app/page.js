"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";

export default function AdminHome() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace("/x7k2m/overview");
      } else {
        router.replace("/auth");
      }
    }
  }, [loading, isAuthenticated, router]);

  return <LoadingSpinner message="Redirecting..." />;
}
