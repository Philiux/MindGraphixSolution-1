import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Shield,
  Star,
  Palette,
  Database,
  Users,
  Settings,
  Activity,
  BarChart3,
  Globe,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Terminal,
  Code,
  Zap,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Info,
  Bell,
  Mail,
  Phone,
  Webhook,
  Server,
  HardDrive,
  Wifi,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

interface AdminFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: "theme" | "users" | "system" | "security" | "content" | "analytics";
  requiredLevel: "admin" | "super" | "mind";
  dangerous?: boolean;
  enabled: boolean;
  action: () => void;
}

interface SystemMetric {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  status: "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  icon: React.ElementType;
}

export const AdminFeatureManager: React.FC = () => {
  const { currentUser, isAdmin, isSuperAdmin, isMindAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [showDangerousActions, setShowDangerousActions] = useState(false);

  // Initialiser les métriques système
  useEffect(() => {
    const metrics: SystemMetric[] = [
      {
        id: "cpu",
        name: "CPU",
        value: Math.floor(Math.random() * 40 + 30),
        unit: "%",
        status: "good",
        trend: "stable",
        icon: Activity,
      },
      {
        id: "memory",
        name: "Mémoire",
        value: Math.floor(Math.random() * 30 + 50),
        unit: "%",
        status: "good",
        trend: "up",
        icon: HardDrive,
      },
      {
        id: "disk",
        name: "Stockage",
        value: Math.floor(Math.random() * 20 + 60),
        unit: "%",
        status: "warning",
        trend: "up",
        icon: Database,
      },
      {
        id: "network",
        name: "Réseau",
        value: "Stable",
        status: "good",
        trend: "stable",
        icon: Wifi,
      },
      {
        id: "users",
        name: "Utilisateurs actifs",
        value: Math.floor(Math.random() * 50 + 100),
        status: "good",
        trend: "up",
        icon: Users,
      },
      {
        id: "requests",
        name: "Requêtes/min",
        value: Math.floor(Math.random() * 1000 + 2000),
        status: "good",
        trend: "stable",
        icon: BarChart3,
      },
    ];
    setSystemMetrics(metrics);

    // Actualiser toutes les 5 secondes
    const interval = setInterval(() => {
      setSystemMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value:
            typeof metric.value === "number"
              ? Math.floor(Math.random() * 20 + Number(metric.value) - 10)
              : metric.value,
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Définir les fonctionnalités disponibles selon le niveau
  const adminFeatures: AdminFeature[] = [
    // Fonctionnalités basiques (Admin)
    {
      id: "change-theme",
      name: "Changer le thème",
      description: "Modifier l'apparence visuelle du site",
      icon: Palette,
      category: "theme",
      requiredLevel: "admin",
      enabled: true,
      action: () => {
        const event = new CustomEvent("openThemeSelector");
        window.dispatchEvent(event);
      },
    },
    {
      id: "view-users",
      name: "Voir les utilisateurs",
      description: "Consulter la liste des utilisateurs",
      icon: Users,
      category: "users",
      requiredLevel: "admin",
      enabled: true,
      action: () => {
        console.log("Affichage de la liste des utilisateurs");
      },
    },
    {
      id: "edit-content",
      name: "Modifier le contenu",
      description: "Éditer le contenu du site",
      icon: Settings,
      category: "content",
      requiredLevel: "admin",
      enabled: true,
      action: () => {
        console.log("Mode édition activé");
      },
    },

    // Fonctionnalités Super Admin
    {
      id: "manage-users",
      name: "Gérer les utilisateurs",
      description: "Créer, modifier et supprimer des comptes",
      icon: Users,
      category: "users",
      requiredLevel: "super",
      enabled: true,
      action: () => {
        console.log("Gestionnaire d'utilisateurs ouvert");
      },
    },
    {
      id: "system-settings",
      name: "Paramètres système",
      description: "Configuration avancée du système",
      icon: Settings,
      category: "system",
      requiredLevel: "super",
      enabled: true,
      action: () => {
        console.log("Paramètres système ouverts");
      },
    },
    {
      id: "security-audit",
      name: "Audit de sécurité",
      description: "Vérifier la sécurité du système",
      icon: Shield,
      category: "security",
      requiredLevel: "super",
      enabled: true,
      action: () => {
        console.log("Audit de sécurité lancé");
      },
    },
    {
      id: "backup-system",
      name: "Sauvegarder le système",
      description: "Créer une sauvegarde complète",
      icon: Download,
      category: "system",
      requiredLevel: "super",
      enabled: true,
      action: () => {
        console.log("Sauvegarde en cours...");
      },
    },

    // Fonctionnalités Mind Admin (Ultra-avancées)
    {
      id: "database-access",
      name: "Accès base de données",
      description: "Accès direct à la base de données",
      icon: Database,
      category: "system",
      requiredLevel: "mind",
      dangerous: true,
      enabled: true,
      action: () => {
        console.log("Accès base de données ouvert");
      },
    },
    {
      id: "system-terminal",
      name: "Terminal système",
      description: "Accès console serveur",
      icon: Terminal,
      category: "system",
      requiredLevel: "mind",
      dangerous: true,
      enabled: true,
      action: () => {
        console.log("Terminal système ouvert");
      },
    },
    {
      id: "emergency-mode",
      name: "Mode d'urgence",
      description: "Activer le mode de sécurité d'urgence",
      icon: AlertTriangle,
      category: "security",
      requiredLevel: "mind",
      dangerous: true,
      enabled: true,
      action: () => {
        console.log("MODE D'URGENCE ACTIVÉ");
      },
    },
    {
      id: "system-restart",
      name: "Redémarrer le système",
      description: "Redémarrage complet du serveur",
      icon: RefreshCw,
      category: "system",
      requiredLevel: "mind",
      dangerous: true,
      enabled: true,
      action: () => {
        console.log("Redémarrage système...");
      },
    },
    {
      id: "master-reset",
      name: "Reset complet",
      description: "Remise à zéro complète du système",
      icon: Zap,
      category: "system",
      requiredLevel: "mind",
      dangerous: true,
      enabled: false,
      action: () => {
        console.log("RESET COMPLET - ATTENTION!");
      },
    },
  ];

  // Filtrer les fonctionnalités selon le niveau d'autorité
  const getAvailableFeatures = () => {
    return adminFeatures.filter((feature) => {
      // Vérifier le niveau d'autorité
      if (feature.requiredLevel === "mind" && !isMindAdmin) return false;
      if (feature.requiredLevel === "super" && !isSuperAdmin && !isMindAdmin)
        return false;
      if (feature.requiredLevel === "admin" && !isAdmin) return false;

      // Filtrer par catégorie si sélectionnée
      if (selectedCategory !== "all" && feature.category !== selectedCategory)
        return false;

      // Masquer les actions dangereuses si non autorisées
      if (feature.dangerous && !showDangerousActions) return false;

      return true;
    });
  };

  const categories = [
    { id: "all", label: "Toutes", icon: Star },
    { id: "theme", label: "Thème", icon: Palette },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "system", label: "Système", icon: Settings },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "content", label: "Contenu", icon: Globe },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getUserLevelBadge = () => {
    if (isMindAdmin)
      return {
        label: "Mind Admin",
        icon: Crown,
        color: "text-yellow-600 bg-yellow-100",
      };
    if (isSuperAdmin)
      return {
        label: "Super Admin",
        icon: Shield,
        color: "text-blue-600 bg-blue-100",
      };
    return { label: "Admin", icon: Star, color: "text-green-600 bg-green-100" };
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Accès Administrateur Requis
          </h3>
          <p className="text-gray-600">
            Cette section est réservée aux administrateurs.
          </p>
        </div>
      </div>
    );
  }

  const userLevel = getUserLevelBadge();
  const availableFeatures = getAvailableFeatures();

  return (
    <div className="space-y-6">
      {/* Header avec informations utilisateur */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <userLevel.icon size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Centre de Contrôle</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${userLevel.color} text-black`}
                >
                  <userLevel.icon size={14} className="inline mr-1" />
                  {userLevel.label}
                </span>
                <span className="text-white/80 text-sm">
                  {currentUser?.name || "Administrateur"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-white/80 text-sm">
              {availableFeatures.length} fonctionnalités disponibles
            </p>
            <p className="text-xs text-white/60">
              Niveau d'accès :{" "}
              {isMindAdmin ? "Complet" : isSuperAdmin ? "Avancé" : "Standard"}
            </p>
          </div>
        </div>
      </div>

      {/* Métriques système en temps réel */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {systemMetrics.map((metric) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <metric.icon size={20} className="text-gray-600" />
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}
              >
                {metric.status === "good"
                  ? "OK"
                  : metric.status === "warning"
                    ? "⚠️"
                    : "🔴"}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-gray-900">
                {metric.value}
                {metric.unit}
              </p>
              <p className="text-xs text-gray-600">{metric.name}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation par catégories */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? "bg-emerald-100 text-emerald-700 shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <category.icon size={16} />
              <span className="font-medium">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Toggle actions dangereuses */}
        {(isSuperAdmin || isMindAdmin) && (
          <div className="flex items-center justify-between mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-orange-600" size={20} />
              <div>
                <p className="font-medium text-orange-800">
                  Actions Dangereuses
                </p>
                <p className="text-sm text-orange-600">
                  Afficher les fonctionnalités à risque
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDangerousActions(!showDangerousActions)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                showDangerousActions ? "bg-orange-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  showDangerousActions ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        )}

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {availableFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 rounded-xl border transition-all hover:shadow-lg ${
                  feature.dangerous
                    ? "bg-red-50 border-red-200 hover:border-red-300"
                    : feature.enabled
                      ? "bg-white border-gray-200 hover:border-emerald-300"
                      : "bg-gray-50 border-gray-200 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      feature.dangerous
                        ? "bg-red-100 text-red-600"
                        : feature.enabled
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <feature.icon size={24} />
                  </div>

                  <div className="flex space-x-1">
                    {feature.dangerous && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                        DANGER
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        feature.requiredLevel === "mind"
                          ? "bg-yellow-100 text-yellow-800"
                          : feature.requiredLevel === "super"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {feature.requiredLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {feature.description}
                </p>

                <Button
                  onClick={feature.action}
                  disabled={!feature.enabled}
                  className={`w-full ${
                    feature.dangerous
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  size="sm"
                >
                  {feature.enabled ? "Exécuter" : "Indisponible"}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {availableFeatures.length === 0 && (
          <div className="text-center py-12">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune fonctionnalité trouvée
            </h3>
            <p className="text-gray-600">
              {selectedCategory === "all"
                ? "Aucune fonctionnalité disponible pour votre niveau d'accès."
                : `Aucune fonctionnalité disponible dans la catégorie "${categories.find((c) => c.id === selectedCategory)?.label}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
