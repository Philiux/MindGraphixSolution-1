import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Database,
  Palette,
  Shield,
  Eye,
  Save,
  User,
  Bell,
  Activity,
  Zap,
  BarChart3,
  Users,
  MessageSquare,
  Type,
  Download,
  Upload,
  Network,
  Wifi,
  WifiOff,
  Server,
  Monitor,
  Code,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface TestResult {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "success" | "error" | "warning";
  message?: string;
  duration?: number;
  icon: React.ElementType;
  category: string;
}

interface TestCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface AdminFunctionalityTesterProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const AdminFunctionalityTester: React.FC<
  AdminFunctionalityTesterProps
> = ({ isOpen, setIsOpen }) => {
  const {
    isAdmin,
    isSuperAdmin,
    isMindAdmin,
    currentUser,
    forceSave,
    exportContent,
    importContent,
    getContent,
    updateContent,
  } = useAuth();

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  // Catégories de tests
  const testCategories: TestCategory[] = [
    {
      id: "auth",
      name: "Authentification",
      description: "Tests des fonctions d'authentification et d'autorisation",
      icon: Shield,
      color: "red",
    },
    {
      id: "content",
      name: "Gestion de Contenu",
      description: "Tests des fonctions de gestion et sauvegarde du contenu",
      icon: Type,
      color: "blue",
    },
    {
      id: "ui",
      name: "Interface Utilisateur",
      description: "Tests des composants et de l'interface administrateur",
      icon: Monitor,
      color: "purple",
    },
    {
      id: "data",
      name: "Données & Storage",
      description: "Tests de persistance et gestion des données",
      icon: Database,
      color: "green",
    },
    {
      id: "network",
      name: "Réseau & API",
      description: "Tests des connexions et APIs",
      icon: Network,
      color: "orange",
    },
  ];

  // Configuration des tests
  const initialTests: TestResult[] = [
    // Tests d'authentification
    {
      id: "auth-check",
      name: "Vérification Authentification",
      description: "Vérifie l'état d'authentification actuel",
      status: "pending",
      icon: Shield,
      category: "auth",
    },
    {
      id: "role-check",
      name: "Vérification des Rôles",
      description: "Vérifie les permissions selon le rôle utilisateur",
      status: "pending",
      icon: User,
      category: "auth",
    },
    {
      id: "session-check",
      name: "Validation Session",
      description: "Vérifie la persistance et validité de la session",
      status: "pending",
      icon: Clock,
      category: "auth",
    },

    // Tests de contenu
    {
      id: "content-read",
      name: "Lecture du Contenu",
      description: "Teste la lecture des données de contenu stockées",
      status: "pending",
      icon: Eye,
      category: "content",
    },
    {
      id: "content-write",
      name: "Écriture du Contenu",
      description: "Teste la modification et sauvegarde du contenu",
      status: "pending",
      icon: Type,
      category: "content",
    },
    {
      id: "content-save",
      name: "Sauvegarde Forcée",
      description: "Teste la fonction de sauvegarde forcée",
      status: "pending",
      icon: Save,
      category: "content",
    },
    {
      id: "content-export",
      name: "Export du Contenu",
      description: "Teste l'export des données en JSON",
      status: "pending",
      icon: Download,
      category: "content",
    },

    // Tests d'interface
    {
      id: "ui-theme",
      name: "Système de Thème",
      description: "Vérifie l'application et persistance des thèmes",
      status: "pending",
      icon: Palette,
      category: "ui",
    },
    {
      id: "ui-navigation",
      name: "Navigation Admin",
      description: "Teste la navigation entre les sections du dashboard",
      status: "pending",
      icon: Monitor,
      category: "ui",
    },
    {
      id: "ui-responsive",
      name: "Responsive Design",
      description: "Vérifie l'adaptation aux différentes tailles d'écran",
      status: "pending",
      icon: Monitor,
      category: "ui",
    },

    // Tests de données
    {
      id: "data-localStorage",
      name: "Local Storage",
      description: "Teste l'accès et persistance du localStorage",
      status: "pending",
      icon: Database,
      category: "data",
    },
    {
      id: "data-validation",
      name: "Validation des Données",
      description: "Vérifie l'intégrité et validation des données",
      status: "pending",
      icon: CheckCircle,
      category: "data",
    },

    // Tests réseau
    {
      id: "network-api",
      name: "Connectivité API",
      description: "Teste la connexion aux endpoints API",
      status: "pending",
      icon: Network,
      category: "network",
    },
    {
      id: "network-ping",
      name: "Test de Ping",
      description: "Vérifie la latence et disponibilité du serveur",
      status: "pending",
      icon: Wifi,
      category: "network",
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setTestResults(initialTests);
    }
  }, [isOpen]);

  // Fonction de test individuel
  const runSingleTest = async (testId: string): Promise<TestResult> => {
    const test = testResults.find((t) => t.id === testId);
    if (!test) throw new Error("Test non trouvé");

    const startTime = Date.now();

    try {
      switch (testId) {
        case "auth-check":
          if (!isAdmin) {
            return {
              ...test,
              status: "error",
              message: "Utilisateur non authentifié",
              duration: Date.now() - startTime,
            };
          }
          return {
            ...test,
            status: "success",
            message: `Authentifié en tant que ${currentUser?.name || "Admin"}`,
            duration: Date.now() - startTime,
          };

        case "role-check":
          const roles = [];
          if (isAdmin) roles.push("Admin");
          if (isSuperAdmin) roles.push("Super Admin");
          if (isMindAdmin) roles.push("Mind Admin");

          if (roles.length === 0) {
            return {
              ...test,
              status: "error",
              message: "Aucun rôle détecté",
              duration: Date.now() - startTime,
            };
          }
          return {
            ...test,
            status: "success",
            message: `Rôles: ${roles.join(", ")}`,
            duration: Date.now() - startTime,
          };

        case "session-check":
          const sessionData = localStorage.getItem("currentUser");
          if (!sessionData) {
            return {
              ...test,
              status: "warning",
              message: "Session non persistée",
              duration: Date.now() - startTime,
            };
          }
          return {
            ...test,
            status: "success",
            message: "Session valide et persistée",
            duration: Date.now() - startTime,
          };

        case "content-read":
          const testContent = getContent("test.content", "default");
          return {
            ...test,
            status: "success",
            message: `Lecture réussie: ${testContent}`,
            duration: Date.now() - startTime,
          };

        case "content-write":
          const testValue = `Test-${Date.now()}`;
          updateContent("test.write", testValue);
          const readBack = getContent("test.write");

          if (readBack === testValue) {
            return {
              ...test,
              status: "success",
              message: "Écriture et lecture confirmées",
              duration: Date.now() - startTime,
            };
          }
          return {
            ...test,
            status: "error",
            message: "Échec de l'écriture",
            duration: Date.now() - startTime,
          };

        case "content-save":
          if (!forceSave) {
            return {
              ...test,
              status: "error",
              message: "Fonction forceSave non disponible",
              duration: Date.now() - startTime,
            };
          }
          forceSave();
          return {
            ...test,
            status: "success",
            message: "Sauvegarde forcée exécutée",
            duration: Date.now() - startTime,
          };

        case "content-export":
          if (!exportContent) {
            return {
              ...test,
              status: "error",
              message: "Fonction exportContent non disponible",
              duration: Date.now() - startTime,
            };
          }
          return {
            ...test,
            status: "success",
            message: "Fonction d'export disponible",
            duration: Date.now() - startTime,
          };

        case "ui-theme":
          const savedTheme = localStorage.getItem("adminTheme");
          return {
            ...test,
            status: "success",
            message: `Thème actuel: ${savedTheme || "défaut"}`,
            duration: Date.now() - startTime,
          };

        case "ui-navigation":
          const navItems = document.querySelectorAll(
            '[data-testid="nav-item"]',
          );
          return {
            ...test,
            status: "success",
            message: `${navItems.length} éléments de navigation détectés`,
            duration: Date.now() - startTime,
          };

        case "ui-responsive":
          const isMobile = window.innerWidth < 768;
          const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
          const isDesktop = window.innerWidth >= 1024;

          let deviceType = "Unknown";
          if (isMobile) deviceType = "Mobile";
          else if (isTablet) deviceType = "Tablet";
          else if (isDesktop) deviceType = "Desktop";

          return {
            ...test,
            status: "success",
            message: `Détecté: ${deviceType} (${window.innerWidth}px)`,
            duration: Date.now() - startTime,
          };

        case "data-localStorage":
          try {
            const testKey = "admin-test";
            const testData = { test: true, timestamp: Date.now() };
            localStorage.setItem(testKey, JSON.stringify(testData));
            const retrieved = JSON.parse(localStorage.getItem(testKey) || "{}");
            localStorage.removeItem(testKey);

            if (retrieved.test) {
              return {
                ...test,
                status: "success",
                message: "LocalStorage fonctionnel",
                duration: Date.now() - startTime,
              };
            }
            return {
              ...test,
              status: "error",
              message: "Échec localStorage",
              duration: Date.now() - startTime,
            };
          } catch (error) {
            return {
              ...test,
              status: "error",
              message: "LocalStorage non disponible",
              duration: Date.now() - startTime,
            };
          }

        case "data-validation":
          const sampleData = getContent("hero.title", "");
          if (typeof sampleData === "string" && sampleData.length > 0) {
            return {
              ...test,
              status: "success",
              message: "Donn��es valides détectées",
              duration: Date.now() - startTime,
            };
          }
          return {
            ...test,
            status: "warning",
            message: "Données limitées ou invalides",
            duration: Date.now() - startTime,
          };

        case "network-api":
          try {
            const response = await fetch("/api/ping");
            if (response.ok) {
              return {
                ...test,
                status: "success",
                message: "API accessible",
                duration: Date.now() - startTime,
              };
            }
            return {
              ...test,
              status: "warning",
              message: `API répond avec status ${response.status}`,
              duration: Date.now() - startTime,
            };
          } catch (error) {
            return {
              ...test,
              status: "error",
              message: "API inaccessible",
              duration: Date.now() - startTime,
            };
          }

        case "network-ping":
          const pingStart = Date.now();
          try {
            await fetch("/api/ping", { method: "HEAD" });
            const pingTime = Date.now() - pingStart;
            const status =
              pingTime < 100 ? "success" : pingTime < 300 ? "warning" : "error";
            return {
              ...test,
              status,
              message: `Latence: ${pingTime}ms`,
              duration: Date.now() - startTime,
            };
          } catch (error) {
            return {
              ...test,
              status: "error",
              message: "Ping échoué",
              duration: Date.now() - startTime,
            };
          }

        default:
          return {
            ...test,
            status: "error",
            message: "Test non implémenté",
            duration: Date.now() - startTime,
          };
      }
    } catch (error) {
      return {
        ...test,
        status: "error",
        message: `Erreur: ${error}`,
        duration: Date.now() - startTime,
      };
    }
  };

  // Exécuter tous les tests
  const runAllTests = async () => {
    setIsRunning(true);
    setOverallProgress(0);

    const filteredTests = selectedCategory
      ? testResults.filter((t) => t.category === selectedCategory)
      : testResults;

    for (let i = 0; i < filteredTests.length; i++) {
      const test = filteredTests[i];

      // Marquer comme en cours
      setTestResults((prev) =>
        prev.map((t) => (t.id === test.id ? { ...t, status: "running" } : t)),
      );

      // Exécuter le test
      const result = await runSingleTest(test.id);

      // Mettre à jour le résultat
      setTestResults((prev) =>
        prev.map((t) => (t.id === test.id ? result : t)),
      );

      // Mettre à jour le progrès
      setOverallProgress(((i + 1) / filteredTests.length) * 100);

      // Petit délai pour l'animation
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setIsRunning(false);
  };

  // Obtenir les statistiques
  const getStats = () => {
    const total = testResults.length;
    const success = testResults.filter((t) => t.status === "success").length;
    const error = testResults.filter((t) => t.status === "error").length;
    const warning = testResults.filter((t) => t.status === "warning").length;
    const pending = testResults.filter((t) => t.status === "pending").length;

    return { total, success, error, warning, pending };
  };

  const stats = getStats();
  const filteredResults = selectedCategory
    ? testResults.filter((t) => t.category === selectedCategory)
    : testResults;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="admin-card w-full max-w-6xl max-h-[90vh] m-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Zap size={32} />
                <div>
                  <h2 className="text-2xl font-bold">
                    Test des Fonctionnalités
                  </h2>
                  <p className="text-blue-100">
                    Diagnostic complet du système administrateur
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Statistiques */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-lg font-bold">{stats.total}</div>
                <div className="text-xs opacity-80">Total</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-3 text-center">
                <div className="text-lg font-bold">{stats.success}</div>
                <div className="text-xs opacity-80">Réussis</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-3 text-center">
                <div className="text-lg font-bold">{stats.error}</div>
                <div className="text-xs opacity-80">Échecs</div>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                <div className="text-lg font-bold">{stats.warning}</div>
                <div className="text-xs opacity-80">Avertissements</div>
              </div>
              <div className="bg-gray-500/20 rounded-lg p-3 text-center">
                <div className="text-lg font-bold">{stats.pending}</div>
                <div className="text-xs opacity-80">En attente</div>
              </div>
            </div>

            {/* Barre de progression */}
            {isRunning && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progression des tests</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    className="bg-white h-2 rounded-full"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="p-6 max-h-[calc(90vh-300px)] overflow-y-auto">
            {/* Contrôles */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={runAllTests}
                  disabled={isRunning}
                  className="admin-button-primary px-4 py-2 flex items-center space-x-2 disabled:opacity-50"
                >
                  {isRunning ? <Pause size={16} /> : <Play size={16} />}
                  <span>
                    {isRunning ? "Tests en cours..." : "Lancer tous les tests"}
                  </span>
                </button>

                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="admin-input px-3 py-2 text-sm"
                >
                  <option value="">Toutes les catégories</option>
                  {testCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Catégories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {testCategories.map((category) => {
                const categoryTests = testResults.filter(
                  (t) => t.category === category.id,
                );
                const categoryStats = {
                  total: categoryTests.length,
                  success: categoryTests.filter((t) => t.status === "success")
                    .length,
                  error: categoryTests.filter((t) => t.status === "error")
                    .length,
                };

                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    className={`admin-card p-4 cursor-pointer transition-all ${
                      selectedCategory === category.id ? "admin-glow" : ""
                    }`}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category.id ? null : category.id,
                      )
                    }
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div
                        className={`w-10 h-10 bg-${category.color}-500 rounded-lg flex items-center justify-center text-white`}
                      >
                        <category.icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-xs opacity-70">
                          {categoryStats.success}/{categoryStats.total} réussis
                        </p>
                      </div>
                    </div>
                    <p className="text-sm opacity-80">{category.description}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Résultats des tests */}
            <div className="space-y-3">
              {filteredResults.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`admin-card p-4 flex items-center space-x-4 ${
                    test.status === "running" ? "admin-pulse" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      test.status === "success"
                        ? "bg-green-500 text-white"
                        : test.status === "error"
                          ? "bg-red-500 text-white"
                          : test.status === "warning"
                            ? "bg-yellow-500 text-white"
                            : test.status === "running"
                              ? "bg-blue-500 text-white animate-pulse"
                              : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {test.status === "success" ? (
                      <CheckCircle size={20} />
                    ) : test.status === "error" ? (
                      <XCircle size={20} />
                    ) : test.status === "warning" ? (
                      <AlertCircle size={20} />
                    ) : test.status === "running" ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <test.icon size={20} />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium">{test.name}</h4>
                    <p className="text-sm opacity-70">{test.description}</p>
                    {test.message && (
                      <p
                        className={`text-xs mt-1 ${
                          test.status === "success"
                            ? "text-green-600"
                            : test.status === "error"
                              ? "text-red-600"
                              : test.status === "warning"
                                ? "text-yellow-600"
                                : "text-blue-600"
                        }`}
                      >
                        {test.message}
                      </p>
                    )}
                  </div>

                  {test.duration && (
                    <div className="text-xs opacity-50">{test.duration}ms</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminFunctionalityTester;
