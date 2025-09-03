import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Zap, Palette, Eye, Heart, Star } from "lucide-react";
import { ModernCard, GradientText } from "./ModernVisualEffects";

interface PerformanceMetric {
  name: string;
  value: number;
  max: number;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export const DesignPerformanceIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  const calculateMetrics = (): PerformanceMetric[] => {
    // Simulation de métriques de design en temps réel
    const colorHarmony = Math.random() * 20 + 80; // 80-100
    const visualBalance = Math.random() * 15 + 85; // 85-100
    const modernityScore = Math.random() * 10 + 90; // 90-100
    const userEngagement = Math.random() * 25 + 75; // 75-100
    const aestheticAppeal = Math.random() * 12 + 88; // 88-100
    const interactivity = Math.random() * 20 + 80; // 80-100

    return [
      {
        name: "Harmonie des couleurs",
        value: colorHarmony,
        max: 100,
        icon: <Palette className="w-4 h-4" />,
        description: "Équilibre et cohérence des couleurs",
        color: "from-purple-500 to-pink-500",
      },
      {
        name: "Équilibre visuel",
        value: visualBalance,
        max: 100,
        icon: <Eye className="w-4 h-4" />,
        description: "Distribution harmonieuse des éléments",
        color: "from-blue-500 to-cyan-500",
      },
      {
        name: "Modernité",
        value: modernityScore,
        max: 100,
        icon: <Zap className="w-4 h-4" />,
        description: "Tendances et innovations actuelles",
        color: "from-yellow-500 to-orange-500",
      },
      {
        name: "Engagement utilisateur",
        value: userEngagement,
        max: 100,
        icon: <Heart className="w-4 h-4" />,
        description: "Capacité à captiver l'attention",
        color: "from-pink-500 to-red-500",
      },
      {
        name: "Esthétique",
        value: aestheticAppeal,
        max: 100,
        icon: <Star className="w-4 h-4" />,
        description: "Beauté et élégance générale",
        color: "from-indigo-500 to-purple-500",
      },
      {
        name: "Interactivité",
        value: interactivity,
        max: 100,
        icon: <TrendingUp className="w-4 h-4" />,
        description: "Niveau d'interaction et de dynamisme",
        color: "from-green-500 to-teal-500",
      },
    ];
  };

  const getScoreLabel = (score: number) => {
    if (score >= 95)
      return { label: "Exceptionnel", emoji: "🏆", color: "text-yellow-400" };
    if (score >= 90)
      return { label: "Excellent", emoji: "⭐", color: "text-green-400" };
    if (score >= 85)
      return { label: "Très bon", emoji: "✨", color: "text-blue-400" };
    if (score >= 80)
      return { label: "Bon", emoji: "👍", color: "text-purple-400" };
    return { label: "À améliorer", emoji: "🔧", color: "text-orange-400" };
  };

  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics = calculateMetrics();
      setMetrics(newMetrics);

      const average =
        newMetrics.reduce((sum, metric) => sum + metric.value, 0) /
        newMetrics.length;
      setOverallScore(average);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  const scoreInfo = getScoreLabel(overallScore);

  return (
    <div className="fixed bottom-6 left-24 z-50">
      {/* Bouton d'ouverture */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-4 p-4 bg-gradient-to-r from-primary to-accent text-white rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <TrendingUp size={24} />
      </motion.button>

      {/* Panneau de métriques */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <ModernCard className="w-96 p-6">
              {/* En-tête */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <TrendingUp className="text-primary" size={24} />
                  <h3 className="text-xl font-bold">
                    <GradientText>Performance Design</GradientText>
                  </h3>
                </div>

                {/* Score global */}
                <div className="relative">
                  <motion.div
                    className={`text-4xl font-bold mb-2 ${scoreInfo.color}`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {Math.round(overallScore)}%
                  </motion.div>
                  <div className="flex items-center justify-center gap-2 text-white/80">
                    <span className="text-2xl">{scoreInfo.emoji}</span>
                    <span className="font-semibold">{scoreInfo.label}</span>
                  </div>
                </div>

                {/* Barre de progression globale */}
                <div className="mt-4 h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${overallScore}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Métriques détaillées */}
              <div className="space-y-4">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-r ${metric.color}`}
                        >
                          {metric.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">
                            {metric.name}
                          </div>
                          <div className="text-white/60 text-xs">
                            {metric.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-white font-bold">
                        {Math.round(metric.value)}%
                      </div>
                    </div>

                    {/* Barre de progression individuelle */}
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <motion.button
                  onClick={() => setMetrics(calculateMetrics())}
                  className="w-full p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔄 Actualiser les métriques
                </motion.button>
              </div>

              {/* Légende */}
              <div className="mt-4 p-3 bg-white/5 rounded-lg text-center">
                <p className="text-white/60 text-xs">
                  💡 Les métriques sont calculées en temps réel en fonction des
                  interactions et du design actuel
                </p>
              </div>
            </ModernCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
