import React from "react";
import { useAuth } from "../contexts/AuthContext";

interface SafeAdminWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SafeAdminWrapper: React.FC<SafeAdminWrapperProps> = ({
  children,
  fallback = null,
}) => {
  try {
    const auth = useAuth();

    // Vérifier que le contexte est bien initialisé
    if (!auth || !auth.isInitialized || typeof auth.isAdmin === "undefined") {
      return <>{fallback}</>;
    }

    return <>{children}</>;
  } catch (error) {
    console.warn("SafeAdminWrapper caught error:", error);
    return <>{fallback}</>;
  }
};
