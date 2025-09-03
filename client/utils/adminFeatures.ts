/**
 * Centralisation de toutes les fonctionnalités administratives
 * Mind Graphix Solutions - Dashboard Admin
 */

export const ADMIN_FEATURES = {
  // Navigation & Dashboards
  NAVIGATION: {
    DASHBOARD: {
      id: "admin-dashboard",
      name: "Dashboard Administrateur",
      description: "Interface complète d'administration",
      url: "/admin",
      requiredRole: "all",
    },
    CONTENT_EDITOR: {
      id: "content-editor",
      name: "Éditeur de Contenu",
      description: "Modifier le contenu textuel du site",
      url: "/admin#content",
      requiredRole: "all",
    },
    DESIGN_EDITOR: {
      id: "design-editor",
      name: "Éditeur de Design",
      description: "Personnaliser l'apparence du site",
      url: "/admin#design",
      requiredRole: "admin",
    },
    ANALYTICS: {
      id: "analytics",
      name: "Analytics & Statistiques",
      description: "Consulter les performances du site",
      url: "/admin#analytics",
      requiredRole: "admin",
    },
    MESSAGES: {
      id: "messages",
      name: "Messages & Communications",
      description: "Centre de communication clients",
      url: "/admin#messages",
      requiredRole: "all",
    },
    USERS: {
      id: "users",
      name: "Gestion Utilisateurs",
      description: "Administrer les comptes utilisateurs",
      url: "/admin#users",
      requiredRole: "supreme",
    },
    SETTINGS: {
      id: "settings",
      name: "Paramètres Système",
      description: "Configuration avancée du système",
      url: "/admin#settings",
      requiredRole: "supreme",
    },
  },

  // Outils Avancés (Modales)
  ADVANCED_TOOLS: {
    THEME_MANAGER: {
      id: "theme-manager",
      name: "Gestionnaire de Thème",
      description: "Thèmes prédéfinis et couleurs avancées",
      component: "ThemeManager",
      requiredRole: "supreme",
    },
    CUSTOM_CSS: {
      id: "custom-css",
      name: "Éditeur CSS Personnalisé",
      description: "Styles CSS avancés et personnalisés",
      component: "CustomStylesEditor",
      requiredRole: "supreme",
    },
    PRICE_MANAGER: {
      id: "price-manager",
      name: "Gestionnaire de Prix",
      description: "Configurer les tarifs et services",
      component: "PriceManager",
      requiredRole: "supreme",
    },
    ADMIN_MANAGER: {
      id: "admin-manager",
      name: "Gestionnaire d'Administrateurs",
      description: "Gérer les comptes administrateurs",
      component: "AdminManager",
      requiredRole: "supreme",
    },
    QUOTE_MANAGER: {
      id: "quote-manager",
      name: "Gestionnaire de Devis",
      description: "Gérer les demandes de devis et commandes",
      component: "QuoteManager",
      requiredRole: "supreme",
    },
    ADVANCED_ADMIN: {
      id: "advanced-admin",
      name: "Administration Avancée",
      description: "Outils d'administration système",
      component: "AdvancedAdminManager",
      requiredRole: "supreme",
    },
  },

  // Actions Rapides
  QUICK_ACTIONS: {
    BACKUP_SAVE: {
      id: "backup-save",
      name: "Sauvegarde Rapide",
      description: "Sauvegarder instantanément le contenu",
      action: "saveContent",
      requiredRole: "admin",
    },
    EXPORT_CONTENT: {
      id: "export-content",
      name: "Exporter le Contenu",
      description: "Télécharger une sauvegarde complète",
      action: "exportContent",
      requiredRole: "admin",
    },
    IMPORT_CONTENT: {
      id: "import-content",
      name: "Importer le Contenu",
      description: "Restaurer depuis une sauvegarde",
      action: "importContent",
      requiredRole: "supreme",
    },
    SITE_PREVIEW: {
      id: "site-preview",
      name: "Prévisualiser le Site",
      description: "Voir le site en tant que visiteur",
      action: "openSitePreview",
      requiredRole: "all",
    },
    PERFORMANCE_CHECK: {
      id: "performance-check",
      name: "Vérification Performance",
      description: "Analyser les performances du site",
      action: "checkPerformance",
      requiredRole: "admin",
    },
    RELOAD_PAGE: {
      id: "reload-page",
      name: "Recharger la Page",
      description: "Actualiser la page courante",
      action: "reloadPage",
      requiredRole: "all",
    },
  },

  // Outils de Support
  SUPPORT_TOOLS: {
    HELP_SUPPORT: {
      id: "help-support",
      name: "Aide & Support",
      description: "Documentation et assistance",
      action: "showHelp",
      requiredRole: "all",
    },
    SYSTEM_INFO: {
      id: "system-info",
      name: "Informations Système",
      description: "État du système et diagnostics",
      action: "showSystemInfo",
      requiredRole: "admin",
    },
    CONTACT_SUPPORT: {
      id: "contact-support",
      name: "Contacter le Support",
      description: "Assistance technique directe",
      action: "contactSupport",
      requiredRole: "all",
    },
  },
} as const;

// Types pour la validation
export type AdminFeatureId = string;
export type RequiredRole = "all" | "admin" | "supreme" | "mind";

// Utilitaires
export const getAllFeatures = () => {
  return Object.values(ADMIN_FEATURES).flatMap((category) =>
    Object.values(category),
  );
};

export const getFeaturesByRole = (
  userRole: RequiredRole,
  userEmail?: string,
) => {
  return getAllFeatures().filter((feature) => {
    // Vérification du rôle simplifié (plus de vérification d'email)
    if (feature.requiredRole === "all") return true;
    if (
      feature.requiredRole === "admin" &&
      ["admin", "supreme"].includes(userRole)
    )
      return true;
    if (feature.requiredRole === "supreme" && userRole === "supreme") {
      return true;
    }
    if (feature.requiredRole === "mind" && userRole === "mind") return true;

    return false;
  });
};

export const getFeatureById = (id: string) => {
  return getAllFeatures().find((feature) => feature.id === id);
};

// Messages et constantes
export const ADMIN_MESSAGES = {
  WELCOME: {
    title: "🎉 Système Admin Opérationnel !",
    subtitle: "Toutes les fonctionnalités sont maintenant disponibles",
    features: [
      "Centre de contrôle unifié",
      "Dashboard moderne activé",
      "Tous les outils disponibles",
    ],
  },
  SHORTCUTS: {
    OPEN_SETTINGS: "⌘⇧A",
    SEARCH: "⌘K",
    CLOSE: "Échap",
    SAVE: "⌘S",
  },
  HELP: {
    title: "🆘 Centre d'Aide Mind Graphix Solutions",
    content: `📚 Ressources disponibles:
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

💡 Astuce: Utilisez la barre de recherche pour trouver rapidement les outils !`,
  },
} as const;

// Configuration des couleurs par catégorie
export const FEATURE_COLORS = {
  navigation: "blue",
  advanced: "purple",
  management: "green",
  tools: "orange",
  support: "gray",
  backup: "emerald",
  design: "pink",
  content: "indigo",
  system: "red",
} as const;

export default ADMIN_FEATURES;
