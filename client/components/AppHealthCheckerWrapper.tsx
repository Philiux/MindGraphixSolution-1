import React from "react";
import { useAuth } from "../contexts/AuthContext";
import AppHealthChecker from "./AppHealthChecker";

/**
 * Wrapper sécurisé pour AppHealthChecker qui respecte les règles des hooks
 * En conditionnant le rendu au niveau du wrapper, on évite les violations
 */
export const AppHealthCheckerWrapper: React.FC = () => {
  const { isAdmin } = useAuth();

  // Conditionner le rendu ici évite les problèmes de hooks
  if (!isAdmin) {
    return null;
  }

  return <AppHealthChecker />;
};

export default AppHealthCheckerWrapper;
