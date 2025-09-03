import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Phone,
  Mail,
  Clock,
  Star,
  MapPin,
  Globe,
  Smartphone,
  Calendar,
  Info,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Package,
  CreditCard,
  Headphones,
  ThumbsUp,
  Zap,
  Heart,
  Coffee,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface ClientMessage {
  id: string;
  type: "bot" | "user";
  content: string;
  timestamp: Date;
  category?: "info" | "service" | "contact" | "help" | "pricing";
  quickReplies?: string[];
  actions?: Array<{
    label: string;
    action: () => void;
    icon?: React.ElementType;
    type?: "primary" | "secondary";
  }>;
}

export const ClientAssistantBot: React.FC = () => {
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ClientMessage = {
        id: "welcome",
        type: "bot",
        content: `# Bonjour ! 👋 Bienvenue chez Mind Graphix Solution

Je suis **MindiBot**, votre assistant personnel pour vous accompagner dans votre projet digital !

🎯 **Comment puis-je vous aider aujourd'hui ?**

• **📞 Prendre un rendez-vous** pour discuter de votre projet
• **💰 Obtenir un devis** personnalisé et gratuit  
• **🎨 Découvrir nos services** (Web, Design, Marketing)
• **📋 Voir nos réalisations** et témoignages clients
• **❓ Poser vos questions** sur nos processus

**Mind Graphix Solution** - Votre partenaire digital au Burkina Faso depuis 2020 🇧🇫`,
        timestamp: new Date(),
        category: "info",
        quickReplies: [
          "💰 Demander un devis",
          "📞 Prendre rendez-vous",
          "🎨 Voir vos services",
          "📋 Vos réalisations",
        ],
        actions: [
          {
            label: "Nos Services",
            action: () => showServices(),
            icon: Package,
            type: "primary",
          },
          {
            label: "Contact Direct",
            action: () => showContact(),
            icon: Phone,
            type: "secondary",
          },
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const addBotMessage = (
    content: string,
    category: ClientMessage["category"] = "info",
    quickReplies?: string[],
    actions?: ClientMessage["actions"],
  ) => {
    setIsTyping(true);
    setTimeout(
      () => {
        const newMessage: ClientMessage = {
          id: `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: "bot",
          content,
          timestamp: new Date(),
          category,
          quickReplies,
          actions,
        };
        setMessages((prev) => [...prev, newMessage]);
        setIsTyping(false);
      },
      Math.random() * 1500 + 800,
    );
  };

  const addUserMessage = (content: string) => {
    const newMessage: ClientMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const analyzeClientQuery = (
    query: string,
  ): {
    response: string;
    category: ClientMessage["category"];
    quickReplies?: string[];
    actions?: ClientMessage["actions"];
  } => {
    const lowerQuery = query.toLowerCase();

    // Demande de devis
    if (
      lowerQuery.includes("devis") ||
      lowerQuery.includes("prix") ||
      lowerQuery.includes("coût") ||
      lowerQuery.includes("tarif")
    ) {
      return {
        response: `# 💰 Devis Personnalisé Gratuit

Excellente question ! Nous proposons des **devis 100% gratuits** et personnalisés selon vos besoins.

## 🎯 Nos Tarifs Indicatifs :

**🌐 Sites Web**
• **Site Vitrine** : À partir de 262.000 FCFA
• **Site E-commerce** : À partir de 787.000 FCFA
• **Application Web** : À partir de 525.000 FCFA

**🎨 Design Graphique**
• **Identité Visuelle** : À partir de 131.000 FCFA
• **Supports Print** : À partir de 52.500 FCFA
• **Design Digital** : À partir de 78.750 FCFA

**📊 Marketing Digital**
• **Stratégie Complète** : À partir de 394.000 FCFA
• **Gestion Réseaux Sociaux** : À partir de 131.000 FCFA
• **SEO & Référencement** : À partir de 262.000 FCFA

## 📞 **Prochaines Étapes :**
1. **Consultation gratuite** (30min) pour analyser vos besoins
2. **Devis détaillé** sous 48h maximum
3. **Proposition personnalisée** avec planning

Souhaitez-vous qu'on planifie un appel découverte ?`,
        category: "pricing",
        quickReplies: [
          "📞 Planifier un appel",
          "📧 Recevoir le devis par email",
          "💬 Plus d'infos sur un service",
        ],
        actions: [
          {
            label: "Demander un Devis",
            action: () => setShowContactForm(true),
            icon: CreditCard,
            type: "primary",
          },
          {
            label: "Appeler Maintenant",
            action: () =>
              addBotMessage(
                "📞 **Contact Direct**\n\n**Téléphone :** +226 54191605\n**Email :** contact@mindgraphix.com\n\nNous sommes disponibles du Lundi au Vendredi, 8h-18h.",
                "contact",
              ),
            icon: Phone,
            type: "secondary",
          },
        ],
      };
    }

    // Services
    if (
      lowerQuery.includes("service") ||
      lowerQuery.includes("que faites") ||
      lowerQuery.includes("spécialité")
    ) {
      return {
        response: `# 🎨 Nos Services Experts

**Mind Graphix Solution** est votre partenaire digital complet au Burkina Faso !

## 🌐 **Développement Web**
• **Sites Vitrines** - Présentation professionnelle de votre activité
• **E-commerce** - Boutiques en ligne avec paiement sécurisé
• **Applications Web** - Solutions sur-mesure pour vos processus
• **Maintenance & SEO** - Suivi et optimisation continue

## 🎨 **Design Graphique** 
• **Identité Visuelle** - Logo, charte graphique, branding
• **Supports Print** - Cartes, brochures, affiches, packaging
• **Design Digital** - Réseaux sociaux, bannières, newsletters
• **Illustrations** - Créations artistiques personnalisées

## 📊 **Marketing Digital**
• **Stratégie Digitale** - Audit et plan d'action personnalisé
• **Réseaux Sociaux** - Gestion complète de vos comptes
• **Référencement SEO** - Visibilité Google optimisée
• **Publicité En Ligne** - Campagnes Google Ads & Facebook

## 🏆 **Pourquoi Nous Choisir ?**
✅ **+50 projets** réalisés avec succès
✅ **3+ années** d'expérience au Burkina Faso
✅ **100% satisfaction** client garantie
✅ **Support 24/7** et maintenance incluse`,
        category: "service",
        quickReplies: [
          "🌐 En savoir plus sur le Web",
          "🎨 Plus d'infos Design",
          "📊 Marketing Digital détails",
        ],
        actions: [
          {
            label: "Voir nos Réalisations",
            action: () => showPortfolio(),
            icon: Star,
            type: "primary",
          },
        ],
      };
    }

    // Contact/rendez-vous
    if (
      lowerQuery.includes("rendez-vous") ||
      lowerQuery.includes("appel") ||
      lowerQuery.includes("contact") ||
      lowerQuery.includes("rencontrer")
    ) {
      return {
        response: `# 📞 Prendre Rendez-vous

Parfait ! Nous adorons rencontrer nos futurs clients et discuter de leurs projets.

## 📅 **Options de Contact :**

**🎯 Consultation Gratuite (30min)**
• Analyse de vos besoins
• Conseils personnalisés  
• Estimation de budget
• Planning projet

**📞 Contact Direct :**
• **Téléphone :** +226 54191605
• **WhatsApp :** +226 54191605  
• **Email :** contact@mindgraphix.com

**📍 Bureau :**
Mind Graphix Solution  
Ouagadougou, Burkina Faso  
(Rendez-vous sur demande)

## ⏰ **Disponibilités :**
• **Lundi - Vendredi :** 8h - 18h
• **Samedi :** 9h - 15h (sur rendez-vous)
• **Réponse email :** Sous 2h en moyenne

Quel mode de contact préférez-vous ?`,
        category: "contact",
        quickReplies: [
          "📞 Appeler maintenant",
          "💬 WhatsApp",
          "📧 Email détaillé",
        ],
        actions: [
          {
            label: "Formulaire Contact",
            action: () => setShowContactForm(true),
            icon: Mail,
            type: "primary",
          },
        ],
      };
    }

    // Réalisations/portfolio
    if (
      lowerQuery.includes("réalisation") ||
      lowerQuery.includes("exemple") ||
      lowerQuery.includes("portfolio") ||
      lowerQuery.includes("travail")
    ) {
      return {
        response: `# 🏆 Nos Réalisations

Découvrez quelques-unes de nos **+50 réalisations** qui ont fait la différence pour nos clients !

## 🌐 **Sites Web Récents :**
• **E-commerce Textile** - Boutique mode burkinabé (2024)
• **Site Corporate** - Entreprise BTP à Ouagadougou  
• **Plateforme Formation** - Institut privé avec LMS
• **Site Restaurant** - Chaîne locale avec commande en ligne

## 🎨 **Identités Visuelles :**
• **Startup Tech** - Logo + Charte complète
• **ONG Locale** - Branding pour campagne nationale
• **Boutique Bio** - Packaging produits naturels
• **Salon de Coiffure** - Supports print + digital

## 📊 **Succès Marketing :**
• **+300% trafic web** pour un e-commerce  
• **x5 followers** sur réseaux sociaux (6 mois)
• **ROI 450%** sur campagnes Google Ads
• **-50% coût acquisition** client via SEO

## 🎯 **Témoignages Clients :**
⭐⭐⭐⭐⭐ *"Professional et à l'écoute ! Notre site a dépassé nos attentes"* - **Aminata S.**

⭐⭐⭐⭐⭐ *"Design magnifique et service après-vente impeccable"* - **Ibrahim T.**

Souhaitez-vous voir des exemples spécifiques à votre secteur ?`,
        category: "service",
        quickReplies: [
          "🌐 Exemples sites web",
          "🎨 Portfolio design",
          "📈 Cas marketing",
        ],
      };
    }

    // Question générale
    return {
      response: `# 🤖 Assistant MindiBot

J'ai bien reçu votre message : **"${query}"**

Je suis là pour vous aider avec toutes vos questions sur **Mind Graphix Solution** !

## 🎯 **Je peux vous renseigner sur :**

**💼 Nos Services**
• Développement Web & Applications
• Design Graphique & Identité Visuelle  
• Marketing Digital & Réseaux Sociaux

**💰 Tarifs & Devis**
• Estimation gratuite de votre projet
• Devis détaillé sous 48h
• Options de paiement flexibles

**📞 Contact & Rendez-vous**
• Consultation gratuite 30min
• Rencontre en personne ou visio
• Support technique continu

**🏆 Nos Réalisations**
• +50 projets réussis
• Témoignages clients authentiques
• Portfolio diversifié

Comment puis-je vous aider plus précisément ?`,
      category: "help",
      quickReplies: [
        "💰 Demander un devis",
        "📞 Prendre rendez-vous",
        "🎨 Voir vos services",
        "📋 Vos réalisations",
      ],
    };
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    addUserMessage(currentMessage);
    const analysis = analyzeClientQuery(currentMessage);
    setCurrentMessage("");

    setTimeout(() => {
      addBotMessage(
        analysis.response,
        analysis.category,
        analysis.quickReplies,
        analysis.actions,
      );
    }, 500);
  };

  const handleQuickReply = (reply: string) => {
    addUserMessage(reply);
    const analysis = analyzeClientQuery(reply);

    setTimeout(() => {
      addBotMessage(
        analysis.response,
        analysis.category,
        analysis.quickReplies,
        analysis.actions,
      );
    }, 800);
  };

  const showServices = () => {
    addBotMessage(
      `# 🎯 Services Détaillés

**Choisissez le service qui vous intéresse :**

🌐 **Sites Web & Applications**
• Sites vitrines professionnels
• E-commerce clé en main
• Applications métier
• Maintenance & hosting

🎨 **Design & Création**  
• Logo & identité visuelle
• Supports print (cartes, brochures)
• Design réseaux sociaux
• Packaging & PLV

📊 **Marketing Digital**
• Stratégie digitale complète
• Gestion réseaux sociaux
• SEO & référencement Google
• Campagnes publicitaires

Quel service vous intéresse le plus ?`,
      "service",
      ["🌐 Web & Applications", "🎨 Design & Création", "📊 Marketing Digital"],
    );
  };

  const showContact = () => {
    addBotMessage(
      `# 📞 Contactez-nous Directement

**Plusieurs moyens de nous joindre :**

📱 **Téléphone :** +226 54191605  
�� **Email :** contact@mindgraphix.com  
💬 **WhatsApp :** +226 54191605

📍 **Adresse :**  
Mind Graphix Solution  
Ouagadougou, Burkina Faso

⏰ **Horaires :**  
Lundi - Vendredi : 8h - 18h  
Samedi : 9h - 15h (sur RDV)

Nous répondons généralement sous 2h !`,
      "contact",
      ["📞 Appeler maintenant", "📧 Envoyer un email", "💬 WhatsApp"],
    );
  };

  const showPortfolio = () => {
    addBotMessage(
      `# 🏆 Portfolio Mind Graphix

**Nos Réalisations par Catégorie :**

🌐 **Sites Web (15+ projets)**
• E-commerce mode & textile
• Sites corporate & institutionnels  
• Plateformes éducatives
• Sites restaurants & services

🎨 **Identités Visuelles (20+ créations)**
• Startups tech burkinabés
• ONGs & associations
• Commerces locaux
• Événements & festivals

📊 **Campagnes Marketing (10+ succès)**
• +300% trafic e-commerce
• x5 croissance réseaux sociaux
• ROI 450% Google Ads
• Stratégies SEO gagnantes

Souhaitez-vous voir des exemples spécifiques ?`,
      "service",
      ["🌐 Sites web", "🎨 Design", "📊 Marketing", "📞 Discuter projet"],
    );
  };

  const getCategoryIcon = (category?: ClientMessage["category"]) => {
    switch (category) {
      case "info":
        return <Info className="text-blue-500" size={16} />;
      case "service":
        return <Package className="text-purple-500" size={16} />;
      case "contact":
        return <Phone className="text-green-500" size={16} />;
      case "help":
        return <HelpCircle className="text-orange-500" size={16} />;
      case "pricing":
        return <CreditCard className="text-red-500" size={16} />;
      default:
        return <Bot className="text-gray-500" size={16} />;
    }
  };

  const getCategoryColor = (category?: ClientMessage["category"]) => {
    switch (category) {
      case "info":
        return "border-blue-200 bg-blue-50";
      case "service":
        return "border-purple-200 bg-purple-50";
      case "contact":
        return "border-green-200 bg-green-50";
      case "help":
        return "border-orange-200 bg-orange-50";
      case "pricing":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  // MindiBot s'affiche pour tous les utilisateurs

  return (
    <>
      {/* Bouton flottant MindiBot */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="group relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 hover:from-purple-400 hover:via-pink-400 hover:to-red-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          title="MindiBot - Assistant Client"
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>

          {/* Contenu principal - Version boule */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative">
              <MessageCircle
                size={24}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Effet hover shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        </motion.button>
      </motion.div>

      {/* Interface MindiBot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] m-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <MessageCircle size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <span>MindiBot</span>
                        <span className="text-lg">🤖</span>
                      </h2>
                      <p className="text-emerald-100">
                        Assistant Client Mind Graphix Solution
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm opacity-90">Burkina Faso 🇧🇫</div>
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
                        className={`max-w-3xl p-4 rounded-2xl ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
                            : `${getCategoryColor(message.category)} border`
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {message.type === "bot" && (
                            <div className="flex-shrink-0 mt-1">
                              {getCategoryIcon(message.category)}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="prose prose-sm max-w-none">
                              <div className="whitespace-pre-wrap leading-relaxed">
                                {message.content}
                              </div>
                            </div>

                            {message.quickReplies &&
                              message.quickReplies.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {message.quickReplies.map((reply, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => handleQuickReply(reply)}
                                      className="px-3 py-1 text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full transition-colors"
                                    >
                                      {reply}
                                    </button>
                                  ))}
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
                                      action.type === "primary"
                                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
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

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 border border-gray-200 p-4 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Bot size={16} className="text-emerald-600" />
                          </motion.div>
                          <div className="text-gray-600">MindiBot tape...</div>
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
                      placeholder="Posez votre question à MindiBot..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                      disabled={isTyping}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <MessageCircle size={16} />
                    </div>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 py-3"
                  >
                    <Send size={18} />
                  </Button>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>MindiBot v1.0 - Mind Graphix Solution</span>
                    <span>•</span>
                    <span>Assistant Client Intelligent</span>
                    <span>•</span>
                    <span>Burkina Faso 🇧🇫</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Disponible 24/7</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulaire de contact modal */}
      {showContactForm && (
        <motion.div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowContactForm(false)}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full m-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">📞 Demande de Contact</h3>
            <div className="space-y-3 text-sm">
              <p>
                <strong>Téléphone :</strong> +226 54191605
              </p>
              <p>
                <strong>Email :</strong> contact@mindgraphix.com
              </p>
              <p>
                <strong>WhatsApp :</strong> +226 54191605
              </p>
              <p className="text-gray-600">
                Nous vous recontacterons sous 2h !
              </p>
            </div>
            <Button
              onClick={() => setShowContactForm(false)}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
            >
              Compris !
            </Button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ClientAssistantBot;
