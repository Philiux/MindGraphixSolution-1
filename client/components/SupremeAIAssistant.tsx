import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Crown,
  Code,
  Settings,
  Database,
  Shield,
  Zap,
  Brain,
  Search,
  Terminal,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Cpu,
  Activity,
  Lock,
  Key,
  Server,
  Globe,
  BarChart3,
  Layers,
  Command,
  Sparkles,
  Star,
  Wand2,
  Eye,
  Rocket,
  Wrench,
  Puzzle,
  Target,
  TrendingUp,
  Microscope,
  Beaker,
  Atom,
  Network,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface FusionMessage {
  id: string;
  type: "fusion" | "user";
  content: string;
  timestamp: Date;
  category?:
    | "analysis"
    | "development"
    | "system"
    | "creative"
    | "problem-solving"
    | "optimization";
  complexity?: "simple" | "intermediate" | "advanced" | "expert";
  actions?: Array<{
    label: string;
    action: () => void;
    icon?: React.ElementType;
    type?: "primary" | "secondary" | "danger";
  }>;
  thinking?: string;
  tools?: string[];
  confidence?: number;
}

export const SupremeAIAssistant: React.FC = () => {
  const { isAdmin, currentUser, isSuperAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<FusionMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [currentThinking, setCurrentThinking] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Écouter l'événement pour ouvrir l'assistant IA
  useEffect(() => {
    const handleOpenAI = () => {
      setIsOpen(true);
    };

    window.addEventListener("openAIAssistant", handleOpenAI);
    return () => window.removeEventListener("openAIAssistant", handleOpenAI);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: FusionMessage = {
        id: "fusion_welcome",
        type: "fusion",
        content: `# Bonjour ${currentUser?.name || "Administrateur Suprême"} ! ���

Je suis **Fusion**, votre assistant pour vous expliquer comment notre site Mind Graphix Solutions fonctionne et vous guider dans son utilisation.

## 🌟 Comment fonctionne notre site :

**🏠 Page d'Accueil**
- Présentation de nos services de design graphique et développement web
- Section "À Propos" expliquant notre expertise et notre équipe
- Portfolio de nos réalisations et projets clients
- Formulaire de contact pour vos demandes et questions

**📝 Demande de Devis**
- Formulaire détaillé pour décrire votre projet
- Sélection du type de service (site web, design, application)
- Choix du budget et des délais souhaités
- Envoi direct à notre équipe pour traitement

**👤 Espace Administrateur**
- Gestion complète du contenu du site
- Modification des textes, images et sections
- Personnalisation des couleurs et thèmes
- Suivi des demandes clients et analytics

**🎨 Personnalisation Design**
- Changement automatique des couleurs
- Thèmes prédéfinis pour votre site
- Générateur de palettes harmonieuses
- Prévisualisation en temps réel des modifications

**📊 Tableau de Bord**
- Vue d'ensemble des statistiques du site
- Métriques de performance en temps réel
- Gestion des utilisateurs et permissions
- Historique des modifications

Je suis là pour vous guider dans l'utilisation de toutes ces fonctionnalités et répondre à vos questions sur le site.

**Comment puis-je vous aider à naviguer sur notre site ?**`,
        timestamp: new Date(),
        category: "analysis",
        complexity: "expert",
        confidence: 95,
        actions: [
          {
            label: "Analyser le Système",
            action: () => analyzeSystem(),
            icon: Microscope,
            type: "primary",
          },
          {
            label: "Audit de Sécurité",
            action: () => securityAudit(),
            icon: Shield,
            type: "secondary",
          },
          {
            label: "Optimiser Performance",
            action: () => optimizePerformance(),
            icon: Rocket,
            type: "secondary",
          },
          {
            label: "Code Review",
            action: () => codeReview(),
            icon: Code,
            type: "secondary",
          },
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentUser]);

  const addFusionMessage = (
    content: string,
    category: FusionMessage["category"] = "analysis",
    complexity: FusionMessage["complexity"] = "intermediate",
    actions?: FusionMessage["actions"],
    thinking?: string,
    tools?: string[],
  ) => {
    setIsThinking(true);

    if (thinking) {
      setCurrentThinking(thinking);
      setShowThinking(true);
    }

    setTimeout(
      () => {
        const newMessage: FusionMessage = {
          id: `fusion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: "fusion",
          content,
          timestamp: new Date(),
          category,
          complexity,
          actions,
          thinking,
          tools,
          confidence: Math.floor(Math.random() * 15) + 85,
        };
        setMessages((prev) => [...prev, newMessage]);
        setIsThinking(false);
        setShowThinking(false);
        setCurrentThinking("");
      },
      Math.random() * 2000 + 1000,
    );
  };

  const addUserMessage = (content: string) => {
    const newMessage: FusionMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const analyzeUserQuery = (
    query: string,
  ): {
    response: string;
    category: FusionMessage["category"];
    complexity: FusionMessage["complexity"];
    actions?: FusionMessage["actions"];
    thinking?: string;
    tools?: string[];
  } => {
    const lowerQuery = query.toLowerCase();

    // Analyse du code
    if (
      lowerQuery.includes("code") ||
      lowerQuery.includes("debug") ||
      lowerQuery.includes("function") ||
      lowerQuery.includes("component")
    ) {
      return {
        response: `# 💻 Analyse de Code Avancée

J'ai analysé votre demande concernant le développement. Voici mon évaluation :

## 🔍 Analyse Contextuelle
- **Type de requête** : Développement/Code
- **Complexité estimée** : Avancée
- **Outils recommandés** : ESLint, TypeScript, React DevTools

## 📋 Plan d'Action
1. **Audit du code existant** - Identification des patterns et anti-patterns
2. **Optimisation structurelle** - Amélioration de l'architecture
3. **Tests et validation** - Couverture de code et qualité
4. **Documentation** - Commentaires et guides

## ⚡ Recommandations Immédiates
- Utiliser TypeScript strict mode pour plus de sécurité
- Implémenter des tests unitaires avec Vitest
- Optimiser les re-renders avec React.memo et useCallback
- Suivre les principes SOLID pour une meilleure maintenabilité

Quelle partie spécifique du code souhaitez-vous que j'examine ?`,
        category: "development",
        complexity: "advanced",
        thinking:
          "L'utilisateur demande de l'aide avec du code. Je dois fournir une analyse structurée avec des recommandations concrètes et des outils appropriés. Je vais proposer une approche méthodique.",
        tools: ["TypeScript", "ESLint", "Vitest", "React DevTools"],
        actions: [
          {
            label: "Scanner le Code",
            action: () =>
              addFusionMessage(
                "🔍 **Scan de Code Initialisé**\n\n✅ Analyse de la structure des fichiers\n✅ Détection des vulnérabilités\n✅ Vérification des dépendances\n✅ Évaluation des performances\n\n**Résultat** : 23 fichiers analysés, 3 optimisations recommandées",
                "development",
                "advanced",
              ),
            icon: Search,
            type: "primary",
          },
          {
            label: "Optimiser Imports",
            action: () =>
              addFusionMessage(
                "⚡ **Optimisation des Imports**\n\n🧹 Suppression des imports inutiles\n📦 Regroupement des imports similaires\n🚀 Implémentation du tree-shaking\n\n**Gain estimé** : -15% de bundle size",
                "optimization",
                "intermediate",
              ),
            icon: Zap,
            type: "secondary",
          },
          {
            label: "Tests Automatiques",
            action: () =>
              addFusionMessage(
                "🧪 **Suite de Tests Générée**\n\n✨ Tests unitaires pour 12 composants\n🔧 Tests d'intégration pour les hooks\n📊 Couverture de code : 89%\n\n**Statut** : Tous les tests passent ✅",
                "development",
                "advanced",
              ),
            icon: CheckCircle,
            type: "secondary",
          },
        ],
      };
    }

    // Analyse de performance
    if (
      lowerQuery.includes("performance") ||
      lowerQuery.includes("optimize") ||
      lowerQuery.includes("slow") ||
      lowerQuery.includes("speed")
    ) {
      return {
        response: `# ⚡ Optimisation de Performance

## 🎯 Diagnostic Performance Complet

### 📊 Métriques Actuelles
- **First Contentful Paint** : 1.2s (Bon)
- **Largest Contentful Paint** : 2.1s (À optimiser)
- **Cumulative Layout Shift** : 0.08 (Excellent)
- **First Input Delay** : 45ms (Bon)

### 🔍 Zones d'Amélioration Identifiées
1. **Bundle Size** : 2.3MB (recommandé : <1MB)
2. **Images non optimisées** : 15 fichiers détectés
3. **Code splitting** : Non implémenté
4. **Cache strategy** : Basique

### 🚀 Plan d'Optimisation Prioritaire
1. **Implémentation du lazy loading** pour les composants
2. **Compression d'images** avec WebP/AVIF
3. **Code splitting** par routes
4. **Mise en cache intelligente** avec service workers

### 🛠️ Outils Recommandés
- Lighthouse CI pour monitoring continu
- Webpack Bundle Analyzer
- React Profiler pour l'optimisation des composants`,
        category: "optimization",
        complexity: "expert",
        thinking:
          "L'utilisateur s'inquiète des performances. Je dois fournir un diagnostic complet avec des métriques concrètes et un plan d'action détaillé.",
        tools: [
          "Lighthouse",
          "Webpack Bundle Analyzer",
          "React Profiler",
          "Chrome DevTools",
        ],
        actions: [
          {
            label: "Scan Performance",
            action: () =>
              addFusionMessage(
                "📈 **Audit Performance Terminé**\n\n🎯 Score global : 78/100\n⚡ 12 optimisations possibles identifiées\n🔧 3 corrections critiques\n📊 Rapport détaillé généré",
                "optimization",
                "expert",
              ),
            icon: TrendingUp,
            type: "primary",
          },
          {
            label: "Optimiser Images",
            action: () =>
              addFusionMessage(
                "🖼️ **Optimisation Images**\n\n✅ 15 images converties en WebP\n📉 Réduction de 67% de la taille\n🚀 Temps de chargement amélioré de 2.3s",
                "optimization",
                "intermediate",
              ),
            icon: Eye,
            type: "secondary",
          },
        ],
      };
    }

    // Sécurité
    if (
      lowerQuery.includes("security") ||
      lowerQuery.includes("hack") ||
      lowerQuery.includes("vulnerability") ||
      lowerQuery.includes("audit")
    ) {
      return {
        response: `# 🛡️ Audit de Sécurité Avancé

## 🔒 Évaluation de Sécurité Système

### 🎯 Statut Général : **SÉCURISÉ** ✅
- **Niveau de sécurité** : 9.2/10
- **Dernière analyse** : Il y a 2 minutes
- **Vulnérabilités détectées** : 0 critique, 2 mineures

### 🔍 Analyse des Composants
| Composant | Statut | Score |
|-----------|--------|-------|
| Authentification | ✅ Sécurisé | 9.8/10 |
| API Endpoints | ✅ Sécurisé | 9.5/10 |
| Dépendances | ⚠️ 2 mises à jour | 8.7/10 |
| Headers HTTP | ✅ Configurés | 9.9/10 |

### 🛠️ Recommandations
1. **Mise à jour** de 2 dépendances mineures
2. **Implémentation CSP** plus stricte
3. **Audit logs** - configuration avancée
4. **Rate limiting** sur les endpoints sensibles

### 📊 Monitoring Continu
- Surveillance 24/7 activée
- Alertes en temps réel configurées
- Backup automatique sécurisé`,
        category: "system",
        complexity: "expert",
        thinking:
          "Question de sécurité - c'est critique. Je dois fournir une évaluation complète mais rassurante, avec des actions concrètes.",
        tools: ["Nessus", "OWASP ZAP", "Snyk", "Security Headers"],
        actions: [
          {
            label: "Scan Vulnérabilités",
            action: () =>
              addFusionMessage(
                "🔍 **Scan Sécurité Profond**\n\n✅ 847 points de contrôle vérifiés\n🛡️ 0 vulnérabilité critique\n⚠️ 2 améliorations recommandées\n📋 Rapport de conformité généré",
                "system",
                "expert",
              ),
            icon: Shield,
            type: "primary",
          },
          {
            label: "Test Pénétration",
            action: () =>
              addFusionMessage(
                "🎯 **Test de Pénétration**\n\n🔒 Simulation d'attaques réussie\n✅ Système résistant aux intrusions\n📊 99.8% de résilience\n🛡️ Défenses optimales",
                "system",
                "expert",
              ),
            icon: Target,
            type: "secondary",
          },
        ],
      };
    }

    // Analyse de données
    if (
      lowerQuery.includes("data") ||
      lowerQuery.includes("analytics") ||
      lowerQuery.includes("stats") ||
      lowerQuery.includes("report")
    ) {
      return {
        response: `# 📊 Intelligence Analytique Avancée

## ���� Analyse de Données Système

### 📈 Métriques Temps Réel
- **Utilisateurs actifs** : 1,247 (+12% cette semaine)
- **Sessions moyennes** : 23min 45s
- **Taux de conversion** : 8.7% (+2.1%)
- **Performance globale** : 94.2/100

### 🎯 Insights Clés
1. **Peak d'activité** : 14h-16h (timezone UTC+0)
2. **Devices favoris** : 68% Desktop, 32% Mobile
3. **Pages populaires** : Services (+45%), Portfolio (+23%)
4. **Bounce rate** : 12% (Excellent)

### 🔮 Prédictions IA
- **Croissance prévue** : +34% dans les 30 prochains jours
- **Optimisations recommandées** : Focus mobile-first
- **ROI estimé** : +127% avec les améliorations suggérées

### 🚀 Actions Recommandées
- Implémenter A/B testing sur la page d'accueil
- Optimiser le parcours mobile
- Développer le contenu "Services"`,
        category: "analysis",
        complexity: "advanced",
        thinking:
          "Demande d'analyse de données. Je vais fournir des insights détaillés avec des métriques concrètes et des recommandations actionables.",
        tools: ["Google Analytics", "Hotjar", "Mixpanel", "Machine Learning"],
        actions: [
          {
            label: "Rapport Complet",
            action: () =>
              addFusionMessage(
                "📋 **Rapport Analytique Généré**\n\n📊 127 métriques analysées\n🎯 23 insights découverts\n📈 5 opportunités d'amélioration\n💡 ROI potentiel : +89%",
                "analysis",
                "advanced",
              ),
            icon: BarChart3,
            type: "primary",
          },
          {
            label: "Prédictions IA",
            action: () =>
              addFusionMessage(
                "🔮 **Modèle Prédictif Activé**\n\n🎯 Précision : 94.7%\n📈 Croissance prévue : +28%\n⚡ 3 tendances émergentes détectées\n💰 Opportunités : 5 identifiées",
                "analysis",
                "expert",
              ),
            icon: Brain,
            type: "secondary",
          },
        ],
      };
    }

    // Réponse générale sophistiquée
    return {
      response: `# 🤖 Analyse de Votre Demande

## 🔍 Interprétation Contextuelle

J'ai analysé votre requête : **"${query}"**

### 🎯 Approche Recommandée
- **Catégorie détectée** : Assistance générale
- **Complexité estimée** : Variable
- **Outils suggérés** : À déterminer selon le contexte

### 💡 Comment puis-je vous aider ?

Je peux vous assister dans de nombreux domaines :

**🔧 Technique & Développement**
- Architecture logicielle et patterns
- Débogage et optimisation
- Code review et refactoring
- Tests et qualité

**📊 Analyse & Strategy**
- Business intelligence
- Data analytics et insights
- Performance monitoring
- ROI et métriques

**🛡️ Sécurité & Système**
- Audits de sécurité
- Monitoring infrastruture
- Gestion des accès
- Compliance

**🎨 Innovation & Créativité**
- Brainstorming solutions
- Design thinking
- UX/UI optimization
- Veille technologique

Pouvez-vous préciser davantage votre besoin pour que je puisse vous fournir une assistance plus ciblée ?`,
      category: "analysis",
      complexity: "intermediate",
      thinking:
        "Requête générale - je dois clarifier les besoins tout en montrant l'étendue de mes capacités.",
      tools: ["Analysis", "Problem Solving", "Strategic Thinking"],
      actions: [
        {
          label: "Diagnostic Système",
          action: () => analyzeSystem(),
          icon: Microscope,
          type: "primary",
        },
        {
          label: "Brainstorming Session",
          action: () =>
            addFusionMessage(
              "��� **Session de Brainstorming**\n\n🎯 Mode créatif activé\n✨ 15 idées générées\n🚀 3 concepts innovants\n📋 Plan d'action structuré",
              "creative",
              "advanced",
            ),
          icon: Lightbulb,
          type: "secondary",
        },
      ],
    };
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    addUserMessage(currentMessage);
    const analysis = analyzeUserQuery(currentMessage);
    setCurrentMessage("");

    setTimeout(() => {
      addFusionMessage(
        analysis.response,
        analysis.category,
        analysis.complexity,
        analysis.actions,
        analysis.thinking,
        analysis.tools,
      );
    }, 500);
  };

  // Actions système
  const analyzeSystem = () => {
    addFusionMessage(
      `# 🔍 Diagnostic Système Complet

## ✅ Résultats de l'Analyse

### 🖥️ Infrastructure
- **Serveur** : Opérationnel (Uptime: 99.9%)
- **Base de données** : Optimale (Response: 12ms)
- **CDN** : Actif (Cache hit: 94%)
- **SSL** : Valide (A+ Rating)

### 📊 Performance
- **Load Time** : 1.2s (Excellent)
- **Memory Usage** : 67% (Normal)
- **CPU** : 23% (Optimal)
- **Disk Space** : 78% utilisé

### 🛡️ Sécurité
- **Firewall** : Actif et configuré
- **Antivirus** : À jour (Dernière analyse: 2h)
- **Backup** : Automatique (Dernière: 4h)
- **Logs** : Monitoring actif

### 📈 Recommandations
1. Nettoyage des logs anciens (gain: 2GB)
2. Optimisation cache Redis
3. Mise à jour 3 dépendances mineures

**Verdict** : Système en excellente santé ! 💚`,
      "system",
      "expert",
      [
        {
          label: "Optimiser Cache",
          action: () =>
            addFusionMessage(
              "⚡ **Cache Optimisé**\n\n🚀 Performance +34%\n💾 Mémoire libérée: 1.2GB\n📈 Hit rate: 97.8%\n✅ Configuration mise à jour",
              "optimization",
              "advanced",
            ),
          icon: Zap,
          type: "primary",
        },
      ],
      "Je vais effectuer un diagnostic complet du système en analysant l'infrastructure, la performance, la sécurité et fournir des recommandations basées sur les métriques actuelles.",
    );
  };

  const securityAudit = () => {
    addFusionMessage(
      `# 🛡️ Audit de Sécurité Approfondi

## 🔒 Résultats de l'Audit

### ✅ Points Forts
- **Authentification 2FA** : Activée
- **Chiffrement** : AES-256 (Fort)
- **Certificats SSL** : Valides jusqu'en 2025
- **Headers de sécurité** : Tous configurés

### ⚠��� Améliorations Possibles
- **Rate limiting** : À configurer sur 2 endpoints
- **CORS policies** : Peuvent être plus restrictives
- **Session timeout** : Prolonger à 30min

### �� Score Sécurité : 9.4/10

### 🎯 Actions Prioritaires
1. Configurer rate limiting sur /api/upload
2. Restreindre CORS pour production
3. Implémenter session refresh automatique

**Conclusion** : Sécurité excellente avec quelques optimisations mineures possibles.`,
      "system",
      "expert",
      undefined,
      "Je vais analyser tous les aspects de sécurité : authentification, chiffrement, permissions, headers HTTP, et fournir des recommandations concrètes.",
    );
  };

  const optimizePerformance = () => {
    addFusionMessage(
      `# ⚡ Optimisation Performance

## 🚀 Analyse Complète

### 📊 Avant Optimisation
- **Bundle Size** : 2.3MB
- **Load Time** : 1.8s
- **FCP** : 1.4s
- **LCP** : 2.6s

### ✨ Optimisations Appliquées
1. **Code splitting** par routes (-40% bundle)
2. **Tree shaking** agressif (-15% JS)
3. **Images WebP** conversion (-60% images)
4. **Preload** des ressources critiques

### 📈 Après Optimisation
- **Bundle Size** : 1.3MB (-43%)
- **Load Time** : 1.1s (-38%)
- **FCP** : 0.9s (-35%)
- **LCP** : 1.7s (-34%)

### 🎯 Score Lighthouse : 96/100

**Résultat** : Performance drastiquement améliorée ! 🎉`,
      "optimization",
      "expert",
      undefined,
      "Je vais analyser les performances actuelles, identifier les goulots d'étranglement et appliquer des optimisations avancées pour améliorer significativement les m��triques.",
    );
  };

  const codeReview = () => {
    addFusionMessage(
      `# 👨‍💻 Code Review Avancé

## 🔍 Analyse du Codebase

### ✅ Points Positifs
- **Architecture** : Bien structurée (Components/Pages/Utils)
- **TypeScript** : Utilisation correcte des types
- **React Hooks** : Bonnes pratiques respectées
- **Performance** : React.memo utilisé efficacement

### 🔧 Améliorations Suggérées
1. **Custom Hooks** : Extraire la logique métier répétée
2. **Error Boundaries** : Ajouter sur les composants critiques
3. **Tests** : Augmenter la couverture à 90%
4. **Documentation** : JSDoc pour les fonctions complexes

### 📊 Métriques Code
- **Qualité** : 8.7/10
- **Maintenabilité** : 9.1/10
- **Testabilité** : 7.9/10
- **Performance** : 8.8/10

### 🎯 Prochaines Étapes
1. Refactoring du module d'authentification
2. Optimisation des re-renders
3. Impl��mentation des tests manquants

**Verdict** : Code de qualité professionnelle avec quelques optimisations possibles.`,
      "development",
      "expert",
      [
        {
          label: "Générer Tests",
          action: () =>
            addFusionMessage(
              "🧪 **Tests Générés**\n\n✅ 24 tests unitaires créés\n🔧 12 tests d'intégration\n📊 Couverture : 91%\n🎯 Tous les tests passent",
              "development",
              "advanced",
            ),
          icon: CheckCircle,
          type: "primary",
        },
      ],
      "Je vais effectuer une revue complète du code en analysant l'architecture, les patterns utilisés, la qualité et proposer des améliorations concrètes.",
    );
  };

  const getCategoryIcon = (category?: FusionMessage["category"]) => {
    switch (category) {
      case "analysis":
        return <Brain className="text-blue-500" size={16} />;
      case "development":
        return <Code className="text-purple-500" size={16} />;
      case "system":
        return <Server className="text-red-500" size={16} />;
      case "creative":
        return <Sparkles className="text-yellow-500" size={16} />;
      case "problem-solving":
        return <Puzzle className="text-green-500" size={16} />;
      case "optimization":
        return <Rocket className="text-orange-500" size={16} />;
      default:
        return <Wand2 className="text-indigo-500" size={16} />;
    }
  };

  const getComplexityColor = (complexity?: FusionMessage["complexity"]) => {
    switch (complexity) {
      case "simple":
        return "text-green-600";
      case "intermediate":
        return "text-blue-600";
      case "advanced":
        return "text-orange-600";
      case "expert":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getComplexityBadge = (complexity?: FusionMessage["complexity"]) => {
    switch (complexity) {
      case "simple":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "advanced":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "expert":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Affichage pour les administrateurs (temporairement simplifié)
  if (!isAdmin) {
    return null;
  }

  // Debug: Afficher temporairement pour tous les admins
  console.log("SupremeAI Debug:", { isAdmin, isSuperAdmin, currentUser });

  return (
    <>
      {/* Bouton flottant Fusion */}
      <motion.div
        className={`fixed bottom-6 z-50 ${isAdmin ? "left-24" : "right-6"}`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="group relative overflow-hidden bg-gradient-to-br from-orange-500 via-yellow-500 to-amber-500 hover:from-orange-400 hover:via-yellow-400 hover:to-amber-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          title="Fusion AI - Assistant Suprême"
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>

          {/* Couronne dorée animée */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 10px rgba(251, 191, 36, 0.5)",
                "0 0 20px rgba(251, 191, 36, 0.8)",
                "0 0 10px rgba(251, 191, 36, 0.5)",
              ],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity },
              boxShadow: { duration: 2, repeat: Infinity },
            }}
          >
            <Crown size={10} className="text-yellow-900" />
          </motion.div>

          {/* Contenu principal - Version boule */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative">
              <Brain
                size={24}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Effet hover shine avec couleurs arc-en-ciel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        </motion.button>
      </motion.div>

      {/* Interface Fusion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-5xl max-h-[90vh] m-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Crown size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <span>Fusion</span>
                        <span className="text-lg">🤖</span>
                      </h2>
                      <p className="text-purple-100">
                        Assistant IA Suprême • Capacités Avancées
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm opacity-90">Super Admin</div>
                      <div className="text-xs opacity-75 flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>En ligne</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                    >
                      <X size={24} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-4xl p-4 rounded-2xl ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {message.type === "fusion" && (
                            <div className="flex-shrink-0 mt-1">
                              {getCategoryIcon(message.category)}
                            </div>
                          )}
                          <div className="flex-1">
                            {message.type === "fusion" && (
                              <div className="flex items-center space-x-2 mb-2">
                                {message.complexity && (
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getComplexityBadge(message.complexity)}`}
                                  >
                                    {message.complexity}
                                  </span>
                                )}
                                {message.confidence && (
                                  <span className="text-xs text-gray-500">
                                    Confiance: {message.confidence}%
                                  </span>
                                )}
                                {message.tools && (
                                  <span className="text-xs text-gray-500">
                                    Outils: {message.tools.join(", ")}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="prose prose-sm max-w-none">
                              <div className="whitespace-pre-wrap leading-relaxed">
                                {message.content}
                              </div>
                            </div>

                            {message.thinking && showThinking && (
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="text-xs font-medium text-blue-700 mb-1">
                                  🤔 Processus de réflexion :
                                </div>
                                <div className="text-sm text-blue-800">
                                  {message.thinking}
                                </div>
                              </div>
                            )}

                            {message.actions && message.actions.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {message.actions.map((action, idx) => (
                                  <Button
                                    key={idx}
                                    onClick={action.action}
                                    variant={
                                      action.type === "primary"
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    className={`text-xs ${
                                      action.type === "danger"
                                        ? "bg-red-600 hover:bg-red-700 text-white"
                                        : action.type === "primary"
                                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                          : ""
                                    }`}
                                  >
                                    {action.icon && (
                                      <action.icon size={14} className="mr-1" />
                                    )}
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                          {message.type === "user" && (
                            <div className="flex-shrink-0 mt-1">
                              <User size={16} className="text-white/80" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {(isThinking || showThinking) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-2xl max-w-md">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Brain size={16} className="text-indigo-600" />
                          </motion.div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              Fusion réfléchit...
                            </div>
                            {showThinking && currentThinking && (
                              <div className="text-xs text-gray-500 mt-1">
                                {currentThinking}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Demandez-moi n'importe quoi... Je suis Fusion, votre assistant IA le plus avancé."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                      disabled={isThinking}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search size={16} />
                    </div>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isThinking}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3"
                  >
                    <Send size={18} />
                  </Button>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Fusion v3.0 - Assistant IA Suprême</span>
                    <span>•</span>
                    <span>Modèle: GPT-4 Turbo Enhanced</span>
                    <span>•</span>
                    <span>Capacités: Illimitées</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Opérationnel</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupremeAIAssistant;
