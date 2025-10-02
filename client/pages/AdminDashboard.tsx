import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Eye,
  Edit,
  Users,
  MessageSquare,
  Palette,
  Type,
  Image,
  BarChart3,
  Monitor,
  Smartphone,
  LogOut,
  Home,
  Globe,
  Save,
  RefreshCw,
  Bell,
  ChevronDown,
  Menu,
  X,
  Search,
  Filter,
  Download,
  Upload,
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Zap,
  Shield,
  Plus,
  Grid3X3,
  Layout,
  Play,
  Pause,
  Coffee,
  Award,
  Target,
  Sparkles,
  Flame,
  Bookmark,
  Heart,
  CheckCircle,
  AlertCircle,
  Database,
  Code,
  PieChart,
  LineChart,
  BarChart,
  TrendingDown,
  UserCheck,
  UserPlus,
  FileText,
  Layers,
  Command,
  Keyboard,
  RotateCcw,
} from "lucide-react";
import { AdminNotifications } from "../components/AdminNotifications";
import { LivePreview } from "../components/LivePreview";
import { useAutoSave } from "../hooks/useAutoSave";
import { AdminManager } from "../components/AdminManager";
import { PriceManager } from "../components/PriceManager";
import { ThemeManager } from "../components/ThemeManager";
import { CustomStylesEditor } from "../components/CustomStylesEditor";
import { AdvancedStyleManager } from "../components/AdvancedStyleManager";
import { SafeAdminWrapper } from "../components/SafeAdminWrapper";
import { RealTimeStats } from "../components/RealTimeStats";
import { QuoteManager } from "../components/QuoteManager";
import { AdvancedAdminManager } from "../components/AdvancedAdminManager";
import { AdminParametersView } from "../components/AdminParametersView";
import { ModernAdminTheme } from "../components/ModernAdminTheme";
import { SystemDashboard } from "../components/SystemDashboard";
import SupremeAIAssistant from "../components/SupremeAIAssistant";
import AIQuestionnaire from "../components/AIQuestionnaire";

// Interface pour les statistiques de performance
interface PerformanceMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

// Interface pour les notifications système
interface SystemNotification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: Date;
  action?: {
    label: string;
    callback: () => void;
  };
}

// Interface pour les tâches récentes
interface RecentActivity {
  id: string;
  type: "content" | "user" | "system" | "design";
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  status: "completed" | "pending" | "failed";
}

