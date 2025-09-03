import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  AlertTriangle,
  Settings,
  Activity,
  Database,
  Bell,
  FileText,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { appService } from "../services/appService";
import { quoteService } from "../services/quoteService";
import { notificationService } from "../services/notificationService";

interface HealthCheck {
  name: string;
  status: "success" | "error" | "warning";
  message: string;
  details?: any;
}

export const AppHealthChecker: React.FC = () => {
  const { isAdmin } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [appStats, setAppStats] = useState<any>(null);

  const runHealthChecks = async () => {
    setIsChecking(true);
    const checks: HealthCheck[] = [];

    try {
      // Test 1: Vérifier le localStorage
      try {
        localStorage.setItem("health_test", "test");
        localStorage.removeItem("health_test");
        checks.push({
          name: "LocalStorage",
          status: "success",
          message: "Stockage local fonctionnel",
        });
      } catch (error) {
        checks.push({
          name: "LocalStorage",
          status: "error",
          message: "Problème avec le stockage local",
        });
      }

      // Test 2: Vérifier le service de devis
      try {
        const quotes = quoteService.getQuoteRequests();
        const stats = quoteService.getQuoteStats();
        checks.push({
          name: "Service de Devis",
          status: "success",
          message: `${quotes.length} demandes, ${stats.totalQuotes} devis générés`,
          details: stats,
        });
      } catch (error) {
        checks.push({
          name: "Service de Devis",
          status: "error",
          message: "Erreur dans le service de devis",
        });
      }

      // Test 3: Vérifier le service de notifications (sécurisé)
      try {
        // Éviter les appels qui pourraient déclencher des effets de bord
        const notificationCount = notificationService.getNotifications().length;
        const stats = notificationService.getNotificationStats();
        checks.push({
          name: "Service de Notifications",
          status: "success",
          message: `${notificationCount} notifications, ${stats.unread} non lues`,
          details: { ...stats, count: notificationCount },
        });
      } catch (error) {
        checks.push({
          name: "Service de Notifications",
          status: "error",
          message: "Erreur dans le service de notifications",
        });
      }

      // Test 4: Vérifier l'état général de l'app
      try {
        const health = appService.checkHealth();
        checks.push({
          name: "État Global",
          status:
            health.status === "healthy"
              ? "success"
              : health.status === "warning"
                ? "warning"
                : "error",
          message:
            health.status === "healthy"
              ? "Application en bonne santé"
              : `${health.issues.length} problèmes détectés`,
          details: health.issues,
        });
      } catch (error) {
        checks.push({
          name: "État Global",
          status: "error",
          message: "Impossible de vérifier l'état de l'application",
        });
      }

      // Test 5: Vérifier les performances
      try {
        const stats = appService.getAppStats();
        const storageUsed = stats.storage.totalSizeKB;
        const status = storageUsed > 1000 ? "warning" : "success";
        checks.push({
          name: "Performances",
          status,
          message: `${storageUsed}KB utilisés, ${stats.storage.available > 0 ? "OK" : "Limite atteinte"}`,
          details: stats,
        });
        setAppStats(stats);
      } catch (error) {
        checks.push({
          name: "Performances",
          status: "error",
          message: "Impossible de mesurer les performances",
        });
      }

      setHealthChecks(checks);
    } catch (error) {
      console.error("Erreur lors des vérifications:", error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      runHealthChecks();
    }
  }, [isVisible]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Check className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "error":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const overallStatus =
    healthChecks.length > 0
      ? healthChecks.some((check) => check.status === "error")
        ? "error"
        : healthChecks.some((check) => check.status === "warning")
          ? "warning"
          : "success"
      : "unknown";

  return (
    <>
      {/* Bouton flottant */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-24 left-6 z-40 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white p-0"
        title="Vérification de l'Application"
      >
        <Activity className="w-6 h-6" />
      </Button>

      {/* Panel de vérification */}
      {isVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      overallStatus === "success"
                        ? "bg-green-100"
                        : overallStatus === "warning"
                          ? "bg-yellow-100"
                          : overallStatus === "error"
                            ? "bg-red-100"
                            : "bg-gray-100"
                    }`}
                  >
                    {getStatusIcon(overallStatus)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Vérification de l'Application
                    </h2>
                    <p className="text-gray-600">
                      État de santé des composants système
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={runHealthChecks}
                    disabled={isChecking}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${isChecking ? "animate-spin" : ""}`}
                    />
                    {isChecking ? "Vérification..." : "Actualiser"}
                  </Button>
                  <Button
                    onClick={() => setIsVisible(false)}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Résultats des vérifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {healthChecks.map((check, index) => (
                  <Card
                    key={index}
                    className={`border-2 ${getStatusColor(check.status)}`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-2">
                          {getStatusIcon(check.status)}
                          <span>{check.name}</span>
                        </span>
                        <Badge
                          variant={
                            check.status === "success"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {check.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-700 mb-2">
                        {check.message}
                      </p>
                      {check.details && (
                        <details className="text-xs text-gray-600">
                          <summary className="cursor-pointer hover:text-gray-800">
                            Détails
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                            {JSON.stringify(check.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Statistiques générales */}
              {appStats && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="w-5 h-5" />
                      <span>Statistiques de l'Application</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {appStats.quotes?.totalRequests || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Demandes de devis
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {appStats.quotes?.acceptedQuotes || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Devis acceptés
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {appStats.notifications?.unread || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Notifications
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {appStats.storage?.totalSizeKB || 0}KB
                        </div>
                        <div className="text-sm text-gray-600">
                          Stockage utilisé
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    try {
                      const success = appService.exportAllData();
                      if (success) {
                        // Utiliser setTimeout pour éviter les mises à jour synchrones
                        setTimeout(() => {
                          notificationService.notifySystem(
                            "Export réussi",
                            "Toutes les données ont été exportées",
                            "low",
                          );
                        }, 0);
                      }
                    } catch (error) {
                      console.error("Erreur lors de l'export:", error);
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter les données
                </Button>

                <Button
                  onClick={() => {
                    // Utiliser setTimeout pour éviter les mises à jour synchrones
                    setTimeout(() => {
                      notificationService.notifySystem(
                        "Test de notification",
                        "Ceci est un test du système de notifications",
                        "medium",
                      );
                    }, 0);
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Tester les notifications
                </Button>

                <Button
                  onClick={() => {
                    if (
                      confirm(
                        "Êtes-vous sûr de vouloir réinitialiser l'application ?",
                      )
                    ) {
                      appService.resetApp();
                      window.location.reload();
                    }
                  }}
                  variant="destructive"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réinitialiser l'app
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AppHealthChecker;
