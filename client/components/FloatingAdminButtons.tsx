import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { SystemHealthDashboard } from "./SystemHealthDashboard";
import { PerformanceMonitor } from "./PerformanceMonitor";

export const FloatingAdminButtons: React.FC = () => {
  const { currentUser, isMindAdmin } = useAuth();

  // Philippe a accès complet en tant qu'administrateur suprême
  const isPhilippeSupreme =
    currentUser?.email === "philippefaizsanon@gmail.com";
  const isMindAdminStrict =
    isMindAdmin ||
    currentUser?.email === "admin@mindgraphix.com" ||
    currentUser?.role === "mind";

  // Ne pas afficher si ce n'est pas Philippe ou si c'est un admin Mind
  if (!isPhilippeSupreme || isMindAdminStrict) return null;

  return (
    <div className="floating-admin-buttons">
      {/* System Health Monitor - essentiel */}
      <SystemHealthDashboard />

      {/* Performance Monitor - essentiel */}
      <PerformanceMonitor />
    </div>
  );
};