export default function AdminDashboard() {
  const {
    isAdmin,
    isSuperAdmin,
    isMindAdmin,
    isLoggedIn,
    logout,
    updateContent,
    getContent,
    currentUser,
  } = useAuth();

  // États principaux
  const [activeTab, setActiveTab] = useState("overview");
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // États pour les métriques de performance
  const [performanceMetrics, setPerformanceMetrics] = useState<
    PerformanceMetric[]
  >([]);
  const [systemNotifications, setSystemNotifications] = useState<
    SystemNotification[]
  >([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    [],
  );
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  const { forceSave, exportContent, importContent } = useAutoSave();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Vérification d'accès
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Génération des métriques de performance en temps réel
  useEffect(() => {
    const generateMetrics = (): PerformanceMetric[] => [
      {
        id: "visitors",
        label: "Visiteurs actifs",
        value: Math.floor(Math.random() * 50) + 15,
        unit: "",
        trend: "up",
        change: Math.floor(Math.random() * 15) + 5,
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        id: "pageviews",
        label: "Pages vues",
        value: Math.floor(Math.random() * 1000) + 500,
        unit: "/h",
        trend: "up",
        change: Math.floor(Math.random() * 20) + 10,
        icon: Eye,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        id: "performance",
        label: "Performance",
        value: Math.floor(Math.random() * 20) + 85,
        unit: "%",
        trend: "stable",
        change: Math.floor(Math.random() * 5),
        icon: Zap,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        id: "conversion",
        label: "Conversion",
        value: Math.floor(Math.random() * 10) + 12,
        unit: "%",
        trend: "up",
        change: Math.floor(Math.random() * 3) + 1,
        icon: Target,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
      {
        id: "satisfaction",
        label: "Satisfaction",
        value: Math.floor(Math.random() * 10) + 92,
        unit: "%",
        trend: "up",
        change: Math.floor(Math.random() * 5) + 2,
        icon: Heart,
        color: "text-pink-600",
        bgColor: "bg-pink-50",
      },
      {
        id: "revenue",
        label: "Revenus",
        value: Math.floor(Math.random() * 50000) + 25000,
        unit: " FCFA",
        trend: "up",
        change: Math.floor(Math.random() * 15) + 8,
        icon: TrendingUp,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
      },
    ];

    if (isRealTimeEnabled) {
      setPerformanceMetrics(generateMetrics());
    }

    const interval = setInterval(() => {
      if (isRealTimeEnabled) {
        setPerformanceMetrics(generateMetrics());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTimeEnabled]);

  // Génération des notifications système
  useEffect(() => {
    const generateNotifications = (): SystemNotification[] => [
      {
        id: "1",
        type: "success",
        title: "Sauvegarde automatique",
        message: "Les données ont été sauvegardées avec succès",
        timestamp: new Date(),
      },
      {
        id: "2",
        type: "info",
        title: "Mise à jour disponible",
        message: "Une nouvelle version du dashboard est disponible",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        action: {
          label: "Mettre à jour",
          callback: () => console.log("Mise à jour..."),
        },
      },
      {
        id: "3",
        type: "warning",
        title: "Connexions multiples",
        message: "Plusieurs connexions administrateur détectées",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
      },
    ];

    setSystemNotifications(generateNotifications());
  }, []);

  // Génération des activités récentes
  useEffect(() => {
    const generateActivities = (): RecentActivity[] => [
      {
        id: "1",
        type: "content",
        title: "Modification du contenu",
        description: "Section À propos mise à jour",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: currentUser?.name || "Administrateur",
        status: "completed",
      },
      {
        id: "2",
        type: "design",
        title: "Changement de thème",
        description: "Couleurs primaires modifiées",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        user: currentUser?.name || "Administrateur",
        status: "completed",
      },
      {
        id: "3",
        type: "user",
        title: "Nouvelle demande",
        description: "Demande de devis reçue",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        user: "Client",
        status: "pending",
      },
    ];

    setRecentActivities(generateActivities());
  }, [currentUser]);

  // Configuration des rôles
  const getUserRole = () => {
    const isMindAdminStrict =
      isMindAdmin ||
      currentUser?.email === "admin@mindgraphix.com" ||
      currentUser?.role === "mind";

    if (isMindAdminStrict)
      return {
        label: "Modérateur Mind",
        color: "from-blue-500 to-blue-600",
        badge: "📰️",
        description: "Gestion avancée du contenu et des communications",
      };
    if (isSuperAdmin)
      return {
        label: "Super Admin",
        color: "from-purple-500 to-purple-600",
        badge: "👑",
        description: "Contrôle total du système et gestion complète",
      };
    return {
      label: "Administrateur",
      color: "from-green-500 to-green-600",
      badge: "🔧",
      description: "Gestion du contenu et des paramètres de base",
    };
  };

  const userRole = getUserRole();

  // Menu items basés sur le rôle
  const getMenuItems = () => {
    const baseItems = [
      {
        id: "overview",
        label: "Vue d'ensemble",
        icon: BarChart3,
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        description: "Tableau de bord principal et métriques",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: PieChart,
        color: "from-indigo-500 to-indigo-600",
        bgColor: "bg-indigo-50",
        textColor: "text-indigo-700",
        description: "Statistiques détaillées et analyses",
      },
      {
        id: "messages",
        label: "Messages",
        icon: MessageSquare,
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        description: "Communications et support client",
      },
      {
        id: "system",
        label: "Système",
        icon: Activity,
        color: "from-slate-500 to-slate-600",
        bgColor: "bg-slate-50",
        textColor: "text-slate-700",
        description: "Tableau de bord système et diagnostics",
      },
    ];

    const isMindAdminStrict =
      isMindAdmin ||
      currentUser?.email === "admin@mindgraphix.com" ||
      currentUser?.role === "mind";

    if (isMindAdminStrict) {
      return [
        ...baseItems,
        {
          id: "content",
          label: "Contenu",
          icon: Type,
          color: "from-purple-500 to-purple-600",
          bgColor: "bg-purple-50",
          textColor: "text-purple-700",
          description: "Gestion et modération du contenu",
        },
        {
          id: "parameters",
          label: "Paramètres",
          icon: Settings,
          color: "from-gray-500 to-gray-600",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          description: "Configuration complète du système",
        },
        {
          id: "users",
          label: "Utilisateurs",
          icon: Users,
          color: "from-orange-500 to-orange-600",
          bgColor: "bg-orange-50",
          textColor: "text-orange-700",
          description: "Gestion des comptes utilisateurs",
        },
        {
          id: "clients",
          label: "Clients & Devis",
          icon: Users,
          color: "from-teal-500 to-teal-600",
          bgColor: "bg-teal-50",
          textColor: "text-teal-700",
          description: "Gestion des clients et demandes",
        },
      ];
    }

    if (isSuperAdmin && !isMindAdminStrict) {
      return [
        ...baseItems,
        {
          id: "content",
          label: "Contenu",
          icon: Type,
          color: "from-purple-500 to-purple-600",
          bgColor: "bg-purple-50",
          textColor: "text-purple-700",
          description: "Gestion complète du contenu",
        },
        {
          id: "design",
          label: "Design",
          icon: Palette,
          color: "from-pink-500 to-pink-600",
          bgColor: "bg-pink-50",
          textColor: "text-pink-700",
          description: "Personnalisation visuelle",
        },
        {
          id: "media",
          label: "Médias",
          icon: Image,
          color: "from-amber-500 to-amber-600",
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          description: "Gestion des fichiers multimédias",
        },
        {
          id: "users",
          label: "Utilisateurs",
          icon: Users,
          color: "from-orange-500 to-orange-600",
          bgColor: "bg-orange-50",
          textColor: "text-orange-700",
          description: "Administration des utilisateurs",
        },
        {
          id: "parameters",
          label: "Paramètres",
          icon: Settings,
          color: "from-gray-500 to-gray-600",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          description: "Configuration complète du système",
        },
        {
          id: "settings",
          label: "Système Avancé",
          icon: Database,
          color: "from-slate-500 to-slate-600",
          bgColor: "bg-slate-50",
          textColor: "text-slate-700",
          description: "Configuration système avancée",
        },
      ];
    }

    return [
      ...baseItems,
      {
        id: "content",
        label: "Contenu",
        icon: Type,
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
        textColor: "text-purple-700",
        description: "Gestion du contenu",
      },
      {
        id: "design",
        label: "Design",
        icon: Palette,
        color: "from-pink-500 to-pink-600",
        bgColor: "bg-pink-50",
        textColor: "text-pink-700",
        description: "Personnalisation du thème",
      },
      {
        id: "parameters",
        label: "Paramètres",
        icon: Settings,
        color: "from-gray-500 to-gray-600",
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
        description: "Configuration du système",
      },
    ];
  };

  const menuItems = getMenuItems();

  // Gestion du mode sombre
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Palette de commandes (raccourcis clavier)
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  const commandPaletteCommands = [
    {
      id: "overview",
      label: "Aller à Vue d'ensemble",
      action: () => setActiveTab("overview"),
    },
    {
      id: "content",
      label: "Modifier le contenu",
      action: () => setActiveTab("content"),
    },
    {
      id: "design",
      label: "Personnaliser le design",
      action: () => setActiveTab("design"),
    },
    { id: "save", label: "Sauvegarder les modifications", action: forceSave },
    { id: "export", label: "Exporter le contenu", action: exportContent },
    {
      id: "preview",
      label: "Voir le site",
      action: () => window.open("/", "_blank"),
    },
    { id: "logout", label: "Se déconnecter", action: logout },
  ];

  const filteredCommands = commandPaletteCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Formatage des valeurs
  const formatMetricValue = (metric: PerformanceMetric) => {
    if (metric.unit === " FCFA") {
      return `${metric.value.toLocaleString()}${metric.unit}`;
    }
    return `${metric.value}${metric.unit}`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "content":
        return Type;
      case "design":
        return Palette;
      case "user":
        return Users;
      case "system":
        return Settings;
      default:
        return Activity;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "info":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "error":
        return AlertCircle;
      case "info":
        return Bell;
      default:
        return Bell;
    }
  };

  return (
    <ModernAdminTheme>
      <div className="min-h-screen">
        {/* Header moderne et élégant */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="admin-glass sticky top-0 z-40 shadow-lg"
        >
          <div className="px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Section gauche - Logo et titre */}
              <div className="flex items-center space-x-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
                >
                  <motion.div
                    animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {sidebarCollapsed ? (
                      <Menu
                        size={24}
                        className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600"
                      />
                    ) : (
                      <X
                        size={24}
                        className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600"
                      />
                    )}
                  </motion.div>
                </motion.button>

                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/25"
                  >
                    <Sparkles className="text-white" size={28} />
                  </motion.div>

                  <div>
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      Mind Dashboard
                    </motion.h1>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 bg-green-500 rounded-full"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Mind Graphix Solutions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section droite - Contrôles */}
              <div className="flex items-center space-x-4">
                {/* Barre de recherche avec bouton Administration */}
                <div className="flex items-center space-x-3">
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="hidden md:block"
                  >
                    <div className="relative">
                      <Search
                        size={20}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Rechercher ou appuyer sur ⌘K"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsCommandPaletteOpen(true)}
                        className="w-64 pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-200 dark:bg-gray-600 rounded">
                          ⌘K
                        </kbd>
                      </div>
                    </div>
                  </motion.div>

                  {/* Bouton Administration à côté de la recherche */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={forceSave}
                    className="admin-button-secondary inline-flex items-center space-x-2 px-4 py-2.5"
                  >
                    <Save size={16} />
                    <span className="hidden sm:inline font-medium text-sm">
                      Administration
                    </span>
                  </motion.button>
                </div>

                {/* Sélecteur de mode de prévisualisation */}
                <div className="hidden lg:flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-2xl p-1.5 shadow-inner">
                  {[
                    { mode: "desktop", icon: Monitor, size: 18 },
                    { mode: "tablet", icon: Monitor, size: 16 },
                    { mode: "mobile", icon: Smartphone, size: 16 },
                  ].map(({ mode, icon: Icon, size }) => (
                    <motion.button
                      key={mode}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPreviewMode(mode as any)}
                      className={`p-3 rounded-xl transition-all duration-200 ${
                        previewMode === mode
                          ? "bg-white dark:bg-gray-600 shadow-md text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white/50 dark:hover:bg-gray-600/50"
                      }`}
                      title={`Vue ${mode}`}
                    >
                      <Icon size={size} />
                    </motion.button>
                  ))}
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center space-x-3">
                  {/* Bouton voir le site - version compacte */}
                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-sm text-sm"
                    title="Voir le site"
                  >
                    <Eye size={14} />
                    <span className="hidden md:inline text-xs font-medium">
                      Site
                    </span>
                  </motion.a>

                  {/* Bouton retour au site - version compacte */}
                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="/"
                    className="inline-flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm text-sm"
                    title="Retourner au site principal"
                  >
                    <Home size={14} />
                    <span className="hidden md:inline text-xs font-medium">
                      Retour
                    </span>
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Layout principal */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Sidebar moderne avec animations */}
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`${
              sidebarCollapsed ? "w-20" : "w-80"
            } admin-glass transition-all duration-300 flex-shrink-0 admin-glow`}
          >
            <div className="flex flex-col h-full">
              {/* Profil utilisateur */}
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 border-b border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${userRole.color} flex items-center justify-center shadow-lg`}
                      >
                        <span className="text-white font-bold text-xl">
                          {currentUser?.name?.charAt(0) || "A"}
                        </span>
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-lg font-semibold text-gray-900 dark:text-white truncate"
                        >
                          {currentUser?.name || "Administrateur"}
                        </motion.p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {currentUser?.email || "admin@mindgraphix.com"}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 bg-green-500 rounded-full"
                          />
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            En ligne
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description du rôle */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                    >
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {userRole.description}
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation principale */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full group relative flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-200 ${
                      activeTab === item.id
                        ? `${item.bgColor} dark:bg-gray-700 shadow-lg ${item.textColor} dark:text-white`
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                    } ${sidebarCollapsed ? "justify-center" : ""}`}
                    title={sidebarCollapsed ? item.label : item.description}
                  >
                    <motion.div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        activeTab === item.id
                          ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                          : "group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                      }`}
                      whileHover={{ rotate: activeTab === item.id ? 0 : 5 }}
                    >
                      <item.icon size={18} />
                    </motion.div>

                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex-1 text-left"
                        >
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs opacity-70">
                            {item.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {activeTab === item.id && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-2 w-2 h-2 bg-current rounded-full"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                  </motion.button>
                ))}
              </nav>

              {/* Actions rapides en bas */}
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-2"
                  >
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href="/"
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 font-medium"
                      title="Retourner au site principal"
                    >
                      <Home size={16} />
                      <span>Retour au Site</span>
                    </motion.a>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200"
                    >
                      {isRealTimeEnabled ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                      <span>
                        {isRealTimeEnabled
                          ? "Pause temps réel"
                          : "Activer temps réel"}
                      </span>
                      <motion.div
                        animate={{
                          opacity: isRealTimeEnabled ? [1, 0.5, 1] : 1,
                        }}
                        transition={{
                          duration: 1,
                          repeat: isRealTimeEnabled ? Infinity : 0,
                        }}
                        className={`ml-auto w-2 h-2 rounded-full ${
                          isRealTimeEnabled ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200"
                    >
                      <Coffee size={16} />
                      <span>Mode focus</span>
                    </motion.button>

                    {/* Toggle mode sombre */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200"
                      title="Basculer le mode sombre"
                    >
                      {isDarkMode ? (
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          ☀️
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          🌙
                        </motion.div>
                      )}
                      <span>{isDarkMode ? "Mode clair" : "Mode sombre"}</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bouton de thème pour sidebar réduite */}
              {sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 border-t border-gray-200/50 dark:border-gray-700/50"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center"
                    title={isDarkMode ? "Mode clair" : "Mode sombre"}
                  >
                    {isDarkMode ? (
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        ☀️
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        🌙
                      </motion.div>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.aside>

          {/* Zone de contenu principal */}
          <main className="flex-1 flex">
            {/* Panneau de contenu */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-96 admin-glass overflow-y-auto"
            >
              <div className="p-6">
                {/* Vue d'ensemble */}
                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* En-tête avec date */}
                    <div className="flex items-center justify-between">
                      <div>
                        <motion.h2
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-3xl font-bold text-gray-900 dark:text-white"
                        >
                          Vue d'ensemble
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-gray-500 dark:text-gray-400 mt-1"
                        >
                          {new Date().toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </motion.p>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center space-x-2"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-3 h-3 bg-green-500 rounded-full"
                        />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Système opérationnel
                        </span>
                      </motion.div>
                    </div>

                    {/* Carte de statut principale */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${userRole.color} p-8 shadow-2xl`}
                    >
                      <div className="absolute inset-0 bg-black/5"></div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 25,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"
                      />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <motion.h3
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="text-2xl font-bold text-white mb-2"
                            >
                              {userRole.badge} {userRole.label}
                            </motion.h3>
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              className="text-white/90 text-lg"
                            >
                              {userRole.description}
                            </motion.p>
                          </div>

                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                          >
                            <Award size={32} className="text-white" />
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="flex items-center space-x-6 text-white/80"
                        >
                          <div className="flex items-center space-x-2">
                            <Shield size={16} />
                            <span className="text-sm">Sécurisé</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Zap size={16} />
                            <span className="text-sm">Performant</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp size={16} />
                            <span className="text-sm">Optimisé</span>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Métriques de performance */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                          <Zap size={24} className="mr-3 text-yellow-500" />
                          Métriques en temps réel
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setIsRealTimeEnabled(!isRealTimeEnabled)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            isRealTimeEnabled
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {isRealTimeEnabled ? "En direct" : "Mis en pause"}
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {performanceMetrics.map((metric, index) => {
                          const Icon = metric.icon;
                          return (
                            <motion.div
                              key={metric.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                              whileHover={{ scale: 1.05, y: -5 }}
                              className={`p-4 rounded-2xl ${metric.bgColor} dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 transition-all duration-200 cursor-pointer group`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <motion.div
                                  whileHover={{ rotate: 15 }}
                                  className={`w-10 h-10 rounded-xl ${metric.bgColor} flex items-center justify-center`}
                                >
                                  <Icon size={20} className={metric.color} />
                                </motion.div>

                                <motion.div
                                  className={`flex items-center space-x-1 text-xs ${
                                    metric.trend === "up"
                                      ? "text-green-600"
                                      : metric.trend === "down"
                                        ? "text-red-600"
                                        : "text-gray-500"
                                  }`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.8 + index * 0.1 }}
                                >
                                  {metric.trend === "up" && (
                                    <TrendingUp size={12} />
                                  )}
                                  {metric.trend === "down" && (
                                    <TrendingDown size={12} />
                                  )}
                                  {metric.trend === "stable" && <span>→</span>}
                                  <span>{metric.change}%</span>
                                </motion.div>
                              </div>

                              <motion.div
                                key={`${metric.id}-${metric.value}`}
                                initial={{ scale: 1.1, opacity: 0.8 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-1"
                              >
                                <div
                                  className={`text-2xl font-bold ${metric.color}`}
                                >
                                  {formatMetricValue(metric)}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                                  {metric.label}
                                </div>
                              </motion.div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Notifications système */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <Bell size={24} className="mr-3 text-orange-500" />
                        Notifications système
                      </h3>

                      <div className="space-y-3">
                        {systemNotifications.map((notification, index) => {
                          const Icon = getNotificationIcon(notification.type);
                          return (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.9 + index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              className={`p-4 rounded-2xl border ${getNotificationColor(notification.type)} transition-all duration-200`}
                            >
                              <div className="flex items-start space-x-3">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 1 + index * 0.1 }}
                                  className="flex-shrink-0"
                                >
                                  <Icon size={20} />
                                </motion.div>

                                <div className="flex-1 min-w-0">
                                  <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.1 + index * 0.1 }}
                                    className="font-medium text-sm"
                                  >
                                    {notification.title}
                                  </motion.p>
                                  <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2 + index * 0.1 }}
                                    className="text-xs opacity-80 mt-1"
                                  >
                                    {notification.message}
                                  </motion.p>
                                  <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.3 + index * 0.1 }}
                                    className="text-xs opacity-60 mt-2"
                                  >
                                    {notification.timestamp.toLocaleTimeString()}
                                  </motion.p>
                                </div>

                                {notification.action && (
                                  <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.4 + index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={notification.action.callback}
                                    className="px-3 py-1 bg-white/80 hover:bg-white text-xs font-medium rounded-lg transition-all duration-200"
                                  >
                                    {notification.action.label}
                                  </motion.button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Activités récentes */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <Activity size={24} className="mr-3 text-purple-500" />
                        Activité récente
                      </h3>

                      <div className="space-y-3">
                        {recentActivities.map((activity, index) => {
                          const Icon = getActivityIcon(activity.type);
                          return (
                            <motion.div
                              key={activity.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.3 + index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                            >
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.4 + index * 0.1 }}
                                className={`w-10 h-10 rounded-xl ${getActivityColor(activity.status)} flex items-center justify-center`}
                              >
                                <Icon size={16} />
                              </motion.div>

                              <div className="flex-1 min-w-0">
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 1.5 + index * 0.1 }}
                                  className="font-medium text-sm text-gray-900 dark:text-white"
                                >
                                  {activity.title}
                                </motion.p>
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 1.6 + index * 0.1 }}
                                  className="text-xs text-gray-500 dark:text-gray-400"
                                >
                                  {activity.description} • par {activity.user}
                                </motion.p>
                              </div>

                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.7 + index * 0.1 }}
                                className="text-xs text-gray-400"
                              >
                                {activity.timestamp.toLocaleTimeString()}
                              </motion.div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Actions rapides */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <Sparkles size={24} className="mr-3 text-pink-500" />
                        Actions rapides
                      </h3>

                      <div className="space-y-4">
                        {[
                          {
                            id: "content",
                            title: "Modifier le contenu",
                            description: "Textes et contenus du site web",
                            icon: Type,
                            color: "purple",
                            action: () => setActiveTab("content"),
                          },
                          {
                            id: "parameters",
                            title: "Configurer les paramètres",
                            description: "Configuration complète du système",
                            icon: Settings,
                            color: "gray",
                            action: () => setActiveTab("parameters"),
                          },
                          {
                            id: "design",
                            title: "Personnaliser le design",
                            description: "Couleurs et thème visuel",
                            icon: Palette,
                            color: "pink",
                            action: () => setActiveTab("design"),
                            hidden:
                              isMindAdmin ||
                              currentUser?.email === "admin@mindgraphix.com" ||
                              currentUser?.role === "mind",
                          },
                          {
                            id: "messages",
                            title: "Voir les messages",
                            description: "Communications et support client",
                            icon: MessageSquare,
                            color: "green",
                            action: () => setActiveTab("messages"),
                          },
                          {
                            id: "analytics",
                            title: "Consulter les analytics",
                            description: "Statistiques et analyses détaillées",
                            icon: BarChart3,
                            color: "blue",
                            action: () => setActiveTab("analytics"),
                          },
                        ].map((item, index) => {
                          if (item.hidden) return null;

                          return (
                            <motion.button
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.6 + index * 0.1 }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={item.action}
                              className={`w-full flex items-center space-x-4 p-5 bg-gradient-to-r from-${item.color}-50 to-${item.color}-100 dark:from-${item.color}-900/20 dark:to-${item.color}-800/20 hover:from-${item.color}-100 hover:to-${item.color}-200 dark:hover:from-${item.color}-800/30 dark:hover:to-${item.color}-700/30 text-${item.color}-700 dark:text-${item.color}-300 rounded-2xl transition-all duration-200 border border-${item.color}-200 dark:border-${item.color}-700 hover:shadow-lg group`}
                            >
                              <motion.div
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                className={`w-12 h-12 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-xl flex items-center justify-center shadow-lg`}
                              >
                                <item.icon size={20} className="text-white" />
                              </motion.div>

                              <div className="text-left flex-1">
                                <div className="font-semibold text-lg group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                  {item.title}
                                </div>
                                <div className="text-sm opacity-75 group-hover:opacity-90 transition-opacity">
                                  {item.description}
                                </div>
                              </div>

                              <motion.div
                                whileHover={{ x: 5 }}
                                className={`w-8 h-8 bg-${item.color}-200 dark:bg-${item.color}-800 rounded-lg flex items-center justify-center group-hover:bg-${item.color}-300 dark:group-hover:bg-${item.color}-700 transition-colors`}
                              >
                                <ChevronDown
                                  size={16}
                                  className={`text-${item.color}-600 dark:text-${item.color}-300 rotate-[-90deg]`}
                                />
                              </motion.div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Analytics Section */}
                {activeTab === "analytics" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          Analytics Avancés
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          Analyses détaillées et statistiques en temps réel
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                      >
                        Exporter les données
                      </motion.button>
                    </div>

                    <SafeAdminWrapper>
                      <RealTimeStats />
                    </SafeAdminWrapper>

                    {/* Graphiques supplémentaires */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <PieChart size={20} className="mr-2 text-blue-500" />
                          Répartition du trafic
                        </h3>
                        <div className="space-y-3">
                          {[
                            {
                              source: "Recherche organique",
                              percentage: 45,
                              color: "bg-blue-500",
                            },
                            {
                              source: "Réseaux sociaux",
                              percentage: 30,
                              color: "bg-green-500",
                            },
                            {
                              source: "Trafic direct",
                              percentage: 15,
                              color: "bg-purple-500",
                            },
                            {
                              source: "Référents",
                              percentage: 10,
                              color: "bg-orange-500",
                            },
                          ].map((item, index) => (
                            <motion.div
                              key={item.source}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-3 h-3 rounded-full ${item.color}`}
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {item.source}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {item.percentage}%
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <LineChart
                            size={20}
                            className="mr-2 text-purple-500"
                          />
                          Évolution mensuelle
                        </h3>
                        <div className="space-y-4">
                          {["Visiteurs", "Pages vues", "Conversions"].map(
                            (metric, index) => (
                              <motion.div
                                key={metric}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="space-y-2"
                              >
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {metric}
                                  </span>
                                  <span className="text-green-600 font-semibold">
                                    +{Math.floor(Math.random() * 20) + 5}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${Math.floor(Math.random() * 40) + 50}%`,
                                    }}
                                    transition={{
                                      delay: 0.5 + index * 0.2,
                                      duration: 1,
                                    }}
                                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                                  />
                                </div>
                              </motion.div>
                            ),
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Parameters Section */}
                {activeTab === "parameters" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <AdminParametersView />
                  </motion.div>
                )}

                {/* Content Management Section */}
                {activeTab === "content" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          {isMindAdmin ||
                          currentUser?.email === "admin@mindgraphix.com" ||
                          currentUser?.role === "mind"
                            ? "Modération du Contenu"
                            : "Gestion du Contenu"}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          Gérez le contenu textuel et multimédia de votre site
                          web
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center space-x-2"
                        >
                          <Save size={16} />
                          <span>Sauvegarder tout</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                          <Eye size={16} />
                          <span>Prévisualiser</span>
                        </motion.button>
                      </div>
                    </div>

                    {(isMindAdmin ||
                      currentUser?.email === "admin@mindgraphix.com" ||
                      currentUser?.role === "mind") && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Shield size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-blue-800 dark:text-blue-200 text-lg mb-2">
                              Mode Modérateur Mind
                            </h3>
                            <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                              Vous disposez d'un accès privilégié pour modifier
                              le contenu textuel, gérer les utilisateurs et
                              traiter les demandes clients. Les paramètres
                              système restent prot��gés.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Sections de contenu */}
                    <div className="space-y-6">
                      {[
                        {
                          category: "Hero Section",
                          items: [
                            {
                              key: "hero.title",
                              label: "Titre Principal",
                              type: "text",
                              placeholder: "Votre titre principal",
                            },
                            {
                              key: "hero.subtitle",
                              label: "Sous-titre",
                              type: "textarea",
                              placeholder: "Description de votre service",
                            },
                            {
                              key: "hero.cta1",
                              label: "Bouton CTA 1",
                              type: "text",
                              defaultValue: "Voir nos réalisations",
                            },
                            {
                              key: "hero.cta2",
                              label: "Bouton CTA 2",
                              type: "text",
                              defaultValue: "Discutons de votre projet",
                            },
                          ],
                        },
                        {
                          category: "À Propos",
                          items: [
                            {
                              key: "about.title",
                              label: "Titre Section",
                              type: "text",
                            },
                            {
                              key: "about.subtitle",
                              label: "Sous-titre",
                              type: "text",
                            },
                            {
                              key: "about.mainTitle",
                              label: "Titre Principal",
                              type: "text",
                              defaultValue:
                                "Créativité & Technologie au Service de Votre Succès",
                            },
                            {
                              key: "about.description1",
                              label: "Description 1",
                              type: "textarea",
                            },
                            {
                              key: "about.description2",
                              label: "Description 2",
                              type: "textarea",
                            },
                          ],
                        },
                        {
                          category: "Services",
                          items: [
                            {
                              key: "services.title",
                              label: "Titre Section",
                              type: "text",
                            },
                            {
                              key: "services.subtitle",
                              label: "Sous-titre",
                              type: "text",
                            },
                            {
                              key: "services.description",
                              label: "Description",
                              type: "textarea",
                            },
                          ],
                        },
                        {
                          category: "Contact",
                          items: [
                            {
                              key: "contact.title",
                              label: "Titre Section",
                              type: "text",
                            },
                            {
                              key: "contact.subtitle",
                              label: "Sous-titre",
                              type: "text",
                            },
                            {
                              key: "company.phone",
                              label: "Téléphone",
                              type: "text",
                            },
                            {
                              key: "company.email",
                              label: "Email",
                              type: "email",
                            },
                            {
                              key: "company.address",
                              label: "Adresse",
                              type: "text",
                            },
                          ],
                        },
                      ].map((section, sectionIndex) => (
                        <motion.div
                          key={section.category}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: sectionIndex * 0.1 }}
                          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
                        >
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-sm">
                                {sectionIndex + 1}
                              </span>
                            </div>
                            {section.category}
                          </h3>
                          <div className="space-y-6">
                            {section.items.map((item, itemIndex) => (
                              <motion.div
                                key={item.key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + itemIndex * 0.05 }}
                                className="space-y-3"
                              >
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                  {item.label}
                                </label>
                                {item.type === "textarea" ? (
                                  <textarea
                                    value={getContent(
                                      item.key,
                                      item.defaultValue || "",
                                    )}
                                    onChange={(e) =>
                                      updateContent(item.key, e.target.value)
                                    }
                                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 resize-none shadow-sm"
                                    rows={4}
                                    placeholder={
                                      item.placeholder ||
                                      `Entrez ${item.label.toLowerCase()}...`
                                    }
                                  />
                                ) : (
                                  <input
                                    type={item.type}
                                    value={getContent(
                                      item.key,
                                      item.defaultValue || "",
                                    )}
                                    onChange={(e) =>
                                      updateContent(item.key, e.target.value)
                                    }
                                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 shadow-sm"
                                    placeholder={
                                      item.placeholder ||
                                      `Entrez ${item.label.toLowerCase()}...`
                                    }
                                  />
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Design Section */}
                {activeTab === "design" &&
                  !(
                    isMindAdmin ||
                    currentUser?.email === "admin@mindgraphix.com" ||
                    currentUser?.role === "mind"
                  ) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Personnalisation du Design
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Customisez l'apparence visuelle de votre site
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center space-x-2"
                        >
                          <RefreshCw size={16} />
                          <span>Appliquer les changements</span>
                        </motion.button>
                      </div>

                      {/* Changement de couleurs automatique */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 shadow-lg border border-purple-200 dark:border-purple-700"
                      >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-3 border-b border-purple-200 dark:border-purple-700 flex items-center">
                          <Sparkles
                            size={24}
                            className="mr-3 text-purple-500"
                          />
                          Changement Automatique de Couleurs
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Boutons de thèmes prédéfinis */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                              Thèmes Prédéfinis
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                {
                                  name: "Bleu Océan",
                                  primary: "#0EA5E9",
                                  secondary: "#3B82F6",
                                  accent: "#06B6D4",
                                },
                                {
                                  name: "Violet Cosmic",
                                  primary: "#8B5CF6",
                                  secondary: "#A855F7",
                                  accent: "#EC4899",
                                },
                                {
                                  name: "Vert Émeraude",
                                  primary: "#10B981",
                                  secondary: "#059669",
                                  accent: "#34D399",
                                },
                                {
                                  name: "Orange Sunset",
                                  primary: "#F97316",
                                  secondary: "#EA580C",
                                  accent: "#FB923C",
                                },
                                {
                                  name: "Rose Vibrant",
                                  primary: "#EC4899",
                                  secondary: "#DB2777",
                                  accent: "#F472B6",
                                },
                                {
                                  name: "Indigo Profond",
                                  primary: "#6366F1",
                                  secondary: "#4F46E5",
                                  accent: "#818CF8",
                                },
                              ].map((theme, index) => (
                                <motion.button
                                  key={theme.name}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    updateContent(
                                      "colors.primary",
                                      theme.primary,
                                    );
                                    updateContent(
                                      "colors.secondary",
                                      theme.secondary,
                                    );
                                    updateContent(
                                      "colors.accent",
                                      theme.accent,
                                    );
                                  }}
                                  className="relative p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 transition-all group"
                                >
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div
                                      className="w-4 h-4 rounded-full"
                                      style={{ backgroundColor: theme.primary }}
                                    />
                                    <div
                                      className="w-4 h-4 rounded-full"
                                      style={{
                                        backgroundColor: theme.secondary,
                                      }}
                                    />
                                    <div
                                      className="w-4 h-4 rounded-full"
                                      style={{ backgroundColor: theme.accent }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                    {theme.name}
                                  </span>
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Générateur aléatoire */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                              Générateur Aléatoire
                            </h4>
                            <div className="space-y-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  const randomHue1 = Math.floor(
                                    Math.random() * 360,
                                  );
                                  const randomHue2 = (randomHue1 + 30) % 360;
                                  const randomHue3 = (randomHue1 + 60) % 360;

                                  updateContent(
                                    "colors.primary",
                                    `hsl(${randomHue1}, 70%, 50%)`,
                                  );
                                  updateContent(
                                    "colors.secondary",
                                    `hsl(${randomHue2}, 70%, 50%)`,
                                  );
                                  updateContent(
                                    "colors.accent",
                                    `hsl(${randomHue3}, 70%, 50%)`,
                                  );
                                }}
                                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                <RefreshCw size={20} />
                                <span className="font-semibold">
                                  Couleurs Aléatoires
                                </span>
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  const palettes = [
                                    ["#FF6B6B", "#4ECDC4", "#45B7D1"],
                                    ["#96CEB4", "#FFEAA7", "#DDA0DD"],
                                    ["#74B9FF", "#A29BFE", "#FD79A8"],
                                    ["#00B894", "#E17055", "#FDCB6E"],
                                    ["#6C5CE7", "#A29BFE", "#FD79A8"],
                                  ];
                                  const randomPalette =
                                    palettes[
                                      Math.floor(
                                        Math.random() * palettes.length,
                                      )
                                    ];

                                  updateContent(
                                    "colors.primary",
                                    randomPalette[0],
                                  );
                                  updateContent(
                                    "colors.secondary",
                                    randomPalette[1],
                                  );
                                  updateContent(
                                    "colors.accent",
                                    randomPalette[2],
                                  );
                                }}
                                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                <Palette size={20} />
                                <span className="font-semibold">
                                  Palette Harmonieuse
                                </span>
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  updateContent("colors.primary", "#5e35b1");
                                  updateContent("colors.secondary", "#3949ab");
                                  updateContent("colors.accent", "#ffab00");
                                  updateContent("colors.background", "#ffffff");
                                  updateContent("colors.text", "#1a1a1a");
                                  updateContent("colors.muted", "#6b7280");
                                }}
                                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                <RotateCcw size={20} />
                                <span className="font-semibold">
                                  Réinitialiser
                                </span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Palette de couleurs */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
                      >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
                          <Palette size={24} className="mr-3 text-pink-500" />
                          Couleurs du Thème
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            {
                              key: "colors.primary",
                              label: "Couleur Primaire",
                              defaultValue: "#5e35b1",
                            },
                            {
                              key: "colors.secondary",
                              label: "Couleur Secondaire",
                              defaultValue: "#3949ab",
                            },
                            {
                              key: "colors.accent",
                              label: "Couleur Accent",
                              defaultValue: "#ffab00",
                            },
                            {
                              key: "colors.background",
                              label: "Arrière-plan",
                              defaultValue: "#ffffff",
                            },
                            {
                              key: "colors.text",
                              label: "Texte Principal",
                              defaultValue: "#1a1a1a",
                            },
                            {
                              key: "colors.muted",
                              label: "Texte Secondaire",
                              defaultValue: "#6b7280",
                            },
                          ].map((setting, index) => (
                            <motion.div
                              key={setting.key}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="space-y-3"
                            >
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {setting.label}
                              </label>
                              <div className="flex items-center gap-4">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="relative"
                                >
                                  <input
                                    type="color"
                                    value={getContent(
                                      setting.key,
                                      setting.defaultValue,
                                    )}
                                    onChange={(e) =>
                                      updateContent(setting.key, e.target.value)
                                    }
                                    className="w-16 h-16 border-2 border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all"
                                  />
                                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center">
                                    <Palette
                                      size={12}
                                      className="text-gray-600 dark:text-gray-300"
                                    />
                                  </div>
                                </motion.div>
                                <input
                                  type="text"
                                  value={getContent(
                                    setting.key,
                                    setting.defaultValue,
                                  )}
                                  onChange={(e) =>
                                    updateContent(setting.key, e.target.value)
                                  }
                                  className="flex-1 px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 shadow-sm font-mono"
                                  placeholder="#000000"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Typographie */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
                      >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
                          <Type size={24} className="mr-3 text-blue-500" />
                          Typographie
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            {
                              key: "typography.headingFont",
                              label: "Police des titres",
                              options: [
                                "Inter",
                                "Poppins",
                                "Roboto",
                                "Open Sans",
                              ],
                            },
                            {
                              key: "typography.bodyFont",
                              label: "Police du texte",
                              options: [
                                "Inter",
                                "Poppins",
                                "Roboto",
                                "Open Sans",
                              ],
                            },
                            {
                              key: "typography.headingSize",
                              label: "Taille des titres",
                              type: "range",
                              min: "24",
                              max: "72",
                              defaultValue: "48",
                            },
                            {
                              key: "typography.bodySize",
                              label: "Taille du texte",
                              type: "range",
                              min: "14",
                              max: "24",
                              defaultValue: "16",
                            },
                          ].map((setting, index) => (
                            <motion.div
                              key={setting.key}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className="space-y-3"
                            >
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {setting.label}
                              </label>
                              {setting.options ? (
                                <select
                                  value={getContent(
                                    setting.key,
                                    setting.options[0],
                                  )}
                                  onChange={(e) =>
                                    updateContent(setting.key, e.target.value)
                                  }
                                  className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 shadow-sm"
                                >
                                  {setting.options.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <div className="space-y-2">
                                  <input
                                    type="range"
                                    min={setting.min}
                                    max={setting.max}
                                    value={getContent(
                                      setting.key,
                                      setting.defaultValue,
                                    )}
                                    onChange={(e) =>
                                      updateContent(setting.key, e.target.value)
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>{setting.min}px</span>
                                    <span className="font-semibold">
                                      {getContent(
                                        setting.key,
                                        setting.defaultValue,
                                      )}
                                      px
                                    </span>
                                    <span>{setting.max}px</span>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                {/* Messages Section */}
                {activeTab === "messages" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          Messages & Communications
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          Centre de communication clients et notifications
                          système
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle size={16} />
                          <span>Tout marquer lu</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                          <Download size={16} />
                          <span>Exporter</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Statistiques des messages */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[
                        {
                          label: "Nouveaux messages",
                          value: 12,
                          icon: MessageSquare,
                          color: "blue",
                          trend: "+3",
                        },
                        {
                          label: "En attente",
                          value: 8,
                          icon: Clock,
                          color: "yellow",
                          trend: "-1",
                        },
                        {
                          label: "Traités aujourd'hui",
                          value: 24,
                          icon: CheckCircle,
                          color: "green",
                          trend: "+12",
                        },
                        {
                          label: "Taux de réponse",
                          value: "95%",
                          icon: TrendingUp,
                          color: "purple",
                          trend: "+2%",
                        },
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`bg-${stat.color}-50 dark:bg-${stat.color}-900/20 p-6 rounded-2xl border border-${stat.color}-200 dark:border-${stat.color}-800 hover:shadow-lg transition-all duration-200`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-12 h-12 bg-${stat.color}-500 rounded-xl flex items-center justify-center`}
                            >
                              <stat.icon size={20} className="text-white" />
                            </div>
                            <span
                              className={`text-${stat.color}-600 dark:text-${stat.color}-400 text-sm font-semibold`}
                            >
                              {stat.trend}
                            </span>
                          </div>
                          <div className="mt-4">
                            <div
                              className={`text-2xl font-bold text-${stat.color}-700 dark:text-${stat.color}-300`}
                            >
                              {stat.value}
                            </div>
                            <div
                              className={`text-${stat.color}-600 dark:text-${stat.color}-400 text-sm`}
                            >
                              {stat.label}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                      <SafeAdminWrapper>
                        <AdminNotifications />
                      </SafeAdminWrapper>
                    </div>
                  </motion.div>
                )}

                {/* Users Section */}
                {activeTab === "users" &&
                  (isSuperAdmin ||
                    isMindAdmin ||
                    currentUser?.email === "admin@mindgraphix.com" ||
                    currentUser?.role === "mind") && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Gestion des Utilisateurs
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Administrez les comptes et permissions
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                          <UserPlus size={16} />
                          <span>Ajouter utilisateur</span>
                        </motion.button>
                      </div>

                      {(isMindAdmin ||
                        currentUser?.email === "admin@mindgraphix.com" ||
                        currentUser?.role === "mind") && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <Users size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-yellow-800 dark:text-yellow-200 text-lg mb-2">
                                Gestion Utilisateurs Mind
                              </h3>
                              <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">
                                Console dédiée à la consultation et gestion des
                                utilisateurs système avec privilèges étendus
                                mais restrictions de sécurité.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Liste des utilisateurs */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                          <Activity size={24} className="mr-3 text-green-500" />
                          Administrateurs Connectés
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              name: "Philippe Sanon",
                              email: "philippefaizsanon@gmail.com",
                              role: "Administrateur Suprême",
                              status: "En ligne",
                              avatar: "PS",
                              color: "purple",
                              lastActive: "maintenant",
                            },
                            {
                              name: "Mind Graphix Solution",
                              email: "admin@mindgraphix.com",
                              role: "Administrateur Standard",
                              status: "Hors ligne",
                              avatar: "MG",
                              color: "blue",
                              lastActive: "il y a 2h",
                            },
                          ].map((user, index) => (
                            <motion.div
                              key={user.email}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                            >
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`w-14 h-14 bg-gradient-to-br from-${user.color}-500 to-${user.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}
                                >
                                  <span className="text-white font-bold text-lg">
                                    {user.avatar}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                    {user.name}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {user.role} • {user.email}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <div
                                      className={`w-2 h-2 ${user.status === "En ligne" ? "bg-green-500" : "bg-gray-400"} rounded-full ${user.status === "En ligne" ? "animate-pulse" : ""}`}
                                    ></div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      Dernière activité: {user.lastActive}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`px-4 py-2 ${user.status === "En ligne" ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"} text-sm font-semibold rounded-full`}
                                >
                                  {user.status}
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Admin depuis 2024
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                {/* Settings Section */}
                {activeTab === "settings" &&
                  isSuperAdmin &&
                  !(
                    isMindAdmin ||
                    currentUser?.email === "admin@mindgraphix.com" ||
                    currentUser?.role === "mind"
                  ) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Paramètres Avancés
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Configuration système et outils avancés
                          </p>
                        </div>
                      </div>

                      {/* Sauvegarde & Restauration */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
                      >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                          <Database size={24} className="mr-3 text-blue-500" />
                          Sauvegarde & Restauration
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={forceSave}
                            className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <Save size={20} />
                            <span className="font-semibold">
                              Sauvegarde Manuelle
                            </span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={exportContent}
                            className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <Download size={20} />
                            <span className="font-semibold">
                              Exporter le Contenu
                            </span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <Upload size={20} />
                            <span className="font-semibold">
                              Importer le Contenu
                            </span>
                          </motion.button>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".json"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              importContent(file);
                            }
                          }}
                          className="hidden"
                        />
                      </motion.div>

                      {/* Outils Suprêmes */}
                      {isSuperAdmin &&
                        currentUser?.email ===
                          "philippefaizsanon@gmail.com" && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
                          >
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                              <Shield
                                size={24}
                                className="mr-3 text-purple-500"
                              />
                              Outils Supreme (Philippe uniquement)
                            </h3>

                            <div className="space-y-6">
                              <SafeAdminWrapper>
                                <AdvancedAdminManager />
                              </SafeAdminWrapper>
                              <SafeAdminWrapper>
                                <PriceManager />
                              </SafeAdminWrapper>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SafeAdminWrapper>
                                  <ThemeManager />
                                </SafeAdminWrapper>
                                <SafeAdminWrapper>
                                  <QuoteManager />
                                </SafeAdminWrapper>
                              </div>
                              <SafeAdminWrapper>
                                <AdvancedStyleManager />
                              </SafeAdminWrapper>
                              <SafeAdminWrapper>
                                <CustomStylesEditor />
                              </SafeAdminWrapper>
                            </div>
                          </motion.div>
                        )}

                      {/* Actions système */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
                      >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                          <Settings size={24} className="mr-3 text-gray-500" />
                          Actions du Site
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.location.reload()}
                            className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <RefreshCw size={20} />
                            <span className="font-semibold">
                              Recharger la Page
                            </span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (
                                confirm(
                                  "Voulez-vous vraiment réinitialiser tous les contenus ?",
                                )
                              ) {
                                localStorage.removeItem("siteContent");
                                window.location.reload();
                              }
                            }}
                            className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <RefreshCw size={20} />
                            <span className="font-semibold">
                              Réinitialiser le Contenu
                            </span>
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
              </div>
            </motion.div>

            {/* Zone de prévisualisation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 relative"
            >
              <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="h-full">
                  <LivePreview url="/" />
                </div>
              </div>
            </motion.div>
          </main>
        </div>

        {/* Palette de commandes */}
        <AnimatePresence>
          {isCommandPaletteOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-start justify-center pt-20"
              onClick={() => setIsCommandPaletteOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Command
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Tapez une commande..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {filteredCommands.map((command, index) => (
                    <motion.button
                      key={command.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                      }}
                      onClick={() => {
                        command.action();
                        setIsCommandPaletteOpen(false);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Keyboard size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {command.label}
                      </span>
                    </motion.button>
                  ))}

                  {filteredCommands.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      Aucune commande trouvée
                    </div>
                  )}

                  {/* System Section */}
                  {activeTab === "system" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <SystemDashboard />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* IA Suprême - Exclusif Super Administrateurs */}
  <div className="px-6 lg:px-8">
    <AIQuestionnaire />
  </div>
  <SupremeAIAssistant />
</ModernAdminTheme>
  );
}
