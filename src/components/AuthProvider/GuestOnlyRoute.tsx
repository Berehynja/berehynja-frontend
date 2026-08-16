import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./useAuth";
import { PageLoader } from "../ui/PageLoader";

interface GuestOnlyRouteProps {
  children: ReactNode;
}

export const GuestOnlyRoute = ({ children }: GuestOnlyRouteProps) => {
  const { isAdmin, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <PageLoader visible />;
  }

  if (isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};
