import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  HardDrive,
  Zap,
  Eye,
  Network,
  Timer,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Gauge,
  Wifi,
  Monitor,
  X,
  Download,
  BarChart3,
  LineChart,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte

  // Resource metrics
  domElements: number;
  jsHeapSize: number;
  jsHeapLimit: number;

  // Network
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;

  // Browser performance
  loadTime: number;
  domReadyTime: number;
  renderTime: number;

  // Memory usage
  memoryUsed: number;
  memoryLimit: number;

  // FPS and rendering
  fps: number;
  frameDrops: number;

  timestamp: number;
}

interface PerformanceAlert {
  id: string;
  type: "warning" | "error" | "info";
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: Date;
}

interface PerformanceThresholds {
  lcp: { warning: number; error: number };
  fid: { warning: number; error: number };
  cls: { warning: number; error: number };
  fcp: { warning: number; error: number };
  ttfb: { warning: number; error: number };
  memoryUsage: { warning: number; error: number };
  fps: { warning: number; error: number };
}

export const PerformanceMonitor: React.FC = () => {
  const { isSuperAdmin, isMindAdmin, currentUser } = useAuth();

  // Philippe a accès complet en tant qu'administrateur suprême
  const isPhilippeSupreme =
    currentUser?.email === "philippefaizsanon@gmail.com";
  const isMindAdminStrict =
    isMindAdmin ||
    currentUser?.email === "admin@mindgraphix.com" ||
    currentUser?.role === "mind";
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("realtime");
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<PerformanceMetrics[]>(
    [],
  );
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(0);

  const thresholds: PerformanceThresholds = {
    lcp: { warning: 2500, error: 4000 },
    fid: { warning: 100, error: 300 },
    cls: { warning: 0.1, error: 0.25 },
    fcp: { warning: 1800, error: 3000 },
    ttfb: { warning: 600, error: 1000 },
    memoryUsage: { warning: 75, error: 90 },
    fps: { warning: 30, error: 20 },
  };

  const performanceObserver = useRef<PerformanceObserver | null>(null);
  const fpsCounter = useRef({ frames: 0, lastTime: 0, fps: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mesure FPS
  const measureFPS = () => {
    const now = performance.now();
    fpsCounter.current.frames++;

    if (now >= fpsCounter.current.lastTime + 1000) {
      fpsCounter.current.fps = Math.round(
        (fpsCounter.current.frames * 1000) /
          (now - fpsCounter.current.lastTime),
      );
      fpsCounter.current.frames = 0;
      fpsCounter.current.lastTime = now;
    }

    if (isMonitoring) {
      requestAnimationFrame(measureFPS);
    }
  };

  // Collecte des métriques de performance
  const collectMetrics = (): PerformanceMetrics => {
    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    const memory = (performance as any).memory;
    const connection = (navigator as any).connection;

    // Simulation de Core Web Vitals (normalement obtenus via PerformanceObserver)
    const lcp = Math.random() * 3000 + 1000;
    const fid = Math.random() * 200 + 50;
    const cls = Math.random() * 0.3;

    return {
      // Core Web Vitals
      lcp: Math.round(lcp),
      fid: Math.round(fid),
      cls: Math.round(cls * 1000) / 1000,
      fcp: Math.round(
        navigation?.domContentLoadedEventEnd - navigation?.fetchStart || 0,
      ),
      ttfb: Math.round(navigation?.responseStart - navigation?.fetchStart || 0),

      // DOM
      domElements: document.querySelectorAll("*").length,

      // Memory (si disponible)
      jsHeapSize: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
      jsHeapLimit: memory
        ? Math.round(memory.totalJSHeapSize / 1024 / 1024)
        : 0,

      // Network
      connectionType: connection?.type || "unknown",
      effectiveType: connection?.effectiveType || "4g",
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,

      // Timing
      loadTime: Math.round(
        navigation?.loadEventEnd - navigation?.fetchStart || 0,
      ),
      domReadyTime: Math.round(
        navigation?.domContentLoadedEventEnd - navigation?.fetchStart || 0,
      ),
      renderTime: Math.round(
        navigation?.domComplete - navigation?.domContentLoadedEventStart || 0,
      ),

      // Memory usage percentage
      memoryUsed: memory
        ? Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
        : 0,
      memoryLimit: memory
        ? Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        : 0,

      // FPS
      fps: fpsCounter.current.fps,
      frameDrops: Math.max(0, 60 - fpsCounter.current.fps),

      timestamp: Date.now(),
    };
  };

  // Calcul du score de performance
  const calculatePerformanceScore = (metrics: PerformanceMetrics): number => {
    let score = 100;

    // Core Web Vitals scoring
    if (metrics.lcp > thresholds.lcp.error) score -= 25;
    else if (metrics.lcp > thresholds.lcp.warning) score -= 10;

    if (metrics.fid > thresholds.fid.error) score -= 20;
    else if (metrics.fid > thresholds.fid.warning) score -= 8;

    if (metrics.cls > thresholds.cls.error) score -= 20;
    else if (metrics.cls > thresholds.cls.warning) score -= 8;

    if (metrics.fcp > thresholds.fcp.error) score -= 15;
    else if (metrics.fcp > thresholds.fcp.warning) score -= 6;

    if (metrics.ttfb > thresholds.ttfb.error) score -= 10;
    else if (metrics.ttfb > thresholds.ttfb.warning) score -= 4;

    // Memory scoring
    if (metrics.memoryUsed > thresholds.memoryUsage.error) score -= 10;
    else if (metrics.memoryUsed > thresholds.memoryUsage.warning) score -= 5;

    return Math.max(0, Math.round(score));
  };

  // Vérification des seuils et génération d'alertes
  const checkThresholds = (metrics: PerformanceMetrics) => {
    const newAlerts: PerformanceAlert[] = [];
    const now = new Date();

    // Vérifier LCP
    if (metrics.lcp > thresholds.lcp.error) {
      newAlerts.push({
        id: `lcp-${Date.now()}`,
        type: "error",
        metric: "LCP",
        value: metrics.lcp,
        threshold: thresholds.lcp.error,
        message: `LCP critique: ${metrics.lcp}ms (seuil: ${thresholds.lcp.error}ms)`,
        timestamp: now,
      });
    } else if (metrics.lcp > thresholds.lcp.warning) {
      newAlerts.push({
        id: `lcp-${Date.now()}`,
        type: "warning",
        metric: "LCP",
        value: metrics.lcp,
        threshold: thresholds.lcp.warning,
        message: `LCP élevé: ${metrics.lcp}ms (seuil: ${thresholds.lcp.warning}ms)`,
        timestamp: now,
      });
    }

    // Vérifier Memory Usage
    if (metrics.memoryUsed > thresholds.memoryUsage.error) {
      newAlerts.push({
        id: `memory-${Date.now()}`,
        type: "error",
        metric: "Memory",
        value: metrics.memoryUsed,
        threshold: thresholds.memoryUsage.error,
        message: `Mémoire critique: ${metrics.memoryUsed}% utilisée`,
        timestamp: now,
      });
    }

    // Vérifier FPS
    if (metrics.fps < thresholds.fps.error) {
      newAlerts.push({
        id: `fps-${Date.now()}`,
        type: "error",
        metric: "FPS",
        value: metrics.fps,
        threshold: thresholds.fps.error,
        message: `FPS critique: ${metrics.fps} FPS (minimum: ${thresholds.fps.error})`,
        timestamp: now,
      });
    }

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 50)); // Garder seulement les 50 dernières alertes
    }
  };

  // Démarrage du monitoring
  const startMonitoring = () => {
    setIsMonitoring(true);
    measureFPS();

    // Configuration du PerformanceObserver pour Web Vitals
    if ("PerformanceObserver" in window) {
      try {
        performanceObserver.current = new PerformanceObserver((list) => {
          // Traitement des entrées de performance
          list.getEntries().forEach((entry) => {
            console.log("Performance entry:", entry);
          });
        });

        performanceObserver.current.observe({
          entryTypes: ["measure", "navigation", "resource", "paint"],
        });
      } catch (e) {
        console.warn("PerformanceObserver not fully supported");
      }
    }

    // Collecte périodique des métriques
    intervalRef.current = setInterval(() => {
      const newMetrics = collectMetrics();
      setMetrics(newMetrics);
      setPerformanceScore(calculatePerformanceScore(newMetrics));
      setMetricsHistory((prev) => [...prev, newMetrics].slice(-60)); // Garder 60 mesures (5 minutes à 5s d'intervalle)
      checkThresholds(newMetrics);
    }, 5000);
  };

  // Arrêt du monitoring
  const stopMonitoring = () => {
    setIsMonitoring(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (performanceObserver.current) {
      performanceObserver.current.disconnect();
    }
  };

  // Effects
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  useEffect(() => {
    if (isOpen && !isMonitoring) {
      startMonitoring();
    } else if (!isOpen && isMonitoring) {
      stopMonitoring();
    }
  }, [isOpen]);

  // Export des données
  const exportData = () => {
    const data = {
      metrics: metricsHistory,
      alerts,
      score: performanceScore,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper functions
  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getMetricStatus = (
    value: number,
    thresholds: { warning: number; error: number },
    reverse = false,
  ): string => {
    if (reverse) {
      if (value < thresholds.error) return "text-red-600";
      if (value < thresholds.warning) return "text-yellow-600";
      return "text-green-600";
    } else {
      if (value > thresholds.error) return "text-red-600";
      if (value > thresholds.warning) return "text-yellow-600";
      return "text-green-600";
    }
  };

  if (!isPhilippeSupreme || isMindAdminStrict) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="floating-admin-button bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white"
        title="Monitoring Performance"
      >
        <Activity size={20} />
        {alerts.filter((a) => a.type === "error").length > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold animate-pulse">
              !
            </span>
          </div>
        )}
      </button>

      {/* Mini monitor when minimized */}
      <AnimatePresence>
        {isMinimized && metrics && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed top-16 right-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Performance
              </span>
              <button
                onClick={() => setIsMinimized(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Maximize2 size={12} />
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Score</span>
                <span
                  className={`text-xs font-bold ${getScoreColor(performanceScore)}`}
                >
                  {performanceScore}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">FPS</span>
                <span
                  className={`text-xs ${getMetricStatus(metrics.fps, thresholds.fps, true)}`}
                >
                  {metrics.fps}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Memory</span>
                <span
                  className={`text-xs ${getMetricStatus(metrics.memoryUsed, thresholds.memoryUsage)}`}
                >
                  {metrics.memoryUsed}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Modal */}
      {isOpen && !isMinimized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Activity size={24} />
                  <div>
                    <h2 className="text-2xl font-bold">Performance Monitor</h2>
                    <p className="text-cyan-200 text-sm">
                      Score:{" "}
                      <span className="font-bold">{performanceScore}/100</span>{" "}
                      •
                      {metrics && (
                        <>
                          {" "}
                          {metrics.fps} FPS • {metrics.memoryUsed}% Memory
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isMonitoring && (
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    )}
                    <span className="text-xs bg-cyan-800 px-2 py-1 rounded">
                      {isMonitoring ? "ACTIF" : "ARRÊTÉ"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={exportData}
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-cyan-600"
                  >
                    <Download size={16} className="mr-2" />
                    Export
                  </Button>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 hover:bg-cyan-800 rounded-full transition-colors"
                    title="Réduire"
                  >
                    <Minimize2 size={20} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-cyan-800 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-4 mt-4">
                {[
                  { id: "realtime", label: "Temps Réel", icon: Gauge },
                  { id: "vitals", label: "Core Web Vitals", icon: Zap },
                  { id: "resources", label: "Ressources", icon: HardDrive },
                  { id: "alerts", label: "Alertes", icon: AlertTriangle },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-white text-cyan-600"
                        : "text-cyan-200 hover:text-white hover:bg-cyan-800"
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                    {tab.id === "alerts" &&
                      alerts.filter((a) => a.type === "error").length > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {alerts.filter((a) => a.type === "error").length}
                        </span>
                      )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
              {activeTab === "realtime" && metrics && (
                <div className="space-y-6">
                  {/* Performance Score */}
                  <div className="text-center">
                    <div
                      className={`text-6xl font-bold ${getScoreColor(performanceScore)} mb-2`}
                    >
                      {performanceScore}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Score de Performance
                    </div>
                    <div
                      className={`w-full h-2 bg-gray-200 rounded-full mt-4 overflow-hidden`}
                    >
                      <div
                        className={`h-full transition-all duration-500 ${
                          performanceScore >= 90
                            ? "bg-green-500"
                            : performanceScore >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${performanceScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Real-time metrics grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-300">
                            FPS
                          </p>
                          <p
                            className={`text-2xl font-bold ${getMetricStatus(metrics.fps, thresholds.fps, true)}`}
                          >
                            {metrics.fps}
                          </p>
                        </div>
                        <Monitor size={24} className="text-blue-500" />
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
                            Memory
                          </p>
                          <p
                            className={`text-2xl font-bold ${getMetricStatus(metrics.memoryUsed, thresholds.memoryUsage)}`}
                          >
                            {metrics.memoryUsed}%
                          </p>
                        </div>
                        <HardDrive size={24} className="text-green-500" />
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
                            DOM Elements
                          </p>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {metrics.domElements}
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
                            Connection
                          </p>
                          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                            {metrics.effectiveType.toUpperCase()}
                          </p>
                        </div>
                        <Wifi size={24} className="text-orange-500" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Performance graph placeholder */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Performance dans le temps
                    </h3>
                    <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <LineChart
                          size={48}
                          className="mx-auto mb-2 opacity-50"
                        />
                        <p>Graphique de performance en temps réel</p>
                        <p className="text-sm">
                          {metricsHistory.length} points de données collectés
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "vitals" && metrics && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* LCP */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Largest Contentful Paint
                        </h3>
                        <Timer
                          className={getMetricStatus(
                            metrics.lcp,
                            thresholds.lcp,
                          )}
                          size={20}
                        />
                      </div>
                      <div
                        className={`text-3xl font-bold ${getMetricStatus(metrics.lcp, thresholds.lcp)} mb-2`}
                      >
                        {metrics.lcp}ms
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Temps de rendu du plus grand élément visible
                      </p>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Bon</span>
                          <span>À améliorer</span>
                          <span>Mauvais</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full flex">
                            <div
                              className="bg-green-500"
                              style={{ width: "40%" }}
                            ></div>
                            <div
                              className="bg-yellow-500"
                              style={{ width: "30%" }}
                            ></div>
                            <div
                              className="bg-red-500"
                              style={{ width: "30%" }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          &lt;2.5s | 2.5s-4s | &gt;4s
                        </div>
                      </div>
                    </div>

                    {/* FID */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          First Input Delay
                        </h3>
                        <Zap
                          className={getMetricStatus(
                            metrics.fid,
                            thresholds.fid,
                          )}
                          size={20}
                        />
                      </div>
                      <div
                        className={`text-3xl font-bold ${getMetricStatus(metrics.fid, thresholds.fid)} mb-2`}
                      >
                        {metrics.fid}ms
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Délai de première interaction
                      </p>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Bon</span>
                          <span>À améliorer</span>
                          <span>Mauvais</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full flex">
                            <div
                              className="bg-green-500"
                              style={{ width: "33%" }}
                            ></div>
                            <div
                              className="bg-yellow-500"
                              style={{ width: "33%" }}
                            ></div>
                            <div
                              className="bg-red-500"
                              style={{ width: "34%" }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          &lt;100ms | 100ms-300ms | &gt;300ms
                        </div>
                      </div>
                    </div>

                    {/* CLS */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Cumulative Layout Shift
                        </h3>
                        <Eye
                          className={getMetricStatus(
                            metrics.cls,
                            thresholds.cls,
                          )}
                          size={20}
                        />
                      </div>
                      <div
                        className={`text-3xl font-bold ${getMetricStatus(metrics.cls, thresholds.cls)} mb-2`}
                      >
                        {metrics.cls}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Stabilité visuelle de la page
                      </p>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Bon</span>
                          <span>À améliorer</span>
                          <span>Mauvais</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full flex">
                            <div
                              className="bg-green-500"
                              style={{ width: "40%" }}
                            ></div>
                            <div
                              className="bg-yellow-500"
                              style={{ width: "30%" }}
                            ></div>
                            <div
                              className="bg-red-500"
                              style={{ width: "30%" }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          &lt;0.1 | 0.1-0.25 | &gt;0.25
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "resources" && metrics && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Memory Usage */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Utilisation Mémoire
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">
                            Heap utilisé
                          </span>
                          <span className="font-medium">
                            {metrics.jsHeapSize} MB
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">
                            Heap total
                          </span>
                          <span className="font-medium">
                            {metrics.jsHeapLimit} MB
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">
                            Utilisation
                          </span>
                          <span
                            className={`font-medium ${getMetricStatus(metrics.memoryUsed, thresholds.memoryUsage)}`}
                          >
                            {metrics.memoryUsed}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              metrics.memoryUsed > thresholds.memoryUsage.error
                                ? "bg-red-500"
                                : metrics.memoryUsed >
                                    thresholds.memoryUsage.warning
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(metrics.memoryUsed, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Network Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Informations Réseau
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">
                            Type de connexion
                          </span>
                          <span className="font-medium">
                            {metrics.connectionType}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">
                            Type effectif
                          </span>
                          <span className="font-medium">
                            {metrics.effectiveType}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">
                            Débit descendant
                          </span>
                          <span className="font-medium">
                            {metrics.downlink} Mbps
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">
                            RTT
                          </span>
                          <span className="font-medium">{metrics.rtt}ms</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DOM Stats */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Statistiques DOM
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {metrics.domElements}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Éléments DOM
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {metrics.loadTime}ms
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Temps de chargement
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {metrics.domReadyTime}ms
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          DOM Ready
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {metrics.renderTime}ms
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Temps de rendu
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "alerts" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Alertes Performance ({alerts.length})
                    </h3>
                    <Button
                      onClick={() => setAlerts([])}
                      size="sm"
                      variant="outline"
                      disabled={alerts.length === 0}
                    >
                      Effacer tout
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start space-x-3 p-4 rounded-lg border ${
                          alert.type === "error"
                            ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                            : alert.type === "warning"
                              ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                              : "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {alert.type === "error" && (
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
                                alert.type === "error"
                                  ? "text-red-900 dark:text-red-200"
                                  : alert.type === "warning"
                                    ? "text-yellow-900 dark:text-yellow-200"
                                    : "text-blue-900 dark:text-blue-200"
                              }`}
                            >
                              {alert.metric} -{" "}
                              {alert.type === "error"
                                ? "Critique"
                                : "Attention"}
                            </h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {alert.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p
                            className={`text-sm mt-1 ${
                              alert.type === "error"
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
                        <p>Aucune alerte de performance</p>
                        <p className="text-sm">
                          Toutes les métriques sont dans les seuils acceptables
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
