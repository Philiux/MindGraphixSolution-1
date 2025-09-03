import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Database,
  Palette,
  Shield,
  Eye,
  Save,
  RefreshCw,
  User,
  Bell,
  Monitor,
  Smartphone,
  Globe,
  Lock,
  Unlock,
  Edit,
  Code,
  BarChart3,
  Users,
  MessageSquare,
  DollarSign,
  Activity,
  Zap,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Info,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Copy,
  Download,
  Upload,
  Trash2,
  Plus,
  Minus,
  RotateCcw,
  Star,
  Heart,
  Target,
  Layers,
  Grid3X3,
  Layout,
  Type,
  Image,
  Link,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Parameter {
  id: string;
  category: string;
  label: string;
  description: string;
  value: any;
  type:
    | "text"
    | "number"
    | "boolean"
    | "color"
    | "select"
    | "textarea"
    | "url"
    | "email"
    | "phone";
  options?: string[];
  icon: React.ElementType;
  editable: boolean;
  sensitive?: boolean;
  status: "active" | "inactive" | "warning" | "error";
  lastUpdated?: Date;
  updatedBy?: string;
  required?: boolean;
  validation?: (value: any) => boolean;
  dependencies?: string[];
  section: string;
}

interface ParameterCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  expanded: boolean;
  count: number;
}

