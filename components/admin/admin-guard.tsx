"use client";

import React, { useEffect } from "react";
import { useAgencyContext } from "@/lib/agency-context";
import { useRouter } from "next/navigation";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, authLoading } = useAgencyContext();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if auth verification is finished and user is definitely not logged in
    if (!authLoading && !isLoggedIn) {
      // Fallback check on client storage to avoid false logouts on rapid refresh
      const hasStoredAuth =
        typeof window !== "undefined" &&
        (localStorage.getItem("vmt_auth") === "true" || document.cookie.includes("vmt_auth=true"));

      if (!hasStoredAuth) {
        router.push("/admin/login");
      }
    }
  }, [isLoggedIn, authLoading, router]);

  // While checking stored authentication, show seamless background spinner instead of redirecting
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Authenticating Admin Access...</span>
        </div>
      </div>
    );
  }

  // If verified not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Redirecting to login...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
