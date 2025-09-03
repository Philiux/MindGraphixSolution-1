import React from "react";
import { useAuth } from "../contexts/AuthContext";

export const AuthDebugger: React.FC = () => {
  const { isAdmin, isSuperAdmin, isMindAdmin, currentUser, isLoggedIn } =
    useAuth();

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 rounded-lg p-4 text-sm max-w-xs">
      <h3 className="font-bold text-yellow-800 mb-2">Debug Auth Status</h3>
      <div className="space-y-1 text-yellow-700">
        <div>Connecté: {isLoggedIn ? "✅" : "❌"}</div>
        <div>Admin: {isAdmin ? "✅" : "❌"}</div>
        <div>Super Admin: {isSuperAdmin ? "✅" : "❌"}</div>
        <div>Mind Admin: {isMindAdmin ? "✅" : "❌"}</div>
        <div>Utilisateur: {currentUser?.email || "Aucun"}</div>
        <div>Rôle: {currentUser?.role || "Aucun"}</div>
        <div className="pt-2 border-t border-yellow-300">
          <div>
            localStorage superAdminAuth:{" "}
            {localStorage.getItem("superAdminAuth") || "❌"}
          </div>
          <div>
            localStorage supremeAuth:{" "}
            {localStorage.getItem("supremeAuth") || "❌"}
          </div>
        </div>
      </div>
    </div>
  );
};
