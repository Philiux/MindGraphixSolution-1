import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Brain,
  Sparkles,
  Zap,
  Eye,
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Star,
  Lightbulb,
  Palette,
  Monitor,
  FileText,
  Wand2,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  aiAnalysis?: {
    sentiment: "positive" | "neutral" | "negative";
    intent: string;
    confidence: number;
  };
}

interface FuturisticAIBotProps {
  isOpen: boolean;
  onToggle: () => void;
  onServiceRequest?: (service: string) => void;
}

const FuturisticAIBot: React.FC<FuturisticAIBotProps> = ({
  isOpen,
  onToggle,
  onServiceRequest,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [botPersonality, setBotPersonality] = useState("professional");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Messages d'introduction
  const introMessages = [
    {
      id: "1",
      type: "bot" as const,
      content:
        "🚀 Salut ! Je suis MGS IA, votre assistant créatif intelligent chez Mind Graphix Solution. J'analyse vos besoins avec précision pour vous connecter à nos designers experts. Prêt à créer quelque chose d'exceptionnel ?",
      timestamp: new Date(),
      suggestions: [
        "Créer un logo professionnel",
        "Développer un site web",
        "Design print premium",
        "Voir nos réalisations",
      ],
    },
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages(introMessages);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const analyzeMessage = (message: string) => {
    // Simulation d'analyse IA
    const positiveWords = [
      "excellent",
      "parfait",
      "génial",
      "super",
      "merci",
      "oui",
    ];
    const negativeWords = [
      "problème",
      "erreur",
      "non",
      "difficile",
      "impossible",
    ];

    const words = message.toLowerCase().split(" ");
    const hasPositive = words.some((word) => positiveWords.includes(word));
    const hasNegative = words.some((word) => negativeWords.includes(word));

    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    if (hasPositive && !hasNegative) sentiment = "positive";
    if (hasNegative && !hasPositive) sentiment = "negative";

    // Détection d'intention
    let intent = "general";
    if (words.some((w) => ["logo", "identité", "marque"].includes(w)))
      intent = "logo_design";
    if (words.some((w) => ["site", "web", "internet"].includes(w)))
      intent = "website";
    if (
      words.some((w) =>
        [
          "affiche",
          "flyer",
          "brochure",
          "print",
          "impression",
          "carte",
        ].includes(w),
      )
    )
      intent = "print_design";
    if (words.some((w) => ["branding", "charte", "guideline"].includes(w)))
      intent = "branding";
    if (words.some((w) => ["prix", "coût", "devis", "tarif"].includes(w)))
      intent = "pricing";
    if (words.some((w) => ["contact", "email", "téléphone"].includes(w)))
      intent = "contact";

    return {
      sentiment,
      intent,
      confidence: Math.random() * 0.3 + 0.7, // 70-100%
    };
  };

  const getPrintDesignResponse = (message: string, context: any) => {
    if (context.isFirstInteraction) {
      return {
        content:
          "🖨️ Fantastique ! Nos graphistes experts créent des supports print exceptionnels. Ils maîtrisent parfaitement les contraintes d'impression et utilisent des outils avancés pour optimiser les couleurs. Quel type de support vous intéresse ?",
        suggestions: [
          "Affiches publicitaires",
          "Brochures commerciales",
          "Cartes de visite premium",
          "Flyers événements",
          "Packaging produit",
          "Voir portfolio print",
        ],
      };
    } else if (!context.hasIndustry) {
      return {
        content:
          "🎨 Excellent choix ! Dans quel secteur évoluez-vous ? Nos graphistes adaptent le style selon votre domaine pour maximiser l'impact visuel de vos supports.",
        suggestions: [
          "Événementiel",
          "Commerce/Retail",
          "Santé/Médical",
          "Technologie",
          "Restauration",
          "Services professionnels",
        ],
      };
    } else if (context.urgency === "high") {
      return {
        content:
          "⚡ Je comprends l'urgence ! Nos graphistes ont l'habitude des délais serrés. Ils peuvent créer des supports exceptionnels rapidement. Quel est votre délai exact ?",
        suggestions: [
          "Dans 2-3 jours",
          "Cette semaine",
          "Avant le weekend",
          "Express 24h",
          "Parler directement au graphiste",
        ],
      };
    } else {
      return {
        content:
          "✨ Parfait ! Nos graphistes vont créer quelque chose d'exceptionnel. Avez-vous des éléments visuels existants (logo, photos) ou faut-il tout créer ?",
        suggestions: [
          "J'ai déjà un logo",
          "Créer logo + support",
          "J'ai des photos",
          "Création complète",
          "Voir exemples similaires",
        ],
      };
    }
  };

  const getBrandingResponse = (message: string, context: any) => {
    if (context.businessSize === "small") {
      return {
        content:
          "⭐ Parfait pour une startup ! Nos designers créent des identités fortes qui marquent les esprits. Ils comprennent les enjeux des jeunes entreprises et proposent des solutions évolutives. Vous avez déjà un nom/concept ?",
        suggestions: [
          "J'ai le nom",
          "Besoin d'aide naming",
          "Concept défini",
          "Tout à créer",
          "Voir identités startup",
          "Budget startup",
        ],
      };
    } else if (context.experienceLevel === "experienced") {
      return {
        content:
          "🚀 Excellent ! Vous connaissez l'importance d'une identité forte. Nos designers senior vont créer quelque chose qui dépasse vos attentes. S'agit-il d'une refonte ou d'une extension ?",
        suggestions: [
          "Refonte complète",
          "Evolution identité",
          "Extension gamme",
          "Nouveau positionnement",
          "Voir refontes réalisées",
        ],
      };
    } else {
      return {
        content:
          "✨ L'identité de marque est notre spécialité ! Nos designers créent des univers visuels cohérents qui racontent votre histoire. Vous souhaitez une approche complète ou ciblée ?",
        suggestions: [
          "Identité complète",
          "Logo + charte",
          "Charte existante",
          "Applications spécifiques",
          "Voir portfolio branding",
        ],
      };
    }
  };

  const getConversationContext = () => {
    const recentMessages = messages.slice(-6); // Derniers 6 messages
    const userMessages = recentMessages
      .filter((m) => m.type === "user")
      .map((m) => m.content.toLowerCase());
    return {
      hasCompanyName: userMessages.some(
        (msg) =>
          msg.includes("entreprise") ||
          msg.includes("société") ||
          msg.includes("nom") ||
          msg.includes("appelle"),
      ),
      hasBudget: userMessages.some(
        (msg) =>
          msg.includes("budget") ||
          msg.includes("prix") ||
          msg.includes("coût") ||
          msg.includes("€"),
      ),
      hasDeadline: userMessages.some(
        (msg) =>
          msg.includes("délai") ||
          msg.includes("urgent") ||
          msg.includes("quand"),
      ),
      hasIndustry: userMessages.some(
        (msg) =>
          msg.includes("secteur") ||
          msg.includes("domaine") ||
          msg.includes("activité") ||
          msg.includes("technologie") ||
          msg.includes("santé"),
      ),
      isFirstInteraction: messages.length <= 2,
      hasServiceType: userMessages.some(
        (msg) =>
          msg.includes("logo") ||
          msg.includes("site") ||
          msg.includes("affiche") ||
          msg.includes("brochure"),
      ),
    };
  };

  const getLogoDesignResponse = (message: string, context: any) => {
    if (context.isFirstInteraction || !context.hasCompanyName) {
      return {
        content:
          "🎨 Parfait ! Nos designers experts vont créer un logo unique pour vous. Notre équipe combine talent artistique et outils d'analyse pour des résultats exceptionnels. Pour commencer, quel est le nom de votre entreprise ?",
        suggestions: [
          "Mon entreprise s'appelle...",
          "C'est une startup",
          "C'est une grande entreprise",
          "Voir des exemples de logos",
        ],
      };
    } else if (!context.hasIndustry) {
      return {
        content:
          "✨ Excellent ! Maintenant, dans quel secteur d'activité évoluez-vous ? Nos designers adaptent le style selon votre domaine pour maximiser l'impact.",
        suggestions: [
          "Technologie",
          "Santé/Médical",
          "Finance",
          "E-commerce",
          "Restauration",
          "Autre secteur",
        ],
      };
    } else if (!context.hasBudget) {
      return {
        content:
          "🎯 Parfait ! Nos designers ont une excellente compréhension de votre secteur. Quel budget avez-vous prévu pour votre logo ? Cela nous aide à proposer la formule la plus adaptée.",
        suggestions: [
          "Moins de 1000€",
          "1000€ - 3000€",
          "3000€ - 5000€",
          "Plus de 5000€",
          "À discuter",
        ],
      };
    } else {
      return {
        content:
          "🚀 Excellent ! J'ai toutes les infos pour que nos designers commencent. Souhaitez-vous voir notre portfolio de logos ou directement remplir le brief créatif détaillé ?",
        suggestions: [
          "Voir le portfolio",
          "Commencer le brief",
          "Parler à un designer",
          "Demander un devis",
        ],
      };
    }
  };

  const getWebsiteResponse = (message: string, context: any) => {
    if (context.isFirstInteraction) {
      return {
        content:
          "🌐 Excellent choix ! Nos développeurs et designers web créent des sites exceptionnels. Nous utilisons des outils d'analyse pour optimiser l'UX, mais c'est notre équipe humaine qui donne vie à votre vision. Quel type de site souhaitez-vous ?",
        suggestions: [
          "Site vitrine",
          "E-commerce",
          "Portfolio",
          "Blog/Magazine",
          "Application web",
          "Refonte existant",
        ],
      };
    } else if (!context.hasIndustry) {
      return {
        content:
          "🎯 Super ! Dans quel domaine d'activité êtes-vous ? Nos designers web adaptent l'approche selon votre secteur pour maximiser les conversions.",
        suggestions: [
          "Commerce/E-commerce",
          "Services professionnels",
          "Créatif/Artistique",
          "Technologie",
          "Santé",
          "Autre",
        ],
      };
    } else if (!context.hasBudget) {
      return {
        content:
          "�� Nos développeurs vont créer quelque chose d'exceptionnel. Quel budget avez-vous prévu ? Cela nous aide à définir les fonctionnalités optimales.",
        suggestions: [
          "3000€ - 8000€",
          "8000€ - 15000€",
          "15000€ - 30000€",
          "Plus de 30000€",
          "À discuter",
        ],
      };
    } else {
      return {
        content:
          "⚡ Parfait ! Avez-vous des fonctionnalités spécifiques en tête ? (réservation, paiement, blog, etc.)",
        suggestions: [
          "Système de réservation",
          "Paiement en ligne",
          "Espace membre",
          "Blog intégré",
          "Multilingue",
          "Voir le portfolio web",
        ],
      };
    }
  };

  const getPricingResponse = (message: string, context: any) => {
    return {
      content:
        "💰 Nos tarifs sont transparents et adaptés à chaque projet. Nos designers évaluent chaque demande individuellement pour proposer le meilleur rapport qualité-prix. Quel service vous intéresse spécifiquement ?",
      suggestions: [
        "Logo design",
        "Site web",
        "Design print",
        "Branding complet",
        "Devis personnalisé",
        "Voir grille tarifaire",
      ],
    };
  };

  const getContactResponse = (message: string, context: any) => {
    return {
      content:
        "📞 Notre équipe est là pour vous ! Vous pouvez parler directement avec un de nos designers ou démarrer votre projet en ligne. Que préférez-vous ?",
      suggestions: [
        "Parler à un designer",
        "Appel téléphonique",
        "Commencer mon projet",
        "Envoyer un email",
        "Chat en direct",
      ],
    };
  };

  const getGeneralResponse = (message: string, context: any) => {
    const greetings = ["bonjour", "salut", "hello", "bonsoir", "hi"];
    const isGreeting = greetings.some((greeting) =>
      message.toLowerCase().includes(greeting),
    );

    if (isGreeting) {
      return {
        content:
          "👋 Bonjour ! Je suis MGS IA, votre assistant créatif intelligent chez Mind Graphix Solution. J'analyse vos besoins avec précision pour vous connecter à nos designers experts qui créent des projets exceptionnels. Comment puis-je transformer votre vision en réalité ?",
        suggestions: [
          "Créer un logo professionnel",
          "Développer un site web",
          "Design print premium",
          "Identité de marque complète",
          "Voir nos réalisations",
          "Parler à un expert",
        ],
      };
    }

    // Analyse contextuelle avancée pour les réponses générales
    if (context.emotionalTone === "positive") {
      return {
        content:
          "🚀 J'adore votre enthousiasme ! Nos designers vont canaliser cette énergie pour créer quelque chose d'extraordinaire. Mon analyse indique que vous avez une vision claire. Quel projet vous passionne le plus ?",
        suggestions: [
          "Logo qui marque",
          "Site web innovant",
          "Print percutant",
          "Branding mémorable",
          "Voir créations inspirantes",
        ],
      };
    }

    if (context.urgency === "high") {
      return {
        content:
          "⚡ Je détecte une urgence ! Nos designers sont habitués aux défis temporels. Ils excellent sous pression et peuvent créer des résultats exceptionnels rapidement. Quel est votre projet prioritaire ?",
        suggestions: [
          "Logo express",
          "Site web rapide",
          "Print urgent",
          "Solution immédiate",
          "Parler directement",
        ],
      };
    }

    if (context.businessSize === "small") {
      return {
        content:
          "🌱 Startup ou petite entreprise ? Parfait ! Nos designers comprennent vos enjeux et créent des solutions évolutives avec un excellent ROI. Quel est votre défi créatif principal ?",
        suggestions: [
          "Logo startup",
          "Site MVP",
          "Print budget maîtrisé",
          "Identité évolutive",
          "Solutions startup",
        ],
      };
    }

    return {
      content:
        "🧠 Mon analyse de votre message révèle des besoins créatifs passionnants ! Nos designers experts vont transformer vos idées en réalisations extraordinaires. Quel univers créatif souhaitez-vous explorer ?",
      suggestions: [
        "Création de logo",
        "Développement web",
        "Design graphique",
        "Stratégie de marque",
        "Innovation visuelle",
        "Voir portfolio",
      ],
    };
  };

  const generateBotResponse = async (userMessage: string, analysis: any) => {
    // Utilisation du système contextuel intelligent
    const context = getConversationContext();
    const intent = analysis.intent;

    // Analyse avancée du message pour une compréhension extraordinaire
    const advancedAnalysis = analyzeMessageAdvanced(userMessage, context);

    // Réponses contextuelles selon l'intention et l'historique
    if (intent === "logo_design") {
      return getLogoDesignResponse(userMessage, {
        ...context,
        ...advancedAnalysis,
      });
    } else if (intent === "website") {
      return getWebsiteResponse(userMessage, {
        ...context,
        ...advancedAnalysis,
      });
    } else if (intent === "print_design") {
      return getPrintDesignResponse(userMessage, {
        ...context,
        ...advancedAnalysis,
      });
    } else if (intent === "branding") {
      return getBrandingResponse(userMessage, {
        ...context,
        ...advancedAnalysis,
      });
    } else if (intent === "pricing") {
      return getPricingResponse(userMessage, {
        ...context,
        ...advancedAnalysis,
      });
    } else if (intent === "contact") {
      return getContactResponse(userMessage, {
        ...context,
        ...advancedAnalysis,
      });
    } else {
      return getGeneralResponse(userMessage, {
        ...context,
        ...advancedAnalysis,
      });
    }
  };

  const analyzeMessageAdvanced = (message: string, context: any) => {
    const words = message.toLowerCase().split(" ");

    // Analyse du sentiment pour cette fonction
    const positiveWords = [
      "excellent",
      "parfait",
      "génial",
      "super",
      "merci",
      "oui",
    ];
    const negativeWords = [
      "problème",
      "erreur",
      "non",
      "difficile",
      "impossible",
    ];
    const hasPositive = words.some((word) => positiveWords.includes(word));
    const hasNegative = words.some((word) => negativeWords.includes(word));
    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    if (hasPositive && !hasNegative) sentiment = "positive";
    if (hasNegative && !hasPositive) sentiment = "negative";

    return {
      urgency: words.some((w) =>
        ["urgent", "rapidement", "vite", "pressé"].includes(w),
      )
        ? "high"
        : words.some((w) => ["semaine", "mois"].includes(w))
          ? "medium"
          : "low",
      businessSize: words.some((w) => ["startup", "pme", "petite"].includes(w))
        ? "small"
        : words.some((w) => ["grande", "groupe", "corporation"].includes(w))
          ? "large"
          : "medium",
      experienceLevel: words.some((w) =>
        ["première", "jamais", "nouveau"].includes(w),
      )
        ? "beginner"
        : words.some((w) => ["déjà", "avant", "expérience"].includes(w))
          ? "experienced"
          : "medium",
      emotionalTone: sentiment,
      specificNeeds: extractSpecificNeeds(words),
      technicalLevel: words.some((w) =>
        ["technique", "api", "code", "développement"].includes(w),
      )
        ? "high"
        : "low",
    };
  };

  const extractSpecificNeeds = (words: string[]) => {
    const needs = [];
    if (words.some((w) => ["moderne", "contemporain", "actuel"].includes(w)))
      needs.push("modern");
    if (
      words.some((w) => ["professionnel", "sérieux", "corporate"].includes(w))
    )
      needs.push("professional");
    if (words.some((w) => ["créatif", "original", "unique"].includes(w)))
      needs.push("creative");
    if (words.some((w) => ["simple", "épuré", "minimaliste"].includes(w)))
      needs.push("minimalist");
    if (words.some((w) => ["coloré", "vibrant", "dynamique"].includes(w)))
      needs.push("vibrant");
    return needs;
  };

  const getOldResponses = (analysis: { intent: string }) => {
    const responses = {
      logo_design: [
        "🎨 Parfait ! Nos designers experts vont créer un logo unique pour vous. Ils utilisent des outils d'analyse avancés pour comprendre votre secteur et créer des propositions personnalisées. Quel est le nom de votre entreprise ?",
        "✨ Excellente idée ! Notre équipe de designers talentueux crée des logos innovants. Ils analysent votre marché pour proposer des concepts uniques. Parlez-moi de votre projet !",
      ],
      website: [
        "🌐 Fantastique ! Nos développeurs et designers web créent des sites exceptionnels. Ils utilisent des outils d'analyse pour optimiser l'UX selon votre secteur. Quel type de site envisagez-vous ?",
        "🚀 Super choix ! Notre équipe crée des sites web qui maximisent l'engagement. Nos designers analysent votre secteur pour proposer la meilleure approche. Décrivez-moi votre vision !",
      ],
      pricing: [
        "💰 Nos tarifs sont transparents et adaptés à votre projet. Nos experts évaluent chaque demande pour proposer le prix optimal selon vos besoins. Voulez-vous un devis personnalisé ?",
        "📊 Excellente question ! Notre équipe analyse chaque projet pour proposer le meilleur rapport qualité-prix. Quel service vous intéresse ?",
      ],
      contact: [
        "📞 Nous sommes là pour vous ! Vous pouvez nous contacter directement ou commencer un projet maintenant. Que préférez-vous ?",
        "✉��� Perfect ! Notre équipe est disponible 24/7. Souhaitez-vous planifier un appel ou poser votre question ici ?",
      ],
      general: [
        "🤖 Je suis là pour vous connecter avec nos experts ! Notre équipe de designers talentueux crée des solutions parfaites. Que puis-je créer pour vous aujourd'hui ?",
        "⚡ Dites-moi tout ! Je vais analyser vos besoins pour vous proposer les meilleures solutions créatives de notre équipe.",
        "🎯 Excellent ! Nos designers combinent créativité et outils intelligents. Quel défi créatif puis-je confier à notre équipe pour vous ?",
      ],
    };

    const responseOptions =
      responses[analysis.intent as keyof typeof responses] || responses.general;
    const selectedResponse =
      responseOptions[Math.floor(Math.random() * responseOptions.length)];

    const suggestions = {
      logo_design: [
        "Voir des exemples",
        "Commencer le brief",
        "Parler à un designer",
        "Quel est votre secteur ?",
      ],
      website: [
        "Types de sites",
        "Voir portfolio",
        "Demander un devis",
        "Quel est votre budget ?",
      ],
      print_design: [
        "Voir exemples print",
        "Affiches",
        "Brochures",
        "Cartes de visite",
        "Quel type de support ?",
      ],
      branding: [
        "Voir portfolio branding",
        "Identité complète",
        "Charte graphique",
        "Parler à un designer",
      ],
      pricing: [
        "Devis gratuit",
        "Voir nos tarifs",
        "Planifier un appel",
        "Quel service vous intéresse ?",
      ],
      contact: [
        "Nous appeler",
        "Envoyer un email",
        "Chat direct",
        "Planifier un RDV",
      ],
      general: [
        "Créer un logo",
        "Site web",
        "Design print",
        "Identité de marque",
        "Nos services",
      ],
    };

    return {
      content: selectedResponse,
      suggestions:
        suggestions[analysis.intent as keyof typeof suggestions] ||
        suggestions.general,
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Analyse IA du message
    const analysis = analyzeMessage(inputMessage);

    // Délai réaliste de traitement
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000),
    );

    const botResponse = await generateBotResponse(inputMessage, analysis);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: botResponse.content,
      timestamp: new Date(),
      suggestions: botResponse.suggestions,
      aiAnalysis: analysis,
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    // Créer directement le message utilisateur avec la suggestion
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: suggestion,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Analyse IA du message
    const analysis = analyzeMessage(suggestion);

    // Délai réaliste de traitement
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000),
    );

    const botResponse = await generateBotResponse(suggestion, analysis);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: botResponse.content,
      timestamp: new Date(),
      suggestions: botResponse.suggestions,
      aiAnalysis: analysis,
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const toggleVoiceRecording = () => {
    setIsListening(!isListening);
    // Simulation de reconnaissance vocale
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("Je voudrais créer un logo pour mon entreprise");
      }, 2000);
    }
  };

  const getPersonalityColor = () => {
    const colors = {
      professional: "from-blue-500 to-cyan-500",
      creative: "from-purple-500 to-pink-500",
      friendly: "from-green-500 to-emerald-500",
    };
    return colors[botPersonality as keyof typeof colors];
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${getPersonalityColor()} shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden`}
          title="Ouvrir le chat IA"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>

          {/* Pulse animation */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-white/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      }`}
    >
      <Card className="h-full flex flex-col overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <CardHeader
          className={`p-4 bg-gradient-to-r ${getPersonalityColor()} text-white relative overflow-hidden`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Brain className="w-8 h-8" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">MGS IA</h3>
                <div className="flex items-center gap-1 text-xs opacity-90">
                  <Zap className="w-3 h-3" />
                  <span>Intelligence Créative</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                className="text-white hover:bg-white/20"
                title={isMinimized ? "Agrandir le chat" : "Réduire le chat"}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle();
                }}
                className="text-white hover:bg-white/20"
                title="Fermer le chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Neural network background */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="flex-1 p-0 bg-gray-900 text-white overflow-hidden">
              <div
                ref={chatContainerRef}
                className="h-full overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              >
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}
                      >
                        {message.type === "bot" && (
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-r ${getPersonalityColor()} flex items-center justify-center`}
                            >
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs text-gray-400">
                              MGS IA
                            </span>
                            {message.aiAnalysis && (
                              <Badge
                                className={`text-xs ${
                                  message.aiAnalysis.sentiment === "positive"
                                    ? "bg-green-500"
                                    : message.aiAnalysis.sentiment ===
                                        "negative"
                                      ? "bg-red-500"
                                      : "bg-gray-500"
                                }`}
                              >
                                {Math.round(
                                  message.aiAnalysis.confidence * 100,
                                )}
                                %
                              </Badge>
                            )}
                          </div>
                        )}

                        <div
                          className={`p-3 rounded-2xl ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-primary to-accent text-white ml-4"
                              : "bg-gray-800 border border-gray-700"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {message.content}
                          </p>
                          {message.type === "user" && (
                            <div className="text-xs opacity-75 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          )}
                        </div>

                        {message.suggestions && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-2 mt-2"
                          >
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                                className="text-xs bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${getPersonalityColor()} flex items-center justify-center`}
                      >
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-800 border border-gray-700 p-3 rounded-2xl">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">
                            MGS IA analyse...
                          </span>
                          <motion.div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-1.5 h-1.5 bg-primary rounded-full"
                                animate={{
                                  y: [0, -8, 0],
                                  opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Tapez votre message..."
                    className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleVoiceRecording}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 ${
                      isListening
                        ? "text-red-500 animate-pulse"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className={`bg-gradient-to-r ${getPersonalityColor()} hover:scale-105 transition-all duration-200`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick actions intelligentes */}
              <div className="flex gap-2 mt-2 overflow-x-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleSuggestionClick("Je veux créer un logo professionnel")
                  }
                  className="text-xs bg-gray-900 border-gray-600 text-gray-300 hover:bg-gray-700 whitespace-nowrap"
                >
                  <Palette className="w-3 h-3 mr-1" />
                  Logo Pro
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleSuggestionClick(
                      "Je veux développer un site web moderne",
                    )
                  }
                  className="text-xs bg-gray-900 border-gray-600 text-gray-300 hover:bg-gray-700 whitespace-nowrap"
                >
                  <Monitor className="w-3 h-3 mr-1" />
                  Site Web
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleSuggestionClick("Je veux créer des supports print")
                  }
                  className="text-xs bg-gray-900 border-gray-600 text-gray-300 hover:bg-gray-700 whitespace-nowrap"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleSuggestionClick("Je veux un devis personnalisé")
                  }
                  className="text-xs bg-gray-900 border-gray-600 text-gray-300 hover:bg-gray-700 whitespace-nowrap"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Devis
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default FuturisticAIBot;
