import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Cpu,
  Database,
  Server,
  Wifi,
  Shield,
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw,
  Zap,
  Activity,
  Thermometer,
  Battery,
  HardDrive,
  Globe,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  Gauge,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface SystemMetrics {
  cpu: {
    usage: number;
    temperature: number;
    cores: number;
    frequency: number;
  };
  memory: {
    used: number;
    total: number;
    cached: number;
    buffers: number;
  };
  disk: {
    used: number;
    total: number;
    readSpeed: number;
    writeSpeed: number;
  };
  network: {
    inbound: number;
    outbound: number;
    latency: number;
    packetsLost: number;
  };
  services: Array<{
    name: string;
    status: "running" | "stopped" | "error" | "warning";
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
  }>;
  security: {
    threats: number;
    blockedRequests: number;
    suspiciousActivity: number;
    lastScan: Date;
  };
  performance: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    availability: number;
  };
}

interface HealthAlert {
  id: string;
  type: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export const SystemHealthDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [healthScore, setHealthScore] = useState(95);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Exclusivement pour Philippe
  const isPhilippeSupreme =
    currentUser?.email === "philippefaizsanon@gmail.com";

  // Génération de métriques simulées
  const generateMetrics = (): SystemMetrics => {
    const time = Date.now();
    const variance = Math.sin(time / 10000) * 0.2;

    return {
      cpu: {
        usage: Math.max(
          5,
          Math.min(95, 25 + variance * 50 + Math.random() * 15),
        ),
        temperature: Math.max(
          35,
          Math.min(85, 45 + variance * 20 + Math.random() * 10),
        ),
        cores: 8,
        frequency: Math.max(2.0, Math.min(4.5, 3.2 + variance * 0.8)),
      },
      memory: {
        used: Math.max(2, Math.min(14, 8 + variance * 4 + Math.random() * 2)),
        total: 16,
        cached: Math.max(1, Math.min(3, 2 + variance * 0.5)),
        buffers: Math.max(0.2, Math.min(1, 0.5 + variance * 0.3)),
      },
      disk: {
        used: Math.max(50, Math.min(450, 250 + variance * 100)),
        total: 500,
        readSpeed: Math.max(100, Math.min(600, 350 + variance * 150)),
        writeSpeed: Math.max(80, Math.min(500, 280 + variance * 120)),
      },
      network: {
        inbound: Math.max(10, Math.min(1000, 150 + variance * 200)),
        outbound: Math.max(5, Math.min(800, 100 + variance * 150)),
        latency: Math.max(1, Math.min(100, 15 + variance * 20)),
        packetsLost: Math.max(0, Math.min(5, variance * 2)),
      },
      services: [
        {
          name: "Web Server",
          status: Math.random() > 0.95 ? "warning" : "running",
          uptime: 99.8,
          memoryUsage: Math.max(100, Math.min(800, 400 + variance * 200)),
          cpuUsage: Math.max(5, Math.min(80, 25 + variance * 30)),
        },
        {
          name: "Database",
          status: Math.random() > 0.98 ? "error" : "running",
          uptime: 99.9,
          memoryUsage: Math.max(200, Math.min(1200, 600 + variance * 300)),
          cpuUsage: Math.max(10, Math.min(60, 30 + variance * 25)),
        },
        {
          name: "Cache Server",
          status: "running",
          uptime: 100,
          memoryUsage: Math.max(50, Math.min(400, 150 + variance * 100)),
          cpuUsage: Math.max(2, Math.min(20, 8 + variance * 10)),
        },
        {
          name: "Load Balancer",
          status: "running",
          uptime: 99.95,
          memoryUsage: Math.max(30, Math.min(200, 80 + variance * 50)),
          cpuUsage: Math.max(3, Math.min(15, 7 + variance * 8)),
        },
      ],
      security: {
        threats: Math.floor(Math.random() * 3),
        blockedRequests: Math.floor(Math.random() * 50) + 10,
        suspiciousActivity: Math.floor(Math.random() * 5),
        lastScan: new Date(Date.now() - Math.random() * 3600000),
      },
      performance: {
        responseTime: Math.max(50, Math.min(500, 120 + variance * 100)),
        throughput: Math.max(100, Math.min(2000, 800 + variance * 400)),
        errorRate: Math.max(0, Math.min(5, variance * 2)),
        availability: Math.max(95, Math.min(100, 99.5 + variance * 1)),
      },
    };
  };

  // Calcul du score de santé
  const calculateHealthScore = (metrics: SystemMetrics): number => {
    let score = 100;

    // CPU
    if (metrics.cpu.usage > 80) score -= 15;
    else if (metrics.cpu.usage > 60) score -= 5;
    if (metrics.cpu.temperature > 75) score -= 10;

    // Mémoire
    const memoryUsage = (metrics.memory.used / metrics.memory.total) * 100;
    if (memoryUsage > 85) score -= 15;
    else if (memoryUsage > 70) score -= 5;

    // Disque
    const diskUsage = (metrics.disk.used / metrics.disk.total) * 100;
    if (diskUsage > 90) score -= 20;
    else if (diskUsage > 75) score -= 10;

    // Services
    const errorServices = metrics.services.filter(
      (s) => s.status === "error",
    ).length;
    const warningServices = metrics.services.filter(
      (s) => s.status === "warning",
    ).length;
    score -= errorServices * 20 + warningServices * 10;

    // Performance
    if (metrics.performance.errorRate > 3) score -= 15;
    if (metrics.performance.availability < 98) score -= 20;

    return Math.max(0, Math.round(score));
  };

