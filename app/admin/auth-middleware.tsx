"use client";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function AdminAuthMiddleware({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const isInitPage = pathname === "/admin/init";

  useEffect(() => {
    if (!loading) {
      if (!isLoginPage && !isInitPage && (!user || !isAdmin)) {
        router.push("/admin/login");
      } else if (isLoginPage && user && isAdmin) {
        router.push("/admin/dashboard");
      }
    }
  }, [user, isAdmin, loading, router, isLoginPage, isInitPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
