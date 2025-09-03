import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Settings, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const AdminReadyNotification: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);
  const { isAdmin, currentUser } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      // Petite attente pour s'assurer que tout est chargé
      const timer = setTimeout(() => {
        const hasSeenReady = localStorage.getItem("adminSystemReady");
        if (!hasSeenReady) {
          setShowNotification(true);
          localStorage.setItem("adminSystemReady", "true");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAdmin]);

  if (!isAdmin) return null;

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          className="fixed bottom-6 left-96 z-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Sparkles size={16} className="mr-2 text-yellow-500" />
                Système Admin Opérationnel !
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Bonjour <strong>{currentUser?.name || "Administrateur"}</strong>{" "}
                ! Toutes les fonctionnalités d'administration sont maintenant
                disponibles.
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Centre de contrôle unifié
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Dashboard moderne activé
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Tous les outils disponibles
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Settings size={12} className="mr-1" />
                  Cliquez en bas à droite
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 font-medium"
                >
                  Parfait !
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowNotification(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
