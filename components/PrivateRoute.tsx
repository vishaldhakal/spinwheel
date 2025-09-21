// app/components/PrivateRoute.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./providers/AuthProvider";
import FullScreenLoader from "./Loading";

export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, router, isLoading]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