  // Génération d'alertes
  const checkForAlerts = (metrics: SystemMetrics) => {
    const newAlerts: HealthAlert[] = [];

    if (metrics.cpu.usage > 85) {
      newAlerts.push({
        id: `cpu-${Date.now()}`,
        type: "critical",
        component: "CPU",
        message: `Utilisation CPU critique : ${metrics.cpu.usage.toFixed(1)}%`,
        timestamp: new Date(),
        resolved: false,
      });
    }

    if (metrics.cpu.temperature > 80) {
      newAlerts.push({
        id: `temp-${Date.now()}`,
        type: "warning",
        component: "CPU",
        message: `Température élevée : ${metrics.cpu.temperature.toFixed(1)}°C`,
        timestamp: new Date(),
        resolved: false,
      });
    }

    const memoryUsage = (metrics.memory.used / metrics.memory.total) * 100;
    if (memoryUsage > 90) {
      newAlerts.push({
        id: `memory-${Date.now()}`,
        type: "critical",
        component: "Memory",
        message: `Mémoire critique : ${memoryUsage.toFixed(1)}%`,
        timestamp: new Date(),
        resolved: false,
      });
    }

    metrics.services.forEach((service) => {
      if (service.status === "error") {
        newAlerts.push({
          id: `service-${service.name}-${Date.now()}`,
          type: "critical",
          component: service.name,
          message: `Service en erreur : ${service.name}`,
          timestamp: new Date(),
          resolved: false,
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 50));
    }
  };

  // Monitoring en temps réel
  useEffect(() => {
    if (!isMonitoring) return;

    const startMonitoring = () => {
      intervalRef.current = setInterval(() => {
        const newMetrics = generateMetrics();
        setMetrics(newMetrics);
        setHealthScore(calculateHealthScore(newMetrics));
        setLastUpdate(new Date());
        checkForAlerts(newMetrics);
      }, 3000);
    };

    startMonitoring();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMonitoring]);

  // Initialisation
  useEffect(() => {
    const initialMetrics = generateMetrics();
    setMetrics(initialMetrics);
    setHealthScore(calculateHealthScore(initialMetrics));
  }, []);

  // Export des données
  const exportSystemReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      healthScore,
      metrics,
      alerts: alerts.filter((a) => !a.resolved),
      system: {
        browser: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system-health-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helpers
  const getHealthColor = (score: number): string => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "stopped":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} TB`;
    return `${bytes.toFixed(1)} GB`;
  };

  const formatUptime = (uptime: number): string => {
    return `${uptime.toFixed(2)}%`;
  };

  if (!isPhilippeSupreme) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="floating-admin-button bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
        title="Santé du Système"
      >
        <Heart size={20} />
        {healthScore < 80 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold animate-pulse">
              !
            </span>
          </div>
        )}
        {healthScore < 60 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <AlertTriangle size={12} className="animate-pulse" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Heart size={24} />
                  <div>
                    <h2 className="text-2xl font-bold">Santé du Système</h2>
                    <p className="text-red-200 text-sm">
                      Score:{" "}
                      <span className="font-bold">{healthScore}/100</span> •
                      Dernière MAJ: {lastUpdate.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        healthScore >= 90
                          ? "bg-green-400"
                          : healthScore >= 70
                            ? "bg-yellow-400"
                            : healthScore >= 50
                              ? "bg-orange-400"
                              : "bg-red-400"
                      } ${isMonitoring ? "animate-pulse" : ""}`}
                    />
                    <span className="text-xs bg-red-800 px-2 py-1 rounded">
                      {isMonitoring ? "MONITORING" : "PAUSED"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={exportSystemReport}
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-red-600"
                  >
                    <Download size={16} className="mr-2" />
                    Export
                  </Button>
                  <button
                    onClick={() => setIsMonitoring(!isMonitoring)}
                    className={`p-2 rounded-full transition-colors ${
                      isMonitoring ? "bg-green-500" : "bg-gray-500"
                    }`}
                    title={
                      isMonitoring ? "Pause monitoring" : "Resume monitoring"
                    }
                  >
                    {isMonitoring ? (
                      <Activity size={16} className="animate-pulse" />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-red-800 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-4 mt-4">
                {[
                  { id: "overview", label: "Vue d'ensemble", icon: Gauge },
                  { id: "performance", label: "Performance", icon: Zap },
                  { id: "services", label: "Services", icon: Server },
                  { id: "security", label: "Sécurité", icon: Shield },
                  { id: "alerts", label: "Alertes", icon: AlertTriangle },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-white text-red-600"
                        : "text-red-200 hover:text-white hover:bg-red-800"
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                    {tab.id === "alerts" &&
                      alerts.filter((a) => !a.resolved).length > 0 && (
                        <span className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {alerts.filter((a) => !a.resolved).length}
                        </span>
                      )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
              {activeTab === "overview" && metrics && (
                <div className="space-y-6">
                  {/* Health Score */}
                  <div className="text-center">
                    <div
                      className={`text-6xl font-bold ${getHealthColor(healthScore)} mb-2`}
                    >
                      {healthScore}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Score de Santé Système
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full mt-4 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          healthScore >= 90
                            ? "bg-green-500"
                            : healthScore >= 70
                              ? "bg-yellow-500"
                              : healthScore >= 50
                                ? "bg-orange-500"
                                : "bg-red-500"
                        }`}
                        style={{ width: `${healthScore}%` }}
                      />
                    </div>
                  </div>

                  {/* System Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-300">
                            CPU
                          </p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {metrics.cpu.usage.toFixed(1)}%
                          </p>
                          <p className="text-xs text-blue-600">
                            {metrics.cpu.temperature.toFixed(1)}°C
                          </p>
                        </div>
                        <Cpu size={24} className="text-blue-500" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 dark:text-green-300">
                            Mémoire
                          </p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {(
                              (metrics.memory.used / metrics.memory.total) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                          <p className="text-xs text-green-600">
                            {formatBytes(metrics.memory.used)}
                          </p>
                        </div>
                        <Database size={24} className="text-green-500" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 dark:text-purple-300">
                            Disque
                          </p>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {(
                              (metrics.disk.used / metrics.disk.total) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                          <p className="text-xs text-purple-600">
                            {formatBytes(metrics.disk.used)}
                          </p>
                        </div>
                        <HardDrive size={24} className="text-purple-500" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-600 dark:text-orange-300">
                            Réseau
                          </p>
                          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                            {metrics.network.latency.toFixed(0)}ms
                          </p>
                          <p className="text-xs text-orange-600">
                            {metrics.network.inbound.toFixed(0)} MB/s
                          </p>
                        </div>
                        <Wifi size={24} className="text-orange-500" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Services Status */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        État des Services
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {metrics.services.map((service, index) => (
                        <div
                          key={index}
                          className="p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(service.status)}`}
                            >
                              {service.status === "running" ? (
                                <CheckCircle size={16} />
                              ) : service.status === "error" ? (
                                <X size={16} />
                              ) : (
                                <AlertTriangle size={16} />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {service.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Uptime: {formatUptime(service.uptime)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              CPU: {service.cpuUsage.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              RAM: {service.memoryUsage.toFixed(0)} MB
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "alerts" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Alertes Système (
                      {alerts.filter((a) => !a.resolved).length} actives)
                    </h3>
                    <Button
                      onClick={() =>
                        setAlerts((prev) =>
                          prev.map((a) => ({ ...a, resolved: true })),
                        )
                      }
                      size="sm"
                      variant="outline"
                      disabled={alerts.filter((a) => !a.resolved).length === 0}
                    >
                      Marquer comme résolues
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start space-x-3 p-4 rounded-lg border ${
                          alert.resolved
                            ? "bg-gray-50 border-gray-200 opacity-60"
                            : alert.type === "critical"
                              ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                              : alert.type === "warning"
                                ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                                : "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {alert.type === "critical" && (
                            <AlertTriangle className="text-red-600" size={20} />
                          )}
                          {alert.type === "warning" && (
                            <AlertTriangle
                              className="text-yellow-600"
                              size={20}
                            />
                          )}
                          {alert.type === "info" && (
                            <CheckCircle className="text-blue-600" size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`font-medium ${
                                alert.resolved
                                  ? "text-gray-500"
                                  : alert.type === "critical"
                                    ? "text-red-900 dark:text-red-200"
                                    : alert.type === "warning"
                                      ? "text-yellow-900 dark:text-yellow-200"
                                      : "text-blue-900 dark:text-blue-200"
                              }`}
                            >
                              {alert.component} -{" "}
                              {alert.type === "critical"
                                ? "Critique"
                                : alert.type === "warning"
                                  ? "Attention"
                                  : "Info"}
                            </h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {alert.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p
                            className={`text-sm mt-1 ${
                              alert.resolved
                                ? "text-gray-400"
                                : alert.type === "critical"
                                  ? "text-red-700 dark:text-red-300"
                                  : alert.type === "warning"
                                    ? "text-yellow-700 dark:text-yellow-300"
                                    : "text-blue-700 dark:text-blue-300"
                            }`}
                          >
                            {alert.message}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {alerts.length === 0 && (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <CheckCircle
                          size={48}
                          className="mx-auto mb-4 opacity-50"
                        />
                        <p>Aucune alerte système</p>
                        <p className="text-sm">
                          Le système fonctionne normalement
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
