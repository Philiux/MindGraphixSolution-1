import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  ChevronRight,
  ChevronDown,
  Star,
  Settings,
  Shield,
  Eye,
  Palette,
  Users,
  BarChart3,
  MessageSquare,
  Save,
  Download,
  Zap,
  HelpCircle,
  Play,
  Monitor,
  Code,
  DollarSign,
  Globe,
  Bell,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Keyboard,
  Mouse,
  Navigation,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface GuideSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
  subsections: GuideSubsection[];
  requiredRole?: "admin" | "supreme" | "mind" | "all";
}

interface GuideSubsection {
  id: string;
  title: string;
  content: string;
  tips?: string[];
  shortcuts?: { key: string; description: string }[];
  steps?: string[];
}

export const AdminCompleteGuide: React.FC<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAdmin, isSuperAdmin, isMindAdmin, currentUser } = useAuth();

  const guideSections: GuideSection[] = [
    {
      id: "getting-started",
      title: "Prise en Main Rapide",
      icon: Play,
      color: "blue",
      description:
        "Les bases pour commencer à utiliser le système d'administration",
      subsections: [
        {
          id: "first-steps",
          title: "Premiers Pas",
          content:
            "Bienvenue dans le système d'administration Mind Graphix Solutions ! Cette interface vous permet de gérer entièrement votre site web sans avoir besoin de connaissances techniques.",
          steps: [
            "Localisez le bouton paramètres (⚙️) en bas à droite de votre écran",
            "Cliquez dessus pour ouvrir le Centre de Contrôle Admin",
            "Utilisez la barre de recherche pour trouver rapidement un outil",
            "Commencez par modifier le contenu de votre site",
            "Sauvegardez régulièrement vos modifications",
          ],
          tips: [
            "Le système sauvegarde automatiquement vos modifications",
            "Utilisez ⌘K (Mac) ou Ctrl+K (PC) pour rechercher rapidement",
            "Votre rôle détermine quels outils sont disponibles",
          ],
        },
        {
          id: "navigation",
          title: "Navigation dans l'Interface",
          content:
            "L'interface est organisée en sections claires pour faciliter votre travail quotidien.",
          steps: [
            "Centre de Contrôle : Accès à tous les outils depuis un endroit unique",
            "Dashboard Admin : Vue d'ensemble avec statistiques en temps réel",
            "Sections spécialisées : Contenu, Design, Utilisateurs, etc.",
            "Raccourcis clavier : Accès rapide aux fonctions importantes",
          ],
        },
      ],
      requiredRole: "all",
    },
    {
      id: "content-management",
      title: "Gestion du Contenu",
      icon: Book,
      color: "green",
      description: "Modifier tous les textes et contenus de votre site web",
      subsections: [
        {
          id: "text-editing",
          title: "Modification des Textes",
          content:
            "Vous pouvez modifier tous les textes de votre site facilement. Les modifications sont visibles instantanément.",
          steps: [
            "Allez dans 'Éditeur de Contenu' depuis le Centre de Contrôle",
            "Ou accédez au Dashboard Admin > Section Contenu",
            "Modifiez les textes dans les champs prévus",
            "Les changements sont automatiquement sauvegardés",
            "Utilisez 'Prévisualiser' pour voir le résultat",
          ],
          tips: [
            "Les textes sont organisés par sections (Hero, À Propos, Services, etc.)",
            "Respectez la longueur recommandée pour chaque champ",
            "Utilisez un langage clair et engageant pour vos visiteurs",
          ],
        },
        {
          id: "content-sections",
          title: "Sections de Contenu",
          content:
            "Votre site est divisé en plusieurs sections que vous pouvez personnaliser.",
          steps: [
            "Section Hero : Titre principal et sous-titre de votre page d'accueil",
            "À Propos : Description de votre entreprise et vos valeurs",
            "Services : Détails sur vos prestations",
            "Contact : Informations de contact et coordonnées",
          ],
        },
      ],
      requiredRole: "all",
    },
    {
      id: "design-customization",
      title: "Personnalisation du Design",
      icon: Palette,
      color: "pink",
      description: "Modifier l'apparence visuelle de votre site",
      subsections: [
        {
          id: "color-themes",
          title: "Thèmes et Couleurs",
          content:
            "Personnalisez les couleurs de votre site pour refléter votre identité visuelle.",
          steps: [
            "Accédez à 'Personnalisation Design' dans le Centre de Contrôle",
            "Choisissez vos couleurs primaires et secondaires",
            "Modifiez les couleurs d'accent et d'arrière-plan",
            "Prévisualisez les changements en temps réel",
            "Appliquez les modifications",
          ],
          tips: [
            "Utilisez des couleurs contrastées pour une bonne lisibilité",
            "Gardez une cohérence dans votre palette de couleurs",
            "Testez votre site sur différents appareils",
          ],
        },
        {
          id: "advanced-theming",
          title: "Thèmes Avancés (Super Admin)",
          content:
            "Outils avancés de personnalisation pour les Super Administrateurs.",
          steps: [
            "Gestionnaire de Thème : Thèmes prédéfinis professionnels",
            "Éditeur CSS : Modifications CSS personnalisées",
            "Import/Export de thèmes",
            "Prévisualisation en temps réel",
          ],
        },
      ],
      requiredRole: "admin",
    },
    {
      id: "analytics-monitoring",
      title: "Analytics & Monitoring",
      icon: BarChart3,
      color: "indigo",
      description: "Suivre les performances et statistiques de votre site",
      subsections: [
        {
          id: "dashboard-metrics",
          title: "Métriques du Dashboard",
          content:
            "Le dashboard vous fournit des statistiques en temps réel sur l'activité de votre site.",
          steps: [
            "Accédez au Dashboard Admin",
            "Consultez les métriques en temps réel",
            "Analysez les tendances de trafic",
            "Surveillez les conversions",
            "Exportez les données si nécessaire",
          ],
        },
        {
          id: "performance-monitoring",
          title: "Surveillance des Performances",
          content:
            "Outils pour surveiller la santé et les performances de votre site.",
          steps: [
            "Test des Fonctionnalités : Diagnostic complet du système",
            "Vérification Performance : Analyse de la vitesse de chargement",
            "État de Santé : Monitoring en temps réel des composants",
            "Alertes automatiques en cas de problème",
          ],
        },
      ],
      requiredRole: "admin",
    },
    {
      id: "user-management",
      title: "Gestion des Utilisateurs",
      icon: Users,
      color: "orange",
      description: "Administrer les comptes et permissions utilisateurs",
      subsections: [
        {
          id: "admin-roles",
          title: "Rôles et Permissions",
          content:
            "Le système utilise une hiérarchie de rôles pour contrôler l'accès aux fonctionnalités.",
          steps: [
            "Administrateur Standard : Gestion du contenu et design de base",
            "Mind Admin : Modération du contenu et gestion des communications",
            "Super Admin : Contrôle total du système et fonctionnalités avancées",
          ],
        },
        {
          id: "account-management",
          title: "Gestion des Comptes (Super Admin)",
          content:
            "Outils de gestion des comptes administrateurs pour les Super Admins.",
          steps: [
            "Créer de nouveaux comptes administrateurs",
            "Modifier les permissions et rôles",
            "Désactiver ou supprimer des comptes",
            "Surveiller l'activité des utilisateurs",
          ],
        },
      ],
      requiredRole: "admin",
    },
    {
      id: "system-configuration",
      title: "Configuration Système",
      icon: Settings,
      color: "gray",
      description: "Paramètres avancés et configuration du système",
      subsections: [
        {
          id: "backup-restore",
          title: "Sauvegarde et Restauration",
          content: "Gérer les sauvegardes de votre contenu et configuration.",
          steps: [
            "Sauvegarde Rapide : Sauvegarde instantanée du contenu actuel",
            "Export de Contenu : Téléchargement complet des données",
            "Sauvegarde Automatique : Le système sauvegarde automatiquement",
            "Restauration : Possibilité de revenir à une version antérieure",
          ],
          shortcuts: [
            { key: "⌘S / Ctrl+S", description: "Sauvegarde rapide" },
            { key: "⌘⇧S / Ctrl+Shift+S", description: "Export de contenu" },
          ],
        },
        {
          id: "security-settings",
          title: "Paramètres de Sécurité",
          content: "Configuration de la sécurité et authentification.",
          steps: [
            "Gestion des mots de passe administrateurs",
            "Configuration de l'authentification à deux facteurs",
            "Surveillance des connexions suspectes",
            "Logs d'activité et audit de sécurité",
          ],
        },
      ],
      requiredRole: "supreme",
    },
    {
      id: "troubleshooting",
      title: "Dépannage & Support",
      icon: HelpCircle,
      color: "red",
      description: "Résoudre les problèmes courants et obtenir de l'aide",
      subsections: [
        {
          id: "common-issues",
          title: "Problèmes Courants",
          content:
            "Solutions aux problèmes les plus fréquents rencontrés par les administrateurs.",
          steps: [
            "Problème de connexion : Vérifiez vos identifiants et votre connexion internet",
            "Modifications non sauvegardées : Utilisez le bouton de sauvegarde manuelle",
            "Interface qui ne répond pas : Rafraîchissez la page (F5)",
            "Erreurs d'affichage : Videz le cache de votre navigateur",
          ],
        },
        {
          id: "diagnostic-tools",
          title: "Outils de Diagnostic",
          content:
            "Utilisez les outils intégrés pour diagnostiquer les problèmes.",
          steps: [
            "Test des Fonctionnalités : Diagnostic complet automatisé",
            "Vérification Performance : Test de vitesse et connectivité",
            "État de Santé : Monitoring des composants système",
            "Logs d'activité : Historique des actions et erreurs",
          ],
        },
        {
          id: "getting-help",
          title: "Obtenir de l'Aide",
          content:
            "Ressources et contacts pour obtenir une assistance technique.",
          steps: [
            "Documentation en ligne : Guides détaillés et tutoriels",
            "Support par email : support@mindgraphix.com",
            "Chat en direct : Icône de chat en bas de page",
            "Tickets de support : Système de tickets prioritaires",
          ],
        },
      ],
      requiredRole: "all",
    },
    {
      id: "keyboard-shortcuts",
      title: "Raccourcis Clavier",
      icon: Keyboard,
      color: "purple",
      description: "Raccourcis pour une utilisation plus efficace",
      subsections: [
        {
          id: "global-shortcuts",
          title: "Raccourcis Globaux",
          content:
            "Raccourcis disponibles partout dans l'interface d'administration.",
          shortcuts: [
            { key: "⌘K / Ctrl+K", description: "Ouvrir la recherche rapide" },
            {
              key: "⌘⇧A / Ctrl+Shift+A",
              description: "Ouvrir le Centre de Contrôle Admin",
            },
            {
              key: "Échap",
              description: "Fermer les modales et fenêtres ouvertes",
            },
            { key: "⌘S / Ctrl+S", description: "Sauvegarde rapide" },
            { key: "⌘R / Ctrl+R", description: "Actualiser la page" },
          ],
        },
        {
          id: "navigation-shortcuts",
          title: "Navigation Rapide",
          content: "Raccourcis pour naviguer rapidement entre les sections.",
          shortcuts: [
            { key: "Alt+A", description: "Ouvrir les paramètres admin" },
            { key: "Alt+D", description: "Accéder au Dashboard" },
            { key: "Alt+C", description: "Modifier le contenu" },
            { key: "Alt+P", description: "Prévisualiser le site" },
          ],
        },
      ],
      requiredRole: "all",
    },
  ];

  // Filtrer les sections selon les permissions
  const hasPermission = (section: GuideSection): boolean => {
    if (!isAdmin) return false;

    switch (section.requiredRole) {
      case "supreme":
        return (
          isSuperAdmin &&
          !isMindAdmin &&
          currentUser?.email === "philippefaizsanon@gmail.com"
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

  const filteredSections = guideSections.filter(hasPermission);

  // Recherche dans les sections
  const searchInContent = (section: GuideSection, query: string): boolean => {
    const lowerQuery = query.toLowerCase();

    if (
      section.title.toLowerCase().includes(lowerQuery) ||
      section.description.toLowerCase().includes(lowerQuery)
    ) {
      return true;
    }

    return section.subsections.some(
      (sub) =>
        sub.title.toLowerCase().includes(lowerQuery) ||
        sub.content.toLowerCase().includes(lowerQuery) ||
        sub.steps?.some((step) => step.toLowerCase().includes(lowerQuery)) ||
        sub.tips?.some((tip) => tip.toLowerCase().includes(lowerQuery)),
    );
  };

  const searchResults = searchQuery
    ? filteredSections.filter((section) =>
        searchInContent(section, searchQuery),
      )
    : filteredSections;

  if (!isOpen || !isAdmin) return null;

  return (
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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-7xl max-h-[95vh] m-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Book size={32} />
              <div>
                <h2 className="text-2xl font-bold">
                  Guide Administrateur Complet
                </h2>
                <p className="text-blue-100">
                  Documentation complète du système Mind Graphix Solutions
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

          {/* Barre de recherche */}
          <div className="mt-4 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Book size={20} className="text-blue-200" />
            </div>
            <input
              type="text"
              placeholder="Rechercher dans la documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>

        {/* Layout principal */}
        <div className="flex h-[calc(95vh-200px)]">
          {/* Sidebar de navigation */}
          <div className="w-80 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sections
              </h3>

              <div className="space-y-2">
                {searchResults.map((section, index) => (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() =>
                      setActiveSection(
                        activeSection === section.id ? null : section.id,
                      )
                    }
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                      activeSection === section.id
                        ? `bg-${section.color}-100 dark:bg-${section.color}-900/30 text-${section.color}-800 dark:text-${section.color}-200`
                        : "hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <section.icon size={20} />
                      <div className="flex-1">
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {section.description}
                        </div>
                      </div>
                      <motion.div
                        animate={{
                          rotate: activeSection === section.id ? 90 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={16} />
                      </motion.div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              <AnimatePresence mode="wait">
                {activeSection ? (
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    {(() => {
                      const section = searchResults.find(
                        (s) => s.id === activeSection,
                      );
                      if (!section) return null;

                      return (
                        <>
                          <div className="flex items-center space-x-4 mb-8">
                            <div
                              className={`w-16 h-16 bg-${section.color}-500 rounded-2xl flex items-center justify-center text-white shadow-lg`}
                            >
                              <section.icon size={28} />
                            </div>
                            <div>
                              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {section.title}
                              </h1>
                              <p className="text-gray-600 dark:text-gray-400 mt-2">
                                {section.description}
                              </p>
                            </div>
                          </div>

                          {section.subsections.map((subsection, index) => (
                            <motion.div
                              key={subsection.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
                            >
                              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Star
                                  size={20}
                                  className="mr-2 text-yellow-500"
                                />
                                {subsection.title}
                              </h2>

                              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                                {subsection.content}
                              </p>

                              {subsection.steps && (
                                <div className="mb-6">
                                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                    <CheckCircle
                                      size={16}
                                      className="mr-2 text-green-500"
                                    />
                                    Étapes à suivre :
                                  </h3>
                                  <ol className="space-y-2">
                                    {subsection.steps.map((step, stepIndex) => (
                                      <li
                                        key={stepIndex}
                                        className="flex items-start space-x-3"
                                      >
                                        <div
                                          className={`w-6 h-6 bg-${section.color}-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}
                                        >
                                          {stepIndex + 1}
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300">
                                          {step}
                                        </span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              {subsection.shortcuts && (
                                <div className="mb-6">
                                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                    <Keyboard
                                      size={16}
                                      className="mr-2 text-purple-500"
                                    />
                                    Raccourcis clavier :
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {subsection.shortcuts.map(
                                      (shortcut, shortcutIndex) => (
                                        <div
                                          key={shortcutIndex}
                                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                          <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm font-mono">
                                            {shortcut.key}
                                          </kbd>
                                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-3">
                                            {shortcut.description}
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}

                              {subsection.tips && (
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                    <Lightbulb
                                      size={16}
                                      className="mr-2 text-yellow-500"
                                    />
                                    Conseils et astuces :
                                  </h3>
                                  <ul className="space-y-2">
                                    {subsection.tips.map((tip, tipIndex) => (
                                      <li
                                        key={tipIndex}
                                        className="flex items-start space-x-3"
                                      >
                                        <ArrowRight
                                          size={16}
                                          className="text-blue-500 mt-0.5 flex-shrink-0"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">
                                          {tip}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </>
                      );
                    })()}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <Book size={64} className="mx-auto text-gray-400 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Guide Administrateur Mind Graphix
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                      Sélectionnez une section dans le menu de gauche pour
                      accéder à la documentation détaillée. Utilisez la barre de
                      recherche pour trouver rapidement une information
                      spécifique.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <Play
                          size={32}
                          className="mx-auto text-blue-500 mb-4"
                        />
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                          Démarrage Rapide
                        </h3>
                        <p className="text-sm text-blue-600 dark:text-blue-300">
                          Apprenez les bases en quelques minutes
                        </p>
                      </div>

                      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <Settings
                          size={32}
                          className="mx-auto text-green-500 mb-4"
                        />
                        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                          Configuration
                        </h3>
                        <p className="text-sm text-green-600 dark:text-green-300">
                          Personnalisez votre site selon vos besoins
                        </p>
                      </div>

                      <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <HelpCircle
                          size={32}
                          className="mx-auto text-purple-500 mb-4"
                        />
                        <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                          Support
                        </h3>
                        <p className="text-sm text-purple-600 dark:text-purple-300">
                          Obtenez de l'aide quand vous en avez besoin
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
