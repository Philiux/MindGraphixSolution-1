import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Eye,
  MessageSquare,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  BarChart3,
  Activity,
} from "lucide-react";

interface StatData {
  label: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  icon: React.ElementType;
  color: string;
}

interface PageView {
  timestamp: Date;
  page: string;
  userAgent: string;
  duration: number;
}

export const RealTimeStats: React.FC = () => {
  const [stats, setStats] = useState<StatData[]>([]);
  const [recentViews, setRecentViews] = useState<PageView[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Simulation de données en temps réel
  useEffect(() => {
    const generateStats = (): StatData[] => {
      const baseStats = [
        {
          label: "Visiteurs en ligne",
          value: Math.floor(Math.random() * 50) + 10,
          change: Math.floor(Math.random() * 20) - 10,
          trend: "up" as const,
          icon: Users,
          color: "text-green-500",
        },
        {
          label: "Vues aujourd'hui",
          value: Math.floor(Math.random() * 500) + 200,
          change: Math.floor(Math.random() * 50) + 10,
          trend: "up" as const,
          icon: Eye,
          color: "text-blue-500",
        },
        {
          label: "Messages reçus",
          value: Math.floor(Math.random() * 20) + 5,
          change: Math.floor(Math.random() * 10) - 3,
          trend: "stable" as const,
          icon: MessageSquare,
          color: "text-purple-500",
        },
        {
          label: "Temps moyen/page",
          value: Math.floor(Math.random() * 180) + 120,
          change: Math.floor(Math.random() * 30) - 15,
          trend: "up" as const,
          icon: Clock,
          color: "text-orange-500",
        },
        {
          label: "Taux de conversion",
          value: Math.floor(Math.random() * 15) + 5,
          change: Math.floor(Math.random() * 5) - 2,
          trend: "up" as const,
          icon: TrendingUp,
          color: "text-cyan-500",
        },
        {
          label: "Pages/session",
          value: Math.floor(Math.random() * 5) + 2,
          change: Math.floor(Math.random() * 2) - 1,
          trend: "stable" as const,
          icon: BarChart3,
          color: "text-pink-500",
        },
      ];

      return baseStats.map((stat) => ({
        ...stat,
        trend: stat.change > 0 ? "up" : stat.change < 0 ? "down" : "stable",
      }));
    };

    const generateRecentViews = (): PageView[] => {
      const pages = ["/", "/services", "/about", "/admin", "/portfolio"];
      const userAgents = ["Desktop", "Mobile", "Tablet"];

      return Array.from({ length: 10 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 60000 * Math.random() * 30),
        page: pages[Math.floor(Math.random() * pages.length)],
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        duration: Math.floor(Math.random() * 300) + 30,
      }));
    };

    const updateStats = () => {
      if (isLive) {
        setStats(generateStats());
        setRecentViews(generateRecentViews());
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval);
  }, [isLive]);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getDeviceIcon = (userAgent: string) => {
    switch (userAgent) {
      case "Mobile":
        return Smartphone;
      case "Tablet":
        return Monitor;
      default:
        return Globe;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec indicateur live */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Activity size={20} className="text-primary" />
          <span>Statistiques en temps réel</span>
        </h3>

        <div className="flex items-center space-x-2">
          <motion.div
            className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500" : "bg-gray-400"}`}
            animate={isLive ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span
            className={`text-sm ${isLive ? "text-green-600" : "text-gray-500"}`}
          >
            {isLive ? "En direct" : "Arrêté"}
          </span>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isLive
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {isLive ? "Arrêter" : "Démarrer"}
          </button>
        </div>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={20} className={stat.color} />
                <div
                  className={`flex items-center space-x-1 text-xs ${
                    stat.trend === "up"
                      ? "text-green-600"
                      : stat.trend === "down"
                        ? "text-red-600"
                        : "text-gray-500"
                  }`}
                >
                  {stat.trend === "up" && "↗"}
                  {stat.trend === "down" && "↘"}
                  {stat.trend === "stable" && "→"}
                  <span>{Math.abs(stat.change)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <motion.div
                  key={stat.value}
                  initial={{ scale: 1.2, color: "#3B82F6" }}
                  animate={{ scale: 1, color: "#1F2937" }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold"
                >
                  {stat.label.includes("Temps")
                    ? formatDuration(stat.value)
                    : stat.label.includes("Taux")
                      ? `${stat.value}%`
                      : stat.value.toLocaleString()}
                </motion.div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Activité récente</h4>
        </div>

        <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
          {recentViews.map((view, index) => {
            const DeviceIcon = getDeviceIcon(view.userAgent);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <DeviceIcon size={16} className="text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {view.page}
                    </div>
                    <div className="text-xs text-gray-500">
                      {view.userAgent} • {formatDuration(view.duration)}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  {view.timestamp.toLocaleTimeString()}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Graphique simple */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-4">
          Tendance des visites
        </h4>

        <div className="flex items-end justify-between h-32 space-x-2">
          {Array.from({ length: 12 }, (_, i) => {
            const height = Math.random() * 80 + 20;
            const isRecent = i >= 8;

            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`flex-1 rounded-t ${
                  isRecent ? "bg-primary" : "bg-gray-300"
                } opacity-70 hover:opacity-100 transition-opacity`}
                title={`${Math.floor(height)}% à ${new Date(Date.now() - (11 - i) * 3600000).getHours()}h`}
              />
            );
          })}
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Il y a 12h</span>
          <span>Maintenant</span>
        </div>
      </div>
    </div>
  );
};
