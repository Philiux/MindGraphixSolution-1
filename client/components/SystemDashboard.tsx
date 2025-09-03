import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Settings,
  Users,
  Shield,
  Palette,
  Bot,
  Globe,
  Database,
  Wifi,
  Monitor,
  Smartphone,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Play,
  Pause,
  BarChart3,
  Zap,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick,
  Server,
  Cloud,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { SystemValidator } from "./SystemValidator";
import { AdminPermissionManager } from "./AdminPermissionManager";
import { AdminFeatureManager } from "./AdminFeatureManager";

interface SystemMetric {
  id: string;
  name: string;
  value: number | string;
  unit?: string;
  status: "excellent" | "good" | "warning" | "critical";
  change: number;
  icon: React.ElementType;
  description: string;
}

interface FeatureStatus {
  id: string;
  name: string;
  status: "active" | "inactive" | "error";
  lastCheck: Date;
  description: string;
  icon: React.ElementType;
}

export const SystemDashboard: React.FC = () => {
  const { isAdmin, isSuperAdmin, isMindAdmin, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "metrics" | "features" | "tests" | "permissions"
  >("overview");
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [featureStatuses, setFeatureStatuses] = useState<FeatureStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialiser les métriques système
  useEffect(() => {
    const updateMetrics = () => {
      const metrics: SystemMetric[] = [
        {
          id: "performance",
          name: "Performance",
          value: Math.floor(Math.random() * 20 + 80),
          unit: "%",
          status: "excellent",
          change: Math.floor(Math.random() * 10 - 5),
          icon: Zap,
          description: "Performance globale du système",
        },
        {
          id: "uptime",
          name: "Temps de fonctionnement",
          value: "99.9",
          unit: "%",
          status: "excellent",
          change: 0.1,
          icon: Clock,
          description: "Disponibilité du service",
        },
        {
          id: "memory",
          name: "Mémoire",
          value: Math.floor(Math.random() * 30 + 45),
          unit: "%",
          status: Math.random() > 0.7 ? "warning" : "good",
          change: Math.floor(Math.random() * 10 - 5),
          icon: MemoryStick,
          description: "Utilisation de la mémoire",
        },
        {
          id: "storage",
          name: "Stockage",
          value: Math.floor(Math.random() * 25 + 60),
          unit: "%",
          status: "good",
          change: Math.floor(Math.random() * 5 + 1),
          icon: HardDrive,
          description: "Espace disque utilisé",
        },
        {
          id: "network",
          name: "Réseau",
          value: Math.floor(Math.random() * 50 + 200),
          unit: "ms",
          status: "good",
          change: Math.floor(Math.random() * 20 - 10),
          icon: Wifi,
          description: "Latence réseau",
        },
        {
          id: "database",
          name: "Base de données",
          value: Math.floor(Math.random() * 1000 + 5000),
          unit: "req/s",
          status: "excellent",
          change: Math.floor(Math.random() * 100 + 50),
          icon: Database,
          description: "Requêtes par seconde",
        },
      ];
      setSystemMetrics(metrics);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  // Initialiser les statuts des fonctionnalités
  useEffect(() => {
    const features: FeatureStatus[] = [
      {
        id: "auth",
        name: "Authentification",
        status: "active",
        lastCheck: new Date(),
        description: "Système de connexion utilisateur",
        icon: Shield,
      },
      {
        id: "bots",
        name: "Assistants IA",
        status: "active",
        lastCheck: new Date(),
        description: "Bots client et administrateur",
        icon: Bot,
      },
      {
        id: "themes",
        name: "Système de thèmes",
        status: "active",
        lastCheck: new Date(),
        description: "Gestion des thèmes visuels",
        icon: Palette,
      },
      {
        id: "admin",
        name: "Administration",
        status: isAdmin ? "active" : "inactive",
        lastCheck: new Date(),
        description: "Interface d'administration",
        icon: Settings,
      },
      {
        id: "notifications",
        name: "Notifications",
        status: "active",
        lastCheck: new Date(),
        description: "Système de notifications",
        icon: AlertCircle,
      },
      {
        id: "responsive",
        name: "Design responsive",
        status: "active",
        lastCheck: new Date(),
        description: "Adaptation mobile et tablette",
        icon: Smartphone,
      },
    ];
    setFeatureStatuses(features);
  }, [isAdmin]);

  const refreshAll = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      case "active":
        return "text-green-600 bg-green-100";
      case "inactive":
        return "text-gray-600 bg-gray-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
      case "good":
      case "active":
        return <CheckCircle size={16} />;
      case "warning":
        return <AlertTriangle size={16} />;
      case "critical":
      case "error":
        return <XCircle size={16} />;
      case "inactive":
        return <Pause size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: Activity },
    { id: "metrics", label: "Métriques", icon: BarChart3 },
    { id: "features", label: "Fonctionnalités", icon: Settings },
    { id: "tests", label: "Tests", icon: CheckCircle },
    ...(isSuperAdmin
      ? [{ id: "permissions", label: "Permissions", icon: Shield }]
      : []),
  ];

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Accès Administrateur Requis
          </h3>
          <p className="text-gray-600">
            Cette section est réservée aux administrateurs système.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de Bord Système</h1>
            <p className="text-indigo-100">
              Surveillance et gestion complète de Mind Graphix Solution
            </p>
            <div className="flex items-center space-x-4 mt-3 text-sm">
              <span className="flex items-center space-x-1">
                <Users size={16} />
                <span>Utilisateur: {currentUser?.name}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield size={16} />
                <span>
                  Niveau:{" "}
                  {isMindAdmin
                    ? "Mind Admin"
                    : isSuperAdmin
                      ? "Super Admin"
                      : "Admin"}
                </span>
              </span>
            </div>
          </div>

          <motion.button
            onClick={refreshAll}
            disabled={isRefreshing}
            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <RefreshCw
                size={20}
                className={isRefreshing ? "animate-spin" : ""}
              />
              <span>
                {isRefreshing ? "Actualisation..." : "Actualiser Tout"}
              </span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Vue d'ensemble */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Métriques clés */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {systemMetrics.slice(0, 6).map((metric) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <metric.icon size={24} className="text-indigo-600" />
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}
                      >
                        {getStatusIcon(metric.status)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900">
                        {metric.value}
                        {metric.unit}
                      </div>
                      <div className="text-xs text-gray-600">{metric.name}</div>
                      <div
                        className={`text-xs ${
                          metric.change > 0
                            ? "text-green-600"
                            : metric.change < 0
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        {metric.change > 0
                          ? "↗"
                          : metric.change < 0
                            ? "↘"
                            : "→"}{" "}
                        {Math.abs(metric.change)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Statut des fonctionnalités */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Statut des Fonctionnalités
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featureStatuses.map((feature) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <feature.icon size={20} className="text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">
                              {feature.name}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}
                            >
                              {getStatusIcon(feature.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Métriques détaillées */}
          {activeTab === "metrics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {systemMetrics.map((metric) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <metric.icon size={24} className="text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {metric.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {metric.description}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(metric.status)}`}
                      >
                        {metric.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-gray-900">
                          {metric.value}
                        </span>
                        <span className="text-lg text-gray-600">
                          {metric.unit}
                        </span>
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            metric.change > 0
                              ? "bg-green-100 text-green-600"
                              : metric.change < 0
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {metric.change > 0 ? "+" : ""}
                          {metric.change}
                          {metric.unit}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Gestion des fonctionnalités */}
          {activeTab === "features" && <AdminFeatureManager />}

          {/* Tests système */}
          {activeTab === "tests" && <SystemValidator />}

          {/* Gestion des permissions */}
          {activeTab === "permissions" && isSuperAdmin && (
            <AdminPermissionManager />
          )}
        </div>
      </div>
    </div>
  );
};