export const AdminParametersView: React.FC = () => {
  const {
    isAdmin,
    isSuperAdmin,
    isMindAdmin,
    currentUser,
    getContent,
    updateContent,
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingParameter, setEditingParameter] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showSensitive, setShowSensitive] = useState(false);
  const [localParameters, setLocalParameters] = useState<Parameter[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Configuration des paramètres du système
  const systemParameters: Parameter[] = [
    // === Paramètres de Contenu ===
    {
      id: "hero.title",
      category: "content",
      section: "Hero Section",
      label: "Titre Principal",
      description: "Le titre principal affiché sur la page d'accueil",
      value: getContent(
        "hero.title",
        "Solutions Créatives pour Votre Présence Digitale",
      ),
      type: "text",
      icon: Type,
      editable: true,
      status: "active",
      required: true,
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
    {
      id: "hero.subtitle",
      category: "content",
      section: "Hero Section",
      label: "Sous-titre",
      description: "Description courte sous le titre principal",
      value: getContent(
        "hero.subtitle",
        "Nous combinons design captivant et développement robuste pour créer des expériences digitales mémorables qui propulsent votre entreprise vers le succès.",
      ),
      type: "textarea",
      icon: Type,
      editable: true,
      status: "active",
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
    {
      id: "hero.cta1",
      category: "content",
      section: "Hero Section",
      label: "Bouton CTA Principal",
      description: "Texte du premier bouton d'action",
      value: getContent("hero.cta1", "Voir nos réalisations"),
      type: "text",
      icon: Target,
      editable: true,
      status: "active",
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
    {
      id: "hero.cta2",
      category: "content",
      section: "Hero Section",
      label: "Bouton CTA Secondaire",
      description: "Texte du second bouton d'action",
      value: getContent("hero.cta2", "Discutons de votre projet"),
      type: "text",
      icon: Target,
      editable: true,
      status: "active",
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },

    // === Informations de Contact ===
    {
      id: "company.name",
      category: "contact",
      section: "Informations Entreprise",
      label: "Nom de l'entreprise",
      description: "Nom officiel de votre entreprise",
      value: getContent("company.name", "Mind Graphix Solutions"),
      type: "text",
      icon: User,
      editable: true,
      status: "active",
      required: true,
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
    {
      id: "company.email",
      category: "contact",
      section: "Informations Contact",
      label: "Email principal",
      description: "Adresse email principale de contact",
      value: getContent("company.email", "contact@mindgraphix.com"),
      type: "email",
      icon: Mail,
      editable: true,
      status: "active",
      required: true,
      validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
    {
      id: "company.phone",
      category: "contact",
      section: "Informations Contact",
      label: "Téléphone",
      description: "Numéro de téléphone principal",
      value: getContent("company.phone", "+1 (555) 123-4567"),
      type: "phone",
      icon: Phone,
      editable: true,
      status: "active",
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
    {
      id: "company.address",
      category: "contact",
      section: "Informations Contact",
      label: "Adresse",
      description: "Adresse physique de l'entreprise",
      value: getContent(
        "company.address",
        "123 Creative Street, Design City, DC 12345",
      ),
      type: "textarea",
      icon: MapPin,
      editable: true,
      status: "active",
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },

    // === Paramètres de Design ===
    {
      id: "colors.primary",
      category: "design",
      section: "Couleurs Principales",
      label: "Couleur Primaire",
      description: "Couleur principale utilisée dans l'interface",
      value: getContent("colors.primary", "#5e35b1"),
      type: "color",
      icon: Palette,
      editable: !isMindAdmin,
      status: "active",
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
    {
      id: "colors.secondary",
      category: "design",
      section: "Couleurs Principales",
      label: "Couleur Secondaire",
      description: "Couleur secondaire pour les accents",
      value: getContent("colors.secondary", "#3949ab"),
      type: "color",
      icon: Palette,
      editable: !isMindAdmin,
      status: "active",
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
    {
      id: "colors.accent",
      category: "design",
      section: "Couleurs Principales",
      label: "Couleur d'Accent",
      description: "Couleur d'accent pour les éléments importants",
      value: getContent("colors.accent", "#ffab00"),
      type: "color",
      icon: Palette,
      editable: !isMindAdmin,
      status: "active",
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },

    // === Paramètres Système ===
    {
      id: "system.maintenance_mode",
      category: "system",
      section: "Maintenance",
      label: "Mode Maintenance",
      description: "Activer/désactiver le mode maintenance du site",
      value: getContent("system.maintenance_mode", false),
      type: "boolean",
      icon: Settings,
      editable: isSuperAdmin,
      status: getContent("system.maintenance_mode", false)
        ? "warning"
        : "active",
      sensitive: true,
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
    {
      id: "system.analytics_enabled",
      category: "system",
      section: "Analytics",
      label: "Analytics Activés",
      description: "Activer le suivi des analytics sur le site",
      value: getContent("system.analytics_enabled", true),
      type: "boolean",
      icon: BarChart3,
      editable: isSuperAdmin,
      status: "active",
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
    {
      id: "system.cache_enabled",
      category: "system",
      section: "Performance",
      label: "Cache Activé",
      description: "Activer la mise en cache pour améliorer les performances",
      value: getContent("system.cache_enabled", true),
      type: "boolean",
      icon: Zap,
      editable: isSuperAdmin,
      status: "active",
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },

    // === Paramètres de Sécurité ===
    {
      id: "security.two_factor_enabled",
      category: "security",
      section: "Authentification",
      label: "Authentification 2FA",
      description: "Authentification à deux facteurs pour les admins",
      value: getContent("security.two_factor_enabled", false),
      type: "boolean",
      icon: Shield,
      editable: isSuperAdmin,
      status: getContent("security.two_factor_enabled", false)
        ? "active"
        : "warning",
      sensitive: true,
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
    {
      id: "security.session_timeout",
      category: "security",
      section: "Sessions",
      label: "Timeout Session (minutes)",
      description: "Durée avant déconnexion automatique",
      value: getContent("security.session_timeout", 60),
      type: "number",
      icon: Clock,
      editable: isSuperAdmin,
      status: "active",
      sensitive: true,
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },

    // === Paramètres de Performance ===
    {
      id: "performance.image_optimization",
      category: "performance",
      section: "Optimisation",
      label: "Optimisation Images",
      description: "Compression automatique des images",
      value: getContent("performance.image_optimization", true),
      type: "boolean",
      icon: Image,
      editable: isSuperAdmin,
      status: "active",
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
    {
      id: "performance.minification",
      category: "performance",
      section: "Optimisation",
      label: "Minification CSS/JS",
      description: "Compression des fichiers CSS et JavaScript",
      value: getContent("performance.minification", true),
      type: "boolean",
      icon: Code,
      editable: isSuperAdmin,
      status: "active",
      lastUpdated: new Date(),
      updatedBy: currentUser?.name || "Système",
    },
  ];

  // Configuration des catégories
  const categories: ParameterCategory[] = [
    {
      id: "content",
      label: "Contenu",
      description: "Gestion du contenu textuel et média",
      icon: Type,
      color: "blue",
      expanded: true,
      count: systemParameters.filter((p) => p.category === "content").length,
    },
    {
      id: "contact",
      label: "Contact",
      description: "Informations de contact et entreprise",
      icon: User,
      color: "green",
      expanded: true,
      count: systemParameters.filter((p) => p.category === "contact").length,
    },
    {
      id: "design",
      label: "Design",
      description: "Apparence visuelle et thème",
      icon: Palette,
      color: "pink",
      expanded: true,
      count: systemParameters.filter((p) => p.category === "design").length,
    },
    {
      id: "system",
      label: "Système",
      description: "Configuration système et maintenance",
      icon: Settings,
      color: "gray",
      expanded: true,
      count: systemParameters.filter((p) => p.category === "system").length,
    },
    {
      id: "security",
      label: "Sécurité",
      description: "Paramètres de sécurité et authentification",
      icon: Shield,
      color: "red",
      expanded: true,
      count: systemParameters.filter((p) => p.category === "security").length,
    },
    {
      id: "performance",
      label: "Performance",
      description: "Optimisation et vitesse du site",
      icon: Zap,
      color: "yellow",
      expanded: true,
      count: systemParameters.filter((p) => p.category === "performance")
        .length,
    },
  ];

  // Initialiser les paramètres locaux
  useEffect(() => {
    setLocalParameters(systemParameters);
  }, []);

  // Filtrer les paramètres selon la recherche et les filtres
  const filteredParameters = localParameters.filter((param) => {
    const matchesSearch =
      searchQuery === "" ||
      param.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      param.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      param.section.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || param.category === selectedCategory;
    const matchesStatus = !filterStatus || param.status === filterStatus;
    const matchesSensitive = showSensitive || !param.sensitive;

    return (
      matchesSearch && matchesCategory && matchesStatus && matchesSensitive
    );
  });

  // Grouper par section
  const groupedParameters = filteredParameters.reduce(
    (acc, param) => {
      if (!acc[param.section]) {
        acc[param.section] = [];
      }
      acc[param.section].push(param);
      return acc;
    },
    {} as Record<string, Parameter[]>,
  );

  // Gérer les modifications
  const handleParameterChange = (id: string, newValue: any) => {
    setLocalParameters((prev) =>
      prev.map((param) =>
        param.id === id
          ? {
              ...param,
              value: newValue,
              lastUpdated: new Date(),
              updatedBy: currentUser?.name || "Système",
            }
          : param,
      ),
    );
    setHasUnsavedChanges(true);
  };

  // Sauvegarder les changements
  const saveChanges = () => {
    localParameters.forEach((param) => {
      if (updateContent) {
        updateContent(param.id, param.value);
      }
    });
    setHasUnsavedChanges(false);
  };

  // Annuler les changements
  const discardChanges = () => {
    setLocalParameters(systemParameters);
    setHasUnsavedChanges(false);
  };

  // Copier la valeur d'un paramètre
  const copyParameterValue = (value: any) => {
    navigator.clipboard.writeText(String(value));
  };

  // Helper pour obtenir les classes de couleur des catégories
  const getCategoryColorClasses = (categoryId: string) => {
    const colorMap: Record<string, string> = {
      content: "from-blue-500 to-blue-600",
      contact: "from-green-500 to-green-600",
      design: "from-pink-500 to-pink-600",
      system: "from-gray-500 to-gray-600",
      security: "from-red-500 to-red-600",
      performance: "from-yellow-500 to-yellow-600",
    };
    return colorMap[categoryId] || "from-gray-500 to-gray-600";
  };

  // Obtenir l'icône de statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "error":
        return AlertCircle;
      default:
        return Info;
    }
  };

  // Obtenir la couleur de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Rendu d'un paramètre
  const renderParameter = (param: Parameter) => {
    const StatusIcon = getStatusIcon(param.status);
    const isEditing = editingParameter === param.id;

    return (
      <motion.div
        key={param.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-card p-6 hover:admin-glow transition-all duration-200"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${getCategoryColorClasses(param.category)} rounded-lg flex items-center justify-center text-white shadow-lg`}
            >
              <param.icon size={20} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {param.label}
                </h4>
                <div className="flex items-center space-x-2">
                  <StatusIcon
                    size={16}
                    className={getStatusColor(param.status)}
                  />
                  {param.required && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      Requis
                    </span>
                  )}
                  {param.sensitive && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      Sensible
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {param.description}
              </p>

              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>
                    Modifié le {param.lastUpdated?.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <User size={12} />
                  <span>par {param.updatedBy}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => copyParameterValue(param.value)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Copier la valeur"
            >
              <Copy size={16} className="text-gray-500" />
            </button>

            {param.editable && (
              <button
                onClick={() => setEditingParameter(isEditing ? null : param.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isEditing
                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                }`}
                title={isEditing ? "Annuler l'édition" : "Modifier"}
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Valeur du paramètre */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Valeur actuelle:
            </span>
            {param.sensitive && !showSensitive ? (
              <span className="text-sm text-gray-500 font-mono">••••••••</span>
            ) : (
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    {param.type === "boolean" ? (
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={param.value}
                            onChange={(e) =>
                              handleParameterChange(param.id, e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {param.value ? "Activé" : "Désactivé"}
                          </span>
                        </label>
                      </div>
                    ) : param.type === "color" ? (
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={param.value}
                          onChange={(e) =>
                            handleParameterChange(param.id, e.target.value)
                          }
                          className="w-12 h-8 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={param.value}
                          onChange={(e) =>
                            handleParameterChange(param.id, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    ) : param.type === "textarea" ? (
                      <textarea
                        value={param.value}
                        onChange={(e) =>
                          handleParameterChange(param.id, e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      />
                    ) : param.type === "select" && param.options ? (
                      <select
                        value={param.value}
                        onChange={(e) =>
                          handleParameterChange(param.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {param.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={param.type}
                        value={param.value}
                        onChange={(e) =>
                          handleParameterChange(
                            param.id,
                            param.type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    )}

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingParameter(null);
                          // Restaurer la valeur originale si nécessaire
                        }}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => setEditingParameter(null)}
                        className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        Valider
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    {param.type === "boolean" ? (
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          param.value
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {param.value ? "Activé" : "Désactivé"}
                      </span>
                    ) : param.type === "color" ? (
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded-lg border border-gray-300 shadow-sm"
                          style={{ backgroundColor: param.value }}
                        />
                        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                          {param.value}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        {String(param.value)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Paramètres Système
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configuration complète de votre site web et de l'administration
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-3">
              <button
                onClick={discardChanges}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm"
              >
                <RotateCcw size={18} />
                <span className="font-medium">Annuler</span>
              </button>
              <button
                onClick={saveChanges}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm"
              >
                <Save size={18} />
                <span className="font-medium">Sauvegarder</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recherche */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Rechercher un paramètre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300/50 dark:border-gray-600/50 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-gray-700"
            />
          </div>

          {/* Filtre par catégorie */}
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white transition-all duration-300 hover:bg-white dark:hover:bg-gray-700"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label} ({category.count})
              </option>
            ))}
          </select>

          {/* Options d'affichage */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-3 bg-white/60 dark:bg-gray-700/60 px-4 py-3 rounded-2xl cursor-pointer hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300">
              <input
                type="checkbox"
                checked={showSensitive}
                onChange={(e) => setShowSensitive(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500 transition-all duration-300"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Afficher sensibles
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const categoryParams = localParameters.filter(
            (p) => p.category === category.id,
          );
          const activeCount = categoryParams.filter(
            (p) => p.status === "active",
          ).length;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-br from-${category.color}-50 to-${category.color}-100 dark:from-${category.color}-900/20 dark:to-${category.color}-800/20 rounded-2xl p-6 border border-${category.color}-200 dark:border-${category.color}-700 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-${category.color}-500/20 backdrop-blur-sm`}
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className={`w-14 h-14 bg-gradient-to-br from-${category.color}-500 to-${category.color}-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${category.color}-500/30`}
                >
                  <category.icon size={26} />
                </motion.div>
                <div className="flex-1">
                  <h3
                    className={`font-bold text-lg text-${category.color}-900 dark:text-${category.color}-100 mb-1`}
                  >
                    {category.label}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <p
                      className={`text-sm font-medium text-${category.color}-700 dark:text-${category.color}-300`}
                    >
                      {activeCount}/{category.count} actifs
                    </p>
                    <div
                      className={`w-2 h-2 rounded-full ${activeCount === category.count ? "bg-green-500" : activeCount > 0 ? "bg-yellow-500" : "bg-red-500"}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Liste des paramètres groupés par section */}
      <div className="space-y-8">
        {Object.entries(groupedParameters).map(([section, params]) => (
          <div key={section}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Layers size={20} className="mr-2 text-blue-500" />
              {section}
              <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({params.length} paramètre{params.length > 1 ? "s" : ""})
              </span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {params.map(renderParameter)}
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun r��sultat */}
      {filteredParameters.length === 0 && (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucun paramètre trouvé
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Modifiez vos critères de recherche ou filtres
          </p>
        </div>
      )}

      {/* Notifications de changements non sauvegardés */}
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-6 z-50 max-w-md mx-auto"
          >
            <div className="bg-amber-100 border border-amber-200 rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle size={20} className="text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">
                    Modifications non sauvegardées
                  </p>
                  <p className="text-xs text-amber-700">
                    N'oubliez pas de sauvegarder vos changements
                  </p>
                </div>
                <button
                  onClick={saveChanges}
                  className="px-3 py-1 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
