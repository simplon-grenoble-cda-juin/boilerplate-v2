import type { ReactNode } from "react";
import { useAuthContext } from "./useAuthContext";
import { Navigate, useLocation } from "react-router";

interface AuthGuardProps {
  children?: ReactNode;
}

const publicPaths = ["/", "/connexion", "/inscription"];

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, initialized } = useAuthContext();
  const location = useLocation();

  if (!initialized) return <p>Chargement</p>;

  if (publicPaths.includes(location.pathname)) return <>{children}</>;

  if (user) return <>{children ?? null}</>;

  return <Navigate to="/connexion" state={{ from: location }} replace />;
};
