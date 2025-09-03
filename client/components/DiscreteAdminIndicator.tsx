import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Settings, X, ChevronUp, ChevronDown } from "lucide-react";

export const DiscreteAdminIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    const dismissed = localStorage.getItem("discreteAdminIndicatorDismissed");
    return dismissed !== "true";
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-réduire après 3 secondes d'inactivité
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("discreteAdminIndicatorDismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30"
    >
      <AnimatePresence>
        {isExpanded ? (
          // Version étendue
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-lg border border-yellow-500/30 rounded-full px-6 py-3 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-100 text-sm font-medium">
                  Mode Admin Actif
                </span>
              </div>

              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-200/70 text-xs">
                  Outils disponibles
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 text-yellow-300/60 hover:text-yellow-300 transition-colors"
                  title="Réduire"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-1 text-yellow-300/60 hover:text-yellow-300 transition-colors"
                  title="Fermer définitivement"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          // Version réduite - très discrète
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={() => setIsExpanded(true)}
            className="bg-yellow-500/20 hover:bg-yellow-500/30 backdrop-blur-sm border border-yellow-500/40 rounded-full p-2 shadow-lg transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            title="Mode administrateur actif - Cliquer pour plus d'infos"
          >
            <div className="flex items-center gap-2">
              <Crown
                size={12}
                className="text-yellow-400 group-hover:rotate-12 transition-transform"
              />
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              <ChevronUp size={12} className="text-yellow-400" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
