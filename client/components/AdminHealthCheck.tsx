import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Database,
  Globe,
  Shield,
  Clock,
  Users,
  Settings,
  Monitor,
  Wifi,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface HealthMetric {
  id: string;
  name: string;
  status: "healthy" | "warning" | "critical" | "unknown";
  value?: string | number;
  description: string;
  lastCheck: Date;
  details?: string;
  icon: React.ElementType;
  category: string;
}

export const AdminHealthCheck: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { isAdmin, currentUser, isSuperAdmin, isMindAdmin } = useAuth();

  // Métriques à surveiller
  const healthChecks: Omit<HealthMetric, "status" | "value" | "lastCheck">[] = [
    // Système d'authentification
    {
      id: "auth-status",
      name: "Authentification",
      description: "État du système d'authentification",
      icon: Shield,
      category: "Sécurité",
    },
    {
      id: "user-session",
      name: "Session Utilisateur",
      description: "Validité de la session actuelle",
      icon: Users,
      category: "Sécurité",
    },

    // Performance système
    {
      id: "page-load",
      name: "Temps de Chargement",
      description: "Performance de chargement des pages",
      icon: Zap,
      category: "Performance",
    },
    {
      id: "memory-usage",
      name: "Utilisation Mémoire",
      description: "Consommation mémoire du navigateur",
      icon: MemoryStick,
      category: "Performance",
    },
    {
      id: "dom-elements",
      name: "Éléments DOM",
      description: "Nombre d'éléments dans le DOM",
      icon: Monitor,
      category: "Performance",
    },

    // Stockage et données
    {
      id: "local-storage",
      name: "Stockage Local",
      description: "Disponibilité et espace de stockage",
      icon: HardDrive,
      category: "Données",
    },
    {
      id: "content-integrity",
      name: "Intégrité du Contenu",
      description: "Validation des données de contenu",
      icon: Database,
      category: "Données",
    },

    // Connectivité
    {
      id: "network-status",
      name: "Statut Réseau",
      description: "Connectivité internet et serveur",
      icon: Wifi,
      category: "Connectivité",
    },
    {
      id: "api-response",
      name: "Réponse API",
      description: "Temps de réponse des API",
      icon: Server,
      category: "Connectivité",
    },

    // Interface utilisateur
    {
      id: "ui-components",
      name: "Composants UI",
      description: "État des composants d'interface",
      icon: Settings,
      category: "Interface",
    },
    {
      id: "responsive-design",
      name: "Design Responsive",
      description: "Adaptation aux différentes tailles d'écran",
      icon: Monitor,
      category: "Interface",
    },
  ];

  // Fonction pour effectuer une vérification de santé
  const performHealthCheck = async (
    checkId: string,
  ): Promise<Partial<HealthMetric>> => {
    const start = performance.now();

    try {
      switch (checkId) {
        case "auth-status":
          if (!isAdmin) {
            return {
              status: "critical",
              value: "Non authentifié",
              details: "Aucune session administrateur active",
            };
          }

          const role = isSuperAdmin
            ? "Super Admin"
            : isMindAdmin
              ? "Mind Admin"
              : "Admin";
          return {
            status: "healthy",
            value: role,
            details: `Utilisateur: ${currentUser?.name || "Inconnu"}`,
          };

        case "user-session":
          const sessionAge = Date.now() - (performance.timeOrigin || 0);
          const hoursActive = Math.round(sessionAge / (1000 * 60 * 60));

          return {
            status: hoursActive > 8 ? "warning" : "healthy",
            value: `${hoursActive}h`,
            details: `Session active depuis ${hoursActive} heures`,
          };

        case "page-load":
          const loadTime = performance.now() - start;
          let loadStatus: HealthMetric["status"] = "healthy";
          if (loadTime > 500) loadStatus = "warning";
          if (loadTime > 1000) loadStatus = "critical";

          return {
            status: loadStatus,
            value: `${Math.round(loadTime)}ms`,
            details: `Temps de traitement: ${Math.round(loadTime)}ms`,
          };

        case "memory-usage":
          if ("memory" in performance) {
            const memory = (performance as any).memory;
            const usedMB = Math.round(memory.usedJSHeapSize / (1024 * 1024));
            const limitMB = Math.round(memory.jsHeapSizeLimit / (1024 * 1024));
            const percentage = Math.round((usedMB / limitMB) * 100);

            let status: HealthMetric["status"] = "healthy";
            if (percentage > 70) status = "warning";
            if (percentage > 90) status = "critical";

            return {
              status,
              value: `${usedMB}MB`,
              details: `${percentage}% de ${limitMB}MB utilisés`,
            };
          }
          return {
            status: "unknown",
            value: "N/A",
            details: "API Memory non disponible",
          };

        case "dom-elements":
          const elementCount = document.querySelectorAll("*").length;
          let elementStatus: HealthMetric["status"] = "healthy";
          if (elementCount > 2000) elementStatus = "warning";
          if (elementCount > 5000) elementStatus = "critical";

          return {
            status: elementStatus,
            value: elementCount.toString(),
            details: `${elementCount} éléments dans le DOM`,
          };

        case "local-storage":
          try {
            const testKey = "health_check_test";
            localStorage.setItem(testKey, "test");
            localStorage.removeItem(testKey);

            // Estimer l'utilisation du localStorage
            let totalSize = 0;
            for (const key in localStorage) {
              if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length;
              }
            }
            const sizeKB = Math.round(totalSize / 1024);

            return {
              status: sizeKB > 5000 ? "warning" : "healthy",
              value: `${sizeKB}KB`,
              details: `${Object.keys(localStorage).length} entrées, ${sizeKB}KB utilisés`,
            };
          } catch {
            return {
              status: "critical",
              value: "Erreur",
              details: "Stockage local inaccessible",
            };
          }

        case "content-integrity":
          const contentKeys = Object.keys(localStorage).filter(
            (key) => key.includes("content") || key.includes("site"),
          );

          return {
            status: contentKeys.length > 0 ? "healthy" : "warning",
            value: `${contentKeys.length} entrées`,
            details: `${contentKeys.length} éléments de contenu trouvés`,
          };

        case "network-status":
          if (!navigator.onLine) {
            return {
              status: "critical",
              value: "Hors ligne",
              details: "Aucune connexion internet détectée",
            };
          }

          return {
            status: "healthy",
            value: "En ligne",
            details: "Connexion internet active",
          };

        case "api-response":
          try {
            const apiStart = performance.now();
            await fetch("/", { method: "HEAD" });
            const apiTime = Math.round(performance.now() - apiStart);

            let status: HealthMetric["status"] = "healthy";
            if (apiTime > 1000) status = "warning";
            if (apiTime > 3000) status = "critical";

            return {
              status,
              value: `${apiTime}ms`,
              details: `Réponse serveur en ${apiTime}ms`,
            };
          } catch {
            return {
              status: "critical",
              value: "Erreur",
              details: "Serveur non accessible",
            };
          }

        case "ui-components":
          const adminButton = document.querySelector('[title*="Paramètres"]');
          const dashboardElements = document.querySelectorAll(
            '[class*="admin"], [class*="dashboard"]',
          );

          return {
            status: adminButton ? "healthy" : "warning",
            value: `${dashboardElements.length} composants`,
            details: `${dashboardElements.length} composants admin détectés`,
          };

        case "responsive-design":
          const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
          };

          const isMobile = viewport.width < 768;
          const isTablet = viewport.width >= 768 && viewport.width < 1024;
          const isDesktop = viewport.width >= 1024;

          const device = isMobile
            ? "Mobile"
            : isTablet
              ? "Tablette"
              : "Desktop";

          return {
            status: "healthy",
            value: device,
            details: `${viewport.width}x${viewport.height}px`,
          };

        default:
          return {
            status: "unknown",
            value: "N/A",
            details: "Vérification non implémentée",
          };
      }
    } catch (error) {
      return {
        status: "critical",
        value: "Erreur",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  };

  // Effectuer toutes les vérifications
  const runHealthChecks = async () => {
    setIsChecking(true);
    const results: HealthMetric[] = [];

    for (const check of healthChecks) {
      const result = await performHealthCheck(check.id);
      results.push({
        ...check,
        status: result.status || "unknown",
        value: result.value,
        details: result.details,
        lastCheck: new Date(),
      });

      // Petit délai pour éviter de bloquer l'UI
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    setMetrics(results);
    setLastUpdate(new Date());
    setIsChecking(false);
  };

  // Lancer la vérification au montage
  useEffect(() => {
    if (isAdmin) {
      runHealthChecks();
    }
  }, [isAdmin]);

  // Auto-refresh toutes les 5 minutes
  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(
      () => {
        runHealthChecks();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [isAdmin]);

  const getStatusColor = (status: HealthMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: HealthMetric["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle size={16} className="text-green-600" />;
      case "warning":
        return <AlertTriangle size={16} className="text-yellow-600" />;
      case "critical":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  // Grouper par catégorie
  const groupedMetrics = metrics.reduce(
    (acc, metric) => {
      if (!acc[metric.category]) {
        acc[metric.category] = [];
      }
      acc[metric.category].push(metric);
      return acc;
    },
    {} as Record<string, HealthMetric[]>,
  );

  // Statistiques globales
  const stats = {
    healthy: metrics.filter((m) => m.status === "healthy").length,
    warning: metrics.filter((m) => m.status === "warning").length,
    critical: metrics.filter((m) => m.status === "critical").length,
    total: metrics.length,
  };

  const overallStatus =
    stats.critical > 0
      ? "critical"
      : stats.warning > 0
        ? "warning"
        : stats.healthy === stats.total
          ? "healthy"
          : "unknown";

  if (!isAdmin) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div
        className={`p-6 border-b border-gray-200 dark:border-gray-700 ${
          overallStatus === "healthy"
            ? "bg-green-50 dark:bg-green-900/20"
            : overallStatus === "warning"
              ? "bg-yellow-50 dark:bg-yellow-900/20"
              : overallStatus === "critical"
                ? "bg-red-50 dark:bg-red-900/20"
                : "bg-gray-50 dark:bg-gray-700/20"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                overallStatus === "healthy"
                  ? "bg-green-500"
                  : overallStatus === "warning"
                    ? "bg-yellow-500"
                    : overallStatus === "critical"
                      ? "bg-red-500"
                      : "bg-gray-500"
              }`}
            >
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                État de Santé du Système
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Diagnostic en temps réel des composants admin
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${
                  overallStatus === "healthy"
                    ? "text-green-600"
                    : overallStatus === "warning"
                      ? "text-yellow-600"
                      : overallStatus === "critical"
                        ? "text-red-600"
                        : "text-gray-600"
                }`}
              >
                {stats.healthy}/{stats.total}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Composants sains
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runHealthChecks}
              disabled={isChecking}
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50"
            >
              <motion.div
                animate={isChecking ? { rotate: 360 } : {}}
                transition={{
                  duration: 1,
                  repeat: isChecking ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <RefreshCw size={20} />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {lastUpdate && (
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Métriques */}
      <div className="p-6">
        {isChecking ? (
          <div className="text-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 dark:text-gray-400">
              Vérification en cours...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMetrics).map(
              ([category, categoryMetrics]) => (
                <div key={category}>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {category}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryMetrics.map((metric, index) => (
                      <motion.div
                        key={metric.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl border ${getStatusColor(metric.status)}`}
                      >
                        <div className="flex items-start space-x-3">
                          <metric.icon
                            size={20}
                            className="mt-0.5 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-semibold text-sm">
                                {metric.name}
                              </h5>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(metric.status)}
                                {metric.value && (
                                  <span className="text-sm font-medium">
                                    {metric.value}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs opacity-75 mt-1">
                              {metric.description}
                            </p>
                            {metric.details && (
                              <p className="text-xs font-medium mt-2">
                                {metric.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
