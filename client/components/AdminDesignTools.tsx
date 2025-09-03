import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Palette,
  TrendingUp,
  Zap,
  Shield,
  Crown,
} from "lucide-react";
import { ModernCard, GradientText } from "./ModernVisualEffects";

export const AdminDesignToolsIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    // Désactiver complètement ce panneau
    return false;
  });
  const [showMinimized, setShowMinimized] = useState(false);

  // Auto-minimiser après 8 secondes
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setShowMinimized(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <>
      {/* Version minimisée - petit bouton discret */}
      <AnimatePresence>
        {showMinimized && !isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 right-4 z-40"
          >
            <motion.button
              onClick={() => {
                setIsVisible(true);
                setShowMinimized(false);
              }}
              className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg backdrop-blur-sm transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              title="Afficher les outils admin"
            >
              <Crown
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version complète */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40"
          >
            <ModernCard className="px-6 py-3 border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <Shield className="w-4 h-4 text-orange-400" />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-yellow-100 text-sm">
                    Mode Administrateur Activé
                  </h4>
                  <p className="text-yellow-200/70 text-xs">
                    Outils de design avancés disponibles
                  </p>
                </div>

                <div className="flex items-center gap-2 text-yellow-300">
                  <Palette className="w-4 h-4" />
                  <TrendingUp className="w-4 h-4" />
                  <Settings className="w-4 h-4" />
                </div>

                <motion.button
                  onClick={() => {
                    setIsVisible(false);
                    // Sauvegarder que l'utilisateur a fermé ce panneau
                    localStorage.setItem(
                      "adminToolsIndicatorDismissed",
                      "true",
                    );
                  }}
                  className="text-yellow-300/60 hover:text-yellow-300 p-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Fermer définitivement"
                >
                  ✕
                </motion.button>
              </div>
            </ModernCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const AdminToolsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tools = [
    {
      name: "Palette de Couleurs",
      description: "Aperçu des couleurs actuelles",
      icon: <Palette className="w-5 h-5" />,
      position: "Coin bas-droit",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Sélecteur de Thèmes",
      description: "Changer la palette globale",
      icon: <Settings className="w-5 h-5" />,
      position: "Coin haut-gauche",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Performance Design",
      description: "Métriques et analyses",
      icon: <TrendingUp className="w-5 h-5" />,
      position: "Coin bas-gauche",
      color: "from-green-500 to-teal-500",
    },
  ];

  return (
    <div className="fixed top-20 right-4 z-40">
      {/* Bouton d'aide */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Aide - Outils Administrateur"
      >
        <Shield size={20} />
      </motion.button>

      {/* Panneau d'aide */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <ModernCard className="w-80 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="text-yellow-400" size={20} />
                <h3 className="font-bold text-lg">
                  <GradientText>Outils Administrateur</GradientText>
                </h3>
              </div>

              <div className="space-y-4">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${tool.color}`}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm mb-1">
                          {tool.name}
                        </h4>
                        <p className="text-white/60 text-xs mb-2">
                          {tool.description}
                        </p>
                        <div className="text-white/40 text-xs flex items-center gap-1">
                          📍 {tool.position}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-200 text-xs text-center">
                  🔒 Ces outils sont exclusifs aux administrateurs
                </p>
              </div>
            </ModernCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
