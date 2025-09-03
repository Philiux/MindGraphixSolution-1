import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, User, Eye, Sparkles } from "lucide-react";
import { ModernCard } from "./ModernVisualEffects";

export const UserInfoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-40"
        >
          <ModernCard className="w-80 p-4 border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-blue-100 text-sm mb-2">
                  Mode Visiteur
                </h4>
                <p className="text-blue-200/80 text-xs leading-relaxed mb-3">
                  Vous naviguez en tant qu'utilisateur standard. Profitez de
                  l'expérience complète avec les particules interactives !
                </p>

                <div className="flex items-center gap-2 text-blue-300 text-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>Particules interactives actives</span>
                </div>
                <div className="flex items-center gap-2 text-blue-300/60 text-xs mt-1">
                  <Eye className="w-3 h-3" />
                  <span>Design optimisé pour vous</span>
                </div>
              </div>

              <motion.button
                onClick={() => setIsVisible(false)}
                className="text-blue-300/60 hover:text-blue-300 p-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                ✕
              </motion.button>
            </div>

            <div className="mt-3 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-blue-200/70 text-xs text-center">
                💡 Connectez-vous en tant qu'administrateur pour accéder aux
                outils de design
              </p>
            </div>
          </ModernCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
