import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  ChevronDown,
  User,
  Palette,
  FileText,
  Database,
  BarChart3,
  Shield,
  DollarSign,
  Layout,
  Code,
  Activity,
  Network,
  Zap,
  Users,
  Bell,
  Layers,
  Eye,
  TrendingUp,
  Search,
  X,
  Monitor,
  Edit,
  Star,
  AlertCircle,
  Save,
  Download,
  HelpCircle,
  Home,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

// Import des composants que nous voulons utiliser
import { AdminManager } from "./AdminManager";
import { PriceManager } from "./PriceManager";
import { ThemeManager } from "./ThemeManager";
import { CustomStylesEditor } from "./CustomStylesEditor";
import { AdminFunctionalityTester } from "./AdminFunctionalityTester";
import { AdminCompleteGuide } from "./AdminCompleteGuide";

interface SettingsItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  component?: React.ComponentType<any>;
  action?: () => void;
  requiredRole?: "admin" | "supreme" | "mind" | "all";
  requiredEmail?: string;
}

export const ConsolidatedSettingsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Destructuration du hook useAuth en premier pour éviter les erreurs de référence
  const {
    isSuperAdmin,
    isMindAdmin,
    currentUser,
    isAdmin,
    isLoggedIn,
    forceSave,
    exportContent,
    updateContent,
    getContent,
  } = useAuth();

  // Vérifier si c'est la première utilisation
  React.useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("adminCenterWelcome");
    if (!hasSeenWelcome && isLoggedIn) {
      setShowWelcome(true);
      localStorage.setItem("adminCenterWelcome", "true");
    }
  }, [isLoggedIn]);

  // Écouter les événements globaux pour ouvrir le panel - optimisé
  React.useEffect(() => {
    // Ne pas attacher les listeners si l'utilisateur n'est pas connecté
    if (!isLoggedIn) return;

    const handleOpenSettings = () => {
      setIsOpen(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape pour fermer
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setActiveComponent(null);
      }
      // Ctrl/Cmd + Shift + A pour ouvrir
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "a"
      ) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("openAdminSettings", handleOpenSettings);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("openAdminSettings", handleOpenSettings);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isAdmin]);

  // Configuration des outils disponibles
  const settingsItems: SettingsItem[] = [
    // Gestion de contenu
    {
      id: "content-edit",
      label: "Éditeur de Contenu",
      description: "Modifier le contenu textuel du site",
      icon: Edit,
      color: "blue",
      action: () => {
        navigate("/admin");
        setTimeout(() => {
          const element = document.getElementById("content");
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      requiredRole: "all",
    },
    {
      id: "admin-dashboard",
      label: "Dashboard Administrateur",
      description: "Interface complète d'administration",
      icon: Monitor,
      color: "purple",
      action: () => {
        navigate("/admin");
      },
      requiredRole: "all",
    },
    {
      id: "design-customization",
      label: "Personnalisation Design",
      description: "Modifier couleurs et apparence",
      icon: Palette,
      color: "pink",
      action: () => {
        navigate("/admin");
        setTimeout(() => {
          const element = document.getElementById("design");
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      requiredRole: "admin",
    },
    {
      id: "theme-manager",
      label: "Gestionnaire de Thème",
      description: "Thèmes prédéfinis et couleurs avancées",
      icon: Palette,
      color: "pink",
      component: ThemeManager,
      requiredRole: "supreme",
      requiredEmail:
        "philippefaizsanon@gmail.com,mindgraphixsolution@gmail.com",
    },
    {
      id: "custom-css",
      label: "Éditeur CSS Personnalisé",
      description: "Styles CSS avancés et personnalisés",
      icon: Code,
      color: "purple",
      component: CustomStylesEditor,
      requiredRole: "supreme",
      requiredEmail:
        "philippefaizsanon@gmail.com,mindgraphixsolution@gmail.com",
    },
    {
      id: "price-manager",
      label: "Gestionnaire de Prix",
      description: "Configurer les tarifs et services",
      icon: DollarSign,
      color: "green",
      component: PriceManager,
      requiredRole: "supreme",
      requiredEmail:
        "philippefaizsanon@gmail.com,mindgraphixsolution@gmail.com",
    },
    {
      id: "admin-manager",
      label: "Gestionnaire d'Administrateurs",
      description: "Gérer les comptes administrateurs",
      icon: Shield,
      color: "red",
      component: AdminManager,
      requiredRole: "supreme",
      requiredEmail:
        "philippefaizsanon@gmail.com,mindgraphixsolution@gmail.com",
    },
    {
      id: "user-management",
      label: "Gestion Utilisateurs",
      description: "Administrer les comptes utilisateurs",
      icon: Users,
      color: "indigo",
      action: () => {
        navigate("/admin");
        // Scroller vers la section après navigation
        setTimeout(() => {
          const element = document.getElementById("users");
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      requiredRole: "supreme",
      requiredEmail:
        "philippefaizsanon@gmail.com,mindgraphixsolution@gmail.com",
    },
    {
      id: "analytics",
      label: "Analytics & Statistiques",
      description: "Consulter les performances du site",
      icon: BarChart3,
      color: "blue",
      action: () => {
        navigate("/admin");
        setTimeout(() => {
          const element = document.getElementById("analytics");
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      requiredRole: "admin",
    },
    {
      id: "messages",
      label: "Messages & Notifications",
      description: "Centre de communication",
      icon: Bell,
      color: "yellow",
      action: () => {
        navigate("/admin");
        setTimeout(() => {
          const element = document.getElementById("messages");
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      requiredRole: "all",
    },
    {
      id: "system-settings",
      label: "Paramètres Système",
      description: "Configuration avancée du système",
      icon: Settings,
      color: "gray",
      action: () => {
        navigate("/admin");
        setTimeout(() => {
          const element = document.getElementById("settings");
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      requiredRole: "supreme",
      requiredEmail:
        "philippefaizsanon@gmail.com,mindgraphixsolution@gmail.com",
    },
    {
      id: "backup-save",
      label: "Sauvegarde Rapide",
      description: "Sauvegarder instantanément le contenu",
      icon: Save,
      color: "emerald",
      action: () => {
        if (forceSave) {
          forceSave();
          alert("✅ Sauvegarde effectuée avec succès !");
        } else {
          localStorage.setItem(
            "quickBackup_" + Date.now(),
            JSON.stringify({
              content: localStorage.getItem("siteContent"),
              timestamp: new Date().toISOString(),
            }),
          );
          alert("✅ Sauvegarde rapide créée !");
        }
      },
      requiredRole: "admin",
    },
    {
      id: "export-content",
      label: "Exporter le Contenu",
      description: "Télécharger une sauvegarde complète",
      icon: Download,
      color: "cyan",
      action: () => {
        if (exportContent) {
          exportContent();
        } else {
          const content = localStorage.getItem("siteContent") || "{}";
          const blob = new Blob([content], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `backup_${new Date().toISOString().split("T")[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
      },
      requiredRole: "admin",
    },
    {
      id: "site-preview",
      label: "Prévisualiser le Site",
      description: "Voir le site en tant que visiteur",
      icon: Eye,
      color: "orange",
      action: () => {
        window.open("/", "_blank");
      },
      requiredRole: "all",
    },
    {
      id: "performance-check",
      label: "Vérification Performance",
      description: "Analyser les performances du site",
      icon: Zap,
      color: "yellow",
      action: () => {
        const start = performance.now();
        fetch("/api/ping")
          .then(() => {
            const end = performance.now();
            alert(
              `⚡ Temps de réponse serveur: ${Math.round(end - start)}ms\n\nStatut: ${Math.round(end - start) < 100 ? "Excellent" : Math.round(end - start) < 200 ? "Bon" : "À améliorer"}`,
            );
          })
          .catch(() => {
            alert("❌ Erreur de connexion au serveur");
          });
      },
      requiredRole: "admin",
    },
    {
      id: "functionality-tester",
      label: "Test des Fonctionnalités",
      description: "Diagnostic complet du système admin",
      icon: Zap,
      color: "cyan",
      component: AdminFunctionalityTester,
      requiredRole: "admin",
    },
    {
      id: "complete-guide",
      label: "Guide Complet Administrateur",
      description: "Documentation complète et détaillée",
      icon: Bell,
      color: "emerald",
      component: AdminCompleteGuide,
      requiredRole: "all",
    },
    {
      id: "ai-assistant",
      label: "Assistant IA",
      description: "Intelligence artificielle pour administrateurs",
      icon: Bell, // Utiliser Brain si disponible
      color: "purple",
      action: () => {
        // Déclencher l'ouverture du bot IA
        const event = new CustomEvent("openAIAssistant");
        window.dispatchEvent(event);
      },
      requiredRole: "admin",
    },
    {
      id: "supreme-ai",
      label: "IA Suprême",
      description:
        "Intelligence artificielle de niveau Elite - Super Admin uniquement",
      icon: Star,
      color: "yellow",
      action: () => {
        // Déclencher l'ouverture de l'IA Suprême
        const event = new CustomEvent("openSupremeAI");
        window.dispatchEvent(event);
      },
      requiredRole: "supreme",
      requiredEmail:
        "philippefaizsanon@gmail.com,mindgraphixsolution@gmail.com",
    },
    {
      id: "help-support",
      label: "Aide & Support",
      description: "Documentation et assistance",
      icon: HelpCircle,
      color: "rose",
      action: () => {
        alert(`🆘 Centre d'Aide Mind Graphix Solutions

📚 Ressources disponibles:
• Documentation complète en ligne
• Guides d'utilisation étape par étape
• Tutoriels vidéo

🔧 Support technique:
• Email: support@mindgraphix.com
• Chat en direct (icône en bas à gauche)
• Tickets de support prioritaires

⌨️ Raccourcis utiles:
• ⌘K ou Ctrl+K : Recherche rapide
• ⌘S ou Ctrl+S : Sauvegarde rapide
• Échap : Fermer les modales

💡 Astuce: Utilisez la barre de recherche pour trouver rapidement les outils !`);
      },
      requiredRole: "all",
    },
  ];

  // Filtrer les éléments selon les permissions
  const hasPermission = (item: SettingsItem): boolean => {
    if (!isAdmin) return false;

    if (item.requiredEmail && currentUser?.email) {
      const allowedEmails = item.requiredEmail
        .split(",")
        .map((email) => email.trim());
      if (!allowedEmails.includes(currentUser.email)) {
        return false;
      }
    }

    switch (item.requiredRole) {
      case "supreme":
        return (
          isSuperAdmin &&
          !isMindAdmin &&
          (currentUser?.email === "philippefaizsanon@gmail.com" ||
            currentUser?.email === "mindgraphixsolution@gmail.com")
        );
      case "mind":
        return (
          isMindAdmin ||
          currentUser?.email === "admin@mindgraphix.com" ||
          currentUser?.role === "mind"
        );
      case "admin":
        return isAdmin;
      case "all":
      default:
        return isAdmin;
    }
  };

  // Filtrer par recherche
  const filteredItems = settingsItems.filter(
    (item) =>
      hasPermission(item) &&
      (item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Grouper par catégorie
  const groupedItems = {
    "Navigation & Dashboards": filteredItems.filter((item) =>
      ["content-edit", "admin-dashboard", "design-customization"].includes(
        item.id,
      ),
    ),
    "Outils Avancés": filteredItems.filter((item) =>
      [
        "theme-manager",
        "custom-css",
        "price-manager",
        "admin-manager",
      ].includes(item.id),
    ),
    "Gestion & Administration": filteredItems.filter((item) =>
      ["user-management", "system-settings", "analytics", "messages"].includes(
        item.id,
      ),
    ),
    "Sauvegarde & Maintenance": filteredItems.filter((item) =>
      ["backup-save", "export-content", "performance-check"].includes(item.id),
    ),
    "Aide & Prévisualisation": filteredItems.filter((item) =>
      [
        "site-preview",
        "functionality-tester",
        "complete-guide",
        "help-support",
      ].includes(item.id),
    ),
  };

  // Gérer les actions
  const handleItemClick = (item: SettingsItem) => {
    if (item.component) {
      setActiveComponent(item.id);
    } else if (item.action) {
      item.action();
    }
    setIsOpen(false);
  };

  // Rendu du composant actif
  const renderActiveComponent = () => {
    if (!activeComponent) return null;

    const item = settingsItems.find((item) => item.id === activeComponent);

    if (!item || !hasPermission(item) || !item.component) return null;

    const Component = item.component;
    return (
      <Component isOpen={true} setIsOpen={() => setActiveComponent(null)} />
    );
  };

  if (!isLoggedIn || !isAdmin) return null;

  return (
    <>
      {/* Bouton principal */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-30 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group"
        title="Paramètres & Outils d'Administration"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Settings size={24} />
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Badge de rôle */}
        <div className="absolute -top-2 -left-2 px-2 py-1 bg-white text-indigo-600 text-xs font-bold rounded-full shadow-lg">
          {isSuperAdmin && !isMindAdmin ? "👑" : isMindAdmin ? "🛡️" : "🔧"}
        </div>
      </motion.button>

      {/* Panel principal */}
      <AnimatePresence>
        {isOpen && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-5xl max-h-[90vh] m-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Settings size={32} />
                    <div>
                      <h2 className="text-2xl font-bold">
                        Centre de Contrôle Admin
                      </h2>
                      <p className="text-indigo-100">
                        Tous vos outils d'administration en un seul endroit
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href="/"
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
                      title="Retourner au site principal"
                    >
                      <Home size={18} />
                      <span className="hidden sm:inline">Retour au Site</span>
                    </a>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Barre de recherche */}
                <div className="mt-4 relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-200"
                  />
                  <input
                    type="text"
                    placeholder="Rechercher un outil..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-200 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {searchQuery ? (
                  // Vue recherche
                  <div className="space-y-3">
                    {filteredItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleItemClick(item)}
                        className="w-full flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 text-left"
                      >
                        <div
                          className={`w-12 h-12 bg-${item.color}-500 rounded-xl flex items-center justify-center text-white shadow-lg`}
                        >
                          <item.icon size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {item.label}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                        <ChevronDown
                          size={20}
                          className="text-gray-400 rotate-[-90deg]"
                        />
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  // Vue par catégories
                  <div className="space-y-8">
                    {Object.entries(groupedItems).map(
                      ([category, items], categoryIndex) => {
                        if (items.length === 0) return null;

                        return (
                          <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: categoryIndex * 0.1 }}
                          >
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                              <Star
                                size={20}
                                className="mr-2 text-yellow-500"
                              />
                              {category}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {items.map((item, itemIndex) => (
                                <motion.button
                                  key={item.id}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    delay:
                                      categoryIndex * 0.1 + itemIndex * 0.05,
                                  }}
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleItemClick(item)}
                                  className={`p-6 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 dark:from-${item.color}-900/20 dark:to-${item.color}-800/20 hover:from-${item.color}-100 hover:to-${item.color}-200 dark:hover:from-${item.color}-800/30 dark:hover:to-${item.color}-700/30 rounded-xl transition-all duration-200 text-left group border border-${item.color}-200 dark:border-${item.color}-700 hover:shadow-lg`}
                                >
                                  <div className="flex items-start space-x-4">
                                    <div
                                      className={`w-12 h-12 bg-${item.color}-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                                    >
                                      <item.icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                      <h4
                                        className={`font-semibold text-${item.color}-900 dark:text-${item.color}-100 mb-2 group-hover:text-${item.color}-700 dark:group-hover:text-${item.color}-200 transition-colors`}
                                      >
                                        {item.label}
                                      </h4>
                                      <p
                                        className={`text-sm text-${item.color}-700 dark:text-${item.color}-300 group-hover:text-${item.color}-600 dark:group-hover:text-${item.color}-200 transition-colors`}
                                      >
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        );
                      },
                    )}
                  </div>
                )}

                {filteredItems.length === 0 && searchQuery && (
                  <div className="text-center py-12">
                    <Search size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Aucun résultat trouvé
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Essayez avec d'autres mots-clés
                    </p>
                  </div>
                )}
              </div>

              {/* Footer avec raccourcis */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>Raccourcis:</span>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                        ⌘K
                      </kbd>
                      <span>Recherche</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                        Échap
                      </kbd>
                      <span>Fermer</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Connecté en tant que:</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {currentUser?.name || "Administrateur"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification de bienvenue */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-24 left-6 z-30 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  🎉 Nouveau Centre de Contrôle !
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Tous vos outils d'administration sont maintenant regroupés
                  dans un seul endroit. Cliquez sur le bouton paramètres pour
                  commencer !
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Raccourci:{" "}
                    <kbd className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                      ⌘⇧A
                    </kbd>
                  </div>
                  <button
                    onClick={() => setShowWelcome(false)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
                  >
                    Compris !
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rendu du composant actif */}
      {activeComponent && renderActiveComponent()}
    </>
  );
};
