import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Brain,
  Sparkles,
  Wand2,
  Eye,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Star,
  RefreshCw,
  Download,
  Zap,
  User,
} from "lucide-react";
import {
  LogoDesignData,
  ColorPreference,
  LogoType,
  LogoStyle,
  BrandPersonality,
} from "@/types/specializedServices";
import { useToast } from "@/hooks/use-toast";

interface LogoDesignFormProps {
  onSubmit: (data: LogoDesignData) => void;
  onBack?: () => void;
}

const LogoDesignForm: React.FC<LogoDesignFormProps> = ({
  onSubmit,
  onBack,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<LogoDesignData>>({
    serviceType: "logo-design",
    logoType: "combination",
    colorPreferences: [],
    style: [],
    brandPersonality: [],
    variations: [],
    usageContext: [],
    includeText: true,
    clientInfo: {
      firstName: "",
      email: "",
      lastName: "",
      phone: "",
      company: "",
    },
  });

  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<number | null>(null);

  const totalSteps = 5; // 1: Base info, 2: IA analysis, 3: Creative preferences, 4: Client info, 5: Finalisation

  // Palettes de couleurs suggérées par IA
  const aiColorPalettes = [
    {
      name: "Tech Moderne",
      colors: ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"],
      mood: "professional",
      description: "Bleu tech professionnel, inspire confiance et innovation",
    },
    {
      name: "Nature Premium",
      colors: ["#059669", "#10B981", "#34D399", "#6EE7B7"],
      mood: "natural",
      description: "Vert nature, évoque croissance et durabilité",
    },
    {
      name: "Luxe Élégant",
      colors: ["#7C2D12", "#DC2626", "#EF4444", "#F87171"],
      mood: "elegant",
      description: "Rouge sophistiqué, pour marques premium",
    },
    {
      name: "Créatif Énergique",
      colors: ["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD"],
      mood: "creative",
      description: "Violet créatif, stimule imagination et originalité",
    },
    {
      name: "Orange Dynamique",
      colors: ["#EA580C", "#FB923C", "#FDBA74", "#FED7AA"],
      mood: "energetic",
      description: "Orange énergique, transmet enthousiasme et optimisme",
    },
    {
      name: "Océan Profond",
      colors: ["#1E3A8A", "#1E40AF", "#3B82F6", "#60A5FA"],
      mood: "professional",
      description: "Bleu océan profond, évoque stabilité et confiance",
    },
    {
      name: "Sunset Tropical",
      colors: ["#F59E0B", "#F97316", "#EF4444", "#EC4899"],
      mood: "vibrant",
      description: "Couleurs de coucher de soleil, chaleur et énergie",
    },
    {
      name: "Forêt Mystique",
      colors: ["#064E3B", "#047857", "#059669", "#10B981"],
      mood: "natural",
      description: "Vert forêt profond, mystère et nature sauvage",
    },
    {
      name: "Lavande Zen",
      colors: ["#6366F1", "#8B5CF6", "#A855F7", "#C084FC"],
      mood: "calm",
      description: "Violet lavande apaisant, sérénité et créativité",
    },
    {
      name: "Monochrome Elite",
      colors: ["#111827", "#374151", "#6B7280", "#9CA3AF"],
      mood: "elegant",
      description: "Nuances de gris sophistiquées, élégance intemporelle",
    },
    {
      name: "Corail Vibrant",
      colors: ["#DC2626", "#EF4444", "#F87171", "#FCA5A5"],
      mood: "energetic",
      description: "Rouge corail éclatant, passion et dynamisme",
    },
    {
      name: "Aqua Fresh",
      colors: ["#0891B2", "#06B6D4", "#22D3EE", "#67E8F9"],
      mood: "fresh",
      description: "Cyan aqua rafraîchissant, modernité et fraîcheur",
    },
    {
      name: "Terre Chaude",
      colors: ["#92400E", "#B45309", "#D97706", "#F59E0B"],
      mood: "warm",
      description: "Tons terreux chaleureux, authenticité et tradition",
    },
    {
      name: "Rose Gold",
      colors: ["#BE185D", "#DB2777", "#EC4899", "#F472B6"],
      mood: "luxury",
      description: "Rose doré premium, féminité et sophistication",
    },
    {
      name: "Cyberpunk Neon",
      colors: ["#7C3AED", "#A855F7", "#C084FC", "#E879F9"],
      mood: "futuristic",
      description: "Néon cyber, technologie futuriste et innovation",
    },
    {
      name: "Automne Doré",
      colors: ["#B45309", "#D97706", "#F59E0B", "#FCD34D"],
      mood: "warm",
      description: "Couleurs d'automne dorées, confort et nostalgie",
    },
    {
      name: "Glacier Arctique",
      colors: ["#1E40AF", "#3B82F6", "#60A5FA", "#DBEAFE"],
      mood: "cool",
      description: "Bleu glacier arctique, pureté et innovation",
    },
    {
      name: "Emeraude Royale",
      colors: ["#065F46", "#047857", "#059669", "#10B981"],
      mood: "luxury",
      description: "Vert émeraude royal, richesse et prestige",
    },
    {
      name: "Flamme Passion",
      colors: ["#991B1B", "#DC2626", "#EF4444", "#F87171"],
      mood: "passionate",
      description: "Rouge flamme ardent, passion et détermination",
    },
    {
      name: "Indigo Mystique",
      colors: ["#312E81", "#3730A3", "#4338CA", "#6366F1"],
      mood: "mysterious",
      description: "Indigo mystique profond, sagesse et spiritualité",
    },
  ];

  // Fonction pour générer des palettes spécifiques à l'industrie
  const generateIndustrySpecificPalettes = (industry: string) => {
    const industryPalettes: { [key: string]: any[] } = {
      technology: [
        {
          name: "Code Matrix",
          colors: ["#00FF41", "#008F11", "#001100", "#003300"],
          mood: "tech",
          description: "Vert matrix cybernétique, innovation digitale",
        },
        {
          name: "Silicon Valley",
          colors: ["#4285F4", "#34A853", "#FBBC05", "#EA4335"],
          mood: "modern",
          description: "Couleurs tech emblématiques, confiance numérique",
        },
      ],
      healthcare: [
        {
          name: "Médical Trust",
          colors: ["#0EA5E9", "#06B6D4", "#E0F7FA", "#FFFFFF"],
          mood: "trustworthy",
          description: "Bleu médical apaisant, soin et confiance",
        },
        {
          name: "Wellness Green",
          colors: ["#10B981", "#34D399", "#A7F3D0", "#ECFDF5"],
          mood: "healing",
          description: "Vert bien-être, santé et régénération",
        },
      ],
      finance: [
        {
          name: "Gold Standard",
          colors: ["#F59E0B", "#D97706", "#92400E", "#451A03"],
          mood: "premium",
          description: "Or prestigieux, richesse et stabilité",
        },
        {
          name: "Corporate Blue",
          colors: ["#1E40AF", "#3B82F6", "#60A5FA", "#DBEAFE"],
          mood: "corporate",
          description: "Bleu corporate, sérieux et fiabilité",
        },
      ],
      education: [
        {
          name: "Academic Excellence",
          colors: ["#7C2D12", "#DC2626", "#FEE2E2", "#FFFFFF"],
          mood: "scholarly",
          description: "Rouge académique, tradition et excellence",
        },
        {
          name: "Learning Growth",
          colors: ["#059669", "#10B981", "#D1FAE5", "#F0FDF4"],
          mood: "growth",
          description: "Vert croissance, apprentissage et développement",
        },
      ],
      food: [
        {
          name: "Organic Fresh",
          colors: ["#84CC16", "#65A30D", "#365314", "#1A2E05"],
          mood: "organic",
          description: "Vert lime bio, fraîcheur et naturel",
        },
        {
          name: "Warm Appetite",
          colors: ["#EA580C", "#DC2626", "#FEF3C7", "#FFFBEB"],
          mood: "appetizing",
          description: "Orange chaleureux, appétit et convivialité",
        },
      ],
    };

    return industryPalettes[industry.toLowerCase()] || [];
  };

  // Exemples de logos par style
  const logoExamples = {
    modern: [
      {
        name: "Apple",
        style: "Minimaliste avec symbol iconic",
        industry: "Technology",
      },
      { name: "Nike", style: "Swoosh simple et mémorable", industry: "Sports" },
      { name: "Spotify", style: "Onde sonore stylisée", industry: "Music" },
    ],
    vintage: [
      {
        name: "Coca-Cola",
        style: "Script classique intemporel",
        industry: "Beverage",
      },
      {
        name: "Harley Davidson",
        style: "Badge emblématique",
        industry: "Automotive",
      },
      {
        name: "Jack Daniels",
        style: "Typographie vintage",
        industry: "Spirits",
      },
    ],
    minimalist: [
      {
        name: "Google",
        style: "Typographie colorée simple",
        industry: "Technology",
      },
      {
        name: "Uber",
        style: "Lettre stylisée épurée",
        industry: "Transportation",
      },
      {
        name: "Airbnb",
        style: "Symbol abstrait mémorable",
        industry: "Travel",
      },
    ],
  };

  const generateAISuggestions = async () => {
    setGeneratingAI(true);

    // Simulation d'analyse IA
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Générer des palettes supplémentaires basées sur l'industrie
    const industryPalettes = generateIndustrySpecificPalettes(
      formData.industry,
    );
    const allPalettes = [...aiColorPalettes, ...industryPalettes];

    // Mélanger les palettes pour plus de variété
    const shuffledPalettes = [...allPalettes].sort(() => Math.random() - 0.5);

    const suggestions = {
      recommendedStyles: ["modern", "minimalist"],
      colorAnalysis: {
        industry: formData.industry,
        suggestedPalettes: shuffledPalettes.slice(0, 6),
        reasoning: `Basé sur l'industrie "${formData.industry}", nous recommandons des couleurs qui évoquent la confiance et l'innovation.`,
      },
      competitorAnalysis: [
        "Évitez les bleus trop communs dans votre secteur",
        "Considérez une approche plus audacieuse avec des couleurs chaudes",
        "La simplicité sera un avantage concurrentiel",
      ],
      logoTypeRecommendation: {
        type: "combination",
        reason: "Parfait équilibre entre reconnaissance et flexibilité d'usage",
      },
    };

    setAiSuggestions(suggestions);
    setGeneratingAI(false);
  };

  const updateFormData = (field: keyof LogoDesignData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addColorPreference = (
    color: string,
    preference: "love" | "like" | "neutral" | "dislike" | "avoid",
  ) => {
    const newPreference: ColorPreference = { color, preference };
    setFormData((prev) => ({
      ...prev,
      colorPreferences: [...(prev.colorPreferences || []), newPreference],
    }));
  };

  const nextStep = () => {
    if (currentStep === 2 && !aiSuggestions) {
      generateAISuggestions();
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateEmail = (
    email: string,
  ): { isValid: boolean; message: string } => {
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail) {
      return { isValid: false, message: "Veuillez saisir une adresse email" };
    }

    // Validation format email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(cleanEmail)) {
      return {
        isValid: false,
        message:
          "Format d'email invalide. Utilisez le format : nom@domaine.com",
      };
    }

    return { isValid: true, message: "" };
  };

  const handleSubmit = () => {
    console.log("🚀 LogoDesignForm - handleSubmit appelé");
    console.log("📋 FormData complet:", formData);
    console.log("👤 ClientInfo détaillé:", formData.clientInfo);
    console.log("🔍 Email:", `"${formData.clientInfo?.email || ""}"`);
    console.log("🔍 FirstName:", `"${formData.clientInfo?.firstName || ""}"`);

    // Valider les informations client requises
    if (!formData.clientInfo?.firstName) {
      console.error(
        "❌ Validation échouée dans LogoDesignForm - Prénom manquant",
      );
      toast({
        title: "Prénom requis",
        description: "Veuillez renseigner votre prénom.",
        variant: "destructive",
      });
      setCurrentStep(4); // Retour à l'étape des infos client
      return;
    }

    // Valider l'email
    const emailValidation = validateEmail(formData.clientInfo?.email || "");
    if (!emailValidation.isValid) {
      console.error("❌ Email invalide");
      toast({
        title: "Email invalide",
        description: emailValidation.message,
        variant: "destructive",
      });
      setCurrentStep(4); // Retour à l'étape des infos client
      return;
    }

    console.log("✅ Validation réussie dans LogoDesignForm, envoi des données");
    onSubmit(formData as LogoDesignData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header avec progression */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold">
            Création de Logo Assistée par IA
          </h2>
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-center text-gray-600">
          Étape {currentStep} sur {totalSteps}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Informations de Base
                </CardTitle>
                <CardDescription>
                  Parlez-nous de votre entreprise et de vos besoins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName || ""}
                      onChange={(e) =>
                        updateFormData("companyName", e.target.value)
                      }
                      placeholder="MGS - Mind Graphix Solution"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Secteur d'activité *</Label>
                    <Select
                      value={formData.industry || ""}
                      onValueChange={(value) =>
                        updateFormData("industry", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">
                          💻 Technologie & IT
                        </SelectItem>
                        <SelectItem value="healthcare">
                          🏥 Santé & Médical
                        </SelectItem>
                        <SelectItem value="finance">
                          💰 Finance & Banque
                        </SelectItem>
                        <SelectItem value="education">
                          🎓 Éducation & Formation
                        </SelectItem>
                        <SelectItem value="retail">
                          🛍️ Commerce & Vente
                        </SelectItem>
                        <SelectItem value="food">
                          🍽️ Alimentation & Restauration
                        </SelectItem>
                        <SelectItem value="fashion">
                          👗 Mode & Textile
                        </SelectItem>
                        <SelectItem value="sports">
                          ⚽ Sport & Fitness
                        </SelectItem>
                        <SelectItem value="creative">
                          🎨 Créatif & Arts
                        </SelectItem>
                        <SelectItem value="consulting">
                          📋 Conseil & Services
                        </SelectItem>
                        <SelectItem value="agriculture">
                          🌾 Agriculture & Élevage
                        </SelectItem>
                        <SelectItem value="construction">
                          🏗️ BTP & Construction
                        </SelectItem>
                        <SelectItem value="automotive">
                          🚗 Automobile & Transport
                        </SelectItem>
                        <SelectItem value="real-estate">
                          🏠 Immobilier
                        </SelectItem>
                        <SelectItem value="tourism">
                          ✈️ Tourisme & Voyage
                        </SelectItem>
                        <SelectItem value="beauty">
                          💄 Beauté & Cosmétique
                        </SelectItem>
                        <SelectItem value="legal">
                          ⚖️ Juridique & Droit
                        </SelectItem>
                        <SelectItem value="media">
                          📺 Médias & Communication
                        </SelectItem>
                        <SelectItem value="environment">
                          🌱 Environnement & Écologie
                        </SelectItem>
                        <SelectItem value="manufacturing">
                          🏭 Industrie & Fabrication
                        </SelectItem>
                        <SelectItem value="energy">
                          ⚡ Énergie & Utilities
                        </SelectItem>
                        <SelectItem value="entertainment">
                          🎭 Divertissement & Loisirs
                        </SelectItem>
                        <SelectItem value="security">
                          🔒 Sécurité & Protection
                        </SelectItem>
                        <SelectItem value="logistics">
                          📦 Logistique & Transport
                        </SelectItem>
                        <SelectItem value="artisanat">
                          🔨 Artisanat & Métiers
                        </SelectItem>
                        <SelectItem value="nonprofit">
                          🤝 ONG & Associations
                        </SelectItem>
                        <SelectItem value="government">
                          🏛️ Public & Administration
                        </SelectItem>
                        <SelectItem value="other">📋 Autre secteur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectName">Nom du projet</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName || ""}
                    onChange={(e) =>
                      updateFormData("projectName", e.target.value)
                    }
                    placeholder="Nouveau logo MGS"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description de votre entreprise *
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description || ""}
                    onChange={(e) =>
                      updateFormData("description", e.target.value)
                    }
                    placeholder="Décrivez votre activité, vos valeurs, ce qui vous rend unique..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Public cible</Label>
                  <Select
                    value={formData.targetAudience || ""}
                    onValueChange={(value) =>
                      updateFormData("targetAudience", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre public cible" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Types d'entreprises */}
                      <SelectItem value="start-ups">
                        🚀 Start-ups & Nouvelles entreprises
                      </SelectItem>
                      <SelectItem value="pme">
                        🏢 PME (Petites et Moyennes Entreprises)
                      </SelectItem>
                      <SelectItem value="grandes-entreprises">
                        🏭 Grandes entreprises & Corporations
                      </SelectItem>
                      <SelectItem value="entrepreneurs">
                        👤 Entrepreneurs individuels
                      </SelectItem>
                      <SelectItem value="freelances">
                        💼 Freelances & Consultants
                      </SelectItem>
                      <SelectItem value="franchises">
                        🔗 Franchises & Réseaux
                      </SelectItem>

                      {/* Secteurs professionnels */}
                      <SelectItem value="professionnels-sante">
                        👨‍⚕️ Professionnels de santé
                      </SelectItem>
                      <SelectItem value="cabinets-avocats">
                        ⚖️ Cabinets d'avocats & Juridique
                      </SelectItem>
                      <SelectItem value="experts-comptables">
                        💼 Experts-comptables & Finance
                      </SelectItem>
                      <SelectItem value="architectes">
                        📐 Architectes & Ingénieurs
                      </SelectItem>
                      <SelectItem value="immobilier">
                        🏠 Agences immobilières
                      </SelectItem>
                      <SelectItem value="agents-assurance">
                        🛡️ Agents d'assurance
                      </SelectItem>

                      {/* Commerce & Services */}
                      <SelectItem value="restaurants">
                        🍽️ Restaurants & Hôtellerie
                      </SelectItem>
                      <SelectItem value="commerce-detail">
                        🛍️ Commerce de détail
                      </SelectItem>
                      <SelectItem value="e-commerce">
                        📱 E-commerce & Vente en ligne
                      </SelectItem>
                      <SelectItem value="salons-beaute">
                        💄 Salons de beauté & Coiffure
                      </SelectItem>
                      <SelectItem value="fitness-bien-etre">
                        💪 Fitness & Bien-être
                      </SelectItem>
                      <SelectItem value="auto-moto">
                        🚗 Garage & Services auto
                      </SelectItem>

                      {/* Éducation & Formation */}
                      <SelectItem value="education">
                        🎓 Éducation & Formation
                      </SelectItem>
                      <SelectItem value="ecoles-privees">
                        🏫 Écoles privées & Crèches
                      </SelectItem>
                      <SelectItem value="centres-formation">
                        📚 Centres de formation professionnelle
                      </SelectItem>
                      <SelectItem value="coaching">
                        🎯 Coaching & Développement personnel
                      </SelectItem>

                      {/* Créatif & Culture */}
                      <SelectItem value="arts-culture">
                        🎨 Arts & Culture
                      </SelectItem>
                      <SelectItem value="photographes">
                        📸 Photographes & Vidéastes
                      </SelectItem>
                      <SelectItem value="musiciens">
                        🎵 Musiciens & Artistes
                      </SelectItem>
                      <SelectItem value="agences-com">
                        📢 Agences de communication
                      </SelectItem>

                      {/* Associations & ONG */}
                      <SelectItem value="associations-ong">
                        🤝 Associations & ONG
                      </SelectItem>
                      <SelectItem value="clubs-sports">
                        ⚽ Clubs sportifs
                      </SelectItem>
                      <SelectItem value="communautes">
                        👥 Communautés & Groupes
                      </SelectItem>

                      {/* Tranches d'âge */}
                      <SelectItem value="enfants">
                        👶 Enfants (0-12 ans)
                      </SelectItem>
                      <SelectItem value="adolescents">
                        🧒 Adolescents (13-17 ans)
                      </SelectItem>
                      <SelectItem value="jeunes-18-25">
                        👨‍🎓 Jeunes adultes (18-25 ans)
                      </SelectItem>
                      <SelectItem value="adultes-26-40">
                        👨‍💼 Adultes actifs (26-40 ans)
                      </SelectItem>
                      <SelectItem value="adultes-41-55">
                        👨‍🏫 Adultes expérimentés (41-55 ans)
                      </SelectItem>
                      <SelectItem value="seniors-55plus">
                        👴 Seniors (55+ ans)
                      </SelectItem>

                      {/* Groupes spécifiques */}
                      <SelectItem value="familles">
                        👨‍👩‍👧‍👦 Familles avec enfants
                      </SelectItem>
                      <SelectItem value="etudiants">
                        📖 Étudiants & Universitaires
                      </SelectItem>
                      <SelectItem value="retraites">🏖️ Retraités</SelectItem>
                      <SelectItem value="femmes">👩 Public féminin</SelectItem>
                      <SelectItem value="hommes">👨 Public masculin</SelectItem>
                      <SelectItem value="cadres">
                        💼 Cadres & Dirigeants
                      </SelectItem>
                      <SelectItem value="ouvriers">
                        🔧 Ouvriers & Artisans
                      </SelectItem>

                      {/* International */}
                      <SelectItem value="local">🏘️ Clientèle locale</SelectItem>
                      <SelectItem value="national">
                        🇧🇫 Marché national (Burkina Faso)
                      </SelectItem>
                      <SelectItem value="africain">
                        🌍 Marché africain
                      </SelectItem>
                      <SelectItem value="international">
                        🌐 Marché international
                      </SelectItem>

                      <SelectItem value="autre">
                        📝 Autre public (à préciser)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.targetAudience === "autre" && (
                    <Input
                      placeholder="Précisez votre public cible"
                      value={formData.customTargetAudience || ""}
                      onChange={(e) =>
                        updateFormData("customTargetAudience", e.target.value)
                      }
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Personnalité de la marque *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "trustworthy",
                      "innovative",
                      "friendly",
                      "professional",
                      "creative",
                      "bold",
                      "sophisticated",
                      "approachable",
                      "energetic",
                      "reliable",
                    ].map((personality) => (
                      <label
                        key={personality}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={formData.brandPersonality?.includes(
                            personality as BrandPersonality,
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData("brandPersonality", [
                                ...(formData.brandPersonality || []),
                                personality,
                              ]);
                            } else {
                              updateFormData(
                                "brandPersonality",
                                formData.brandPersonality?.filter(
                                  (p) => p !== personality,
                                ),
                              );
                            }
                          }}
                        />
                        <span className="text-sm capitalize">
                          {personality}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Analyse IA et Recommandations
                  {generatingAI && (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  )}
                </CardTitle>
                <CardDescription>
                  Notre IA analyse votre secteur et génère des recommandations
                  personnalisées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {generatingAI ? (
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Brain className="w-8 h-8 text-purple-600 animate-pulse" />
                      <Sparkles className="w-6 h-6 text-accent animate-bounce" />
                      <Wand2 className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Analyse en cours...
                    </h3>
                    <p className="text-gray-600">
                      Notre IA analyse votre secteur et génère des
                      recommandations personnalis��es
                    </p>
                  </div>
                ) : aiSuggestions ? (
                  <div className="space-y-6">
                    {/* Recommandations de couleurs */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Palette className="w-4 h-4" />
                          Palettes Recommandées par IA
                        </h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={generateAISuggestions}
                          className="text-xs"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          Nouvelles palettes
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {aiSuggestions.colorAnalysis.suggestedPalettes.map(
                          (palette: any, index: number) => {
                            const isSelected = selectedPalette === index;
                            return (
                              <motion.div
                                key={index}
                                className={`relative bg-white p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                                  isSelected
                                    ? "border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200"
                                    : "border-gray-200 hover:border-primary/50 hover:shadow-md"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                animate={isSelected ? { y: [-2, 0] } : {}}
                              >
                                <div className="flex gap-1 mb-3">
                                  {palette.colors.map(
                                    (color: string, i: number) => (
                                      <div
                                        key={i}
                                        className="w-10 h-10 rounded-md shadow-sm border border-white/20"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                      />
                                    ),
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-semibold text-sm text-gray-900">
                                      {palette.name}
                                    </h5>
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                                      {palette.mood}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 leading-relaxed">
                                    {palette.description}
                                  </p>
                                  <Button
                                    size="sm"
                                    variant={isSelected ? "default" : "outline"}
                                    className={`mt-3 w-full transition-all duration-300 ${
                                      isSelected
                                        ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                                        : "hover:bg-primary hover:text-white"
                                    }`}
                                    onClick={() => {
                                      setSelectedPalette(index);
                                      palette.colors.forEach(
                                        (color: string) => {
                                          addColorPreference(color, "love");
                                        },
                                      );
                                      // Feedback visuel avec toast
                                      toast({
                                        title: isSelected
                                          ? "✅ Palette déjà sélectionnée"
                                          : "🎨 Palette adoptée !",
                                        description: isSelected
                                          ? `La palette "${palette.name}" est votre choix actuel.`
                                          : `La palette "${palette.name}" a été sélectionnée et ajoutée à vos préférences.`,
                                      });
                                    }}
                                  >
                                    {isSelected ? (
                                      <>
                                        <Star className="w-3 h-3 mr-2 fill-current" />
                                        Palette sélectionnée
                                      </>
                                    ) : (
                                      <>
                                        <Zap className="w-3 h-3 mr-2" />
                                        Adopter cette palette
                                      </>
                                    )}
                                  </Button>
                                </div>
                                {/* Indicateur de sélection */}
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                                  >
                                    <Star className="w-3 h-3 text-white fill-current" />
                                  </motion.div>
                                )}
                              </motion.div>
                            );
                          },
                        )}
                      </div>
                    </div>

                    {/* Analyse concurrentielle */}
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-semibold flex items-center gap-2 mb-3">
                        <Eye className="w-4 h-4" />
                        Analyse Concurrentielle
                      </h4>
                      <ul className="space-y-2">
                        {aiSuggestions.competitorAnalysis.map(
                          (insight: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Star className="w-3 h-3 text-amber-600" />
                              {insight}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* Recommandation de type */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4" />
                        Type de Logo Recommandé
                      </h4>
                      <p className="text-sm text-gray-700">
                        <strong>
                          {aiSuggestions.logoTypeRecommendation.type}
                        </strong>{" "}
                        - {aiSuggestions.logoTypeRecommendation.reason}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Button
                      onClick={generateAISuggestions}
                      className="flex items-center gap-2"
                    >
                      <Brain className="w-4 h-4" />
                      Générer les Recommandations IA
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Préférences Créatives
                </CardTitle>
                <CardDescription>
                  Définissez le style et l'apparence de votre logo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Type de logo */}
                <div className="space-y-3">
                  <Label>Type de logo *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      {
                        value: "wordmark",
                        label: "Wordmark",
                        desc: "Nom stylisé",
                      },
                      {
                        value: "lettermark",
                        label: "Lettermark",
                        desc: "Initiales",
                      },
                      {
                        value: "pictorial",
                        label: "Pictorial",
                        desc: "Image/Icône",
                      },
                      {
                        value: "abstract",
                        label: "Abstract",
                        desc: "Forme abstraite",
                      },
                      {
                        value: "combination",
                        label: "Combination",
                        desc: "Texte + Symbol",
                      },
                      { value: "emblem", label: "Emblem", desc: "Badge/Sceau" },
                    ].map((type) => (
                      <div
                        key={type.value}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          formData.logoType === type.value
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                        onClick={() => updateFormData("logoType", type.value)}
                      >
                        <h4 className="font-medium text-sm">{type.label}</h4>
                        <p className="text-xs text-gray-600">{type.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Styles */}
                <div className="space-y-3">
                  <Label>Styles préférés</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      "modern",
                      "minimalist",
                      "vintage",
                      "playful",
                      "elegant",
                      "bold",
                      "organic",
                      "geometric",
                    ].map((style) => (
                      <label
                        key={style}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={formData.style?.includes(style as LogoStyle)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData("style", [
                                ...(formData.style || []),
                                style,
                              ]);
                            } else {
                              updateFormData(
                                "style",
                                formData.style?.filter((s) => s !== style),
                              );
                            }
                          }}
                        />
                        <span className="text-sm capitalize">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Exemples par style */}
                {formData.style && formData.style.length > 0 && (
                  <div className="space-y-3">
                    <Label>Exemples d'inspiration</Label>
                    {formData.style.map(
                      (selectedStyle) =>
                        logoExamples[
                          selectedStyle as keyof typeof logoExamples
                        ] && (
                          <div
                            key={selectedStyle}
                            className="bg-gray-50 p-3 rounded-lg"
                          >
                            <h5 className="font-medium text-sm mb-2 capitalize">
                              {selectedStyle}
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {logoExamples[
                                selectedStyle as keyof typeof logoExamples
                              ].map((example, index) => (
                                <div
                                  key={index}
                                  className="bg-white p-2 rounded border text-xs"
                                >
                                  <div className="font-medium">
                                    {example.name}
                                  </div>
                                  <div className="text-gray-600">
                                    {example.style}
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="text-xs mt-1"
                                  >
                                    {example.industry}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                )}

                {/* Texte inclus */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.includeText}
                      onCheckedChange={(checked) =>
                        updateFormData("includeText", checked)
                      }
                    />
                    <Label>Inclure le nom de l'entreprise dans le logo</Label>
                  </div>
                </div>

                {/* Couleurs sélectionnées */}
                {formData.colorPreferences &&
                  formData.colorPreferences.length > 0 && (
                    <div className="space-y-2">
                      <Label>Couleurs sélectionnées</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.colorPreferences.map((pref, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-white border rounded px-2 py-1"
                          >
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: pref.color }}
                            />
                            <span className="text-xs">{pref.preference}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations Client
                </CardTitle>
                <CardDescription>
                  Vos coordonnées pour la livraison du projet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientFirstName">Prénom *</Label>
                    <Input
                      id="clientFirstName"
                      value={formData.clientInfo?.firstName || ""}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        console.log("📝 Mise à jour firstName:", newValue);
                        updateFormData("clientInfo", {
                          ...formData.clientInfo,
                          firstName: newValue,
                        });
                      }}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientLastName">Nom</Label>
                    <Input
                      id="clientLastName"
                      value={formData.clientInfo?.lastName || ""}
                      onChange={(e) =>
                        updateFormData("clientInfo", {
                          ...formData.clientInfo,
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientInfo?.email || ""}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        console.log("📧 Mise à jour email:", newValue);
                        updateFormData("clientInfo", {
                          ...formData.clientInfo,
                          email: newValue,
                        });
                      }}
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Téléphone</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientInfo?.phone || ""}
                      onChange={(e) =>
                        updateFormData("clientInfo", {
                          ...formData.clientInfo,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+226 XX XX XX XX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientCompany">Entreprise</Label>
                  <Input
                    id="clientCompany"
                    value={
                      formData.clientInfo?.company || formData.companyName || ""
                    }
                    onChange={(e) =>
                      updateFormData("clientInfo", {
                        ...formData.clientInfo,
                        company: e.target.value,
                      })
                    }
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Finalisation et Livrables
                </CardTitle>
                <CardDescription>
                  Spécifiez vos besoins de livraison et d'utilisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Variations */}
                <div className="space-y-3">
                  <Label>Variations souhaitées</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "horizontal",
                      "vertical",
                      "icon-only",
                      "monochrome",
                      "reversed",
                      "simplified",
                    ].map((variation) => (
                      <label
                        key={variation}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={formData.variations?.includes(
                            variation as any,
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData("variations", [
                                ...(formData.variations || []),
                                variation,
                              ]);
                            } else {
                              updateFormData(
                                "variations",
                                formData.variations?.filter(
                                  (v) => v !== variation,
                                ),
                              );
                            }
                          }}
                        />
                        <span className="text-sm capitalize">
                          {variation.replace("-", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contextes d'usage */}
                <div className="space-y-3">
                  <Label>Contextes d'utilisation</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "website",
                      "business-card",
                      "letterhead",
                      "signage",
                      "social-media",
                      "merchandise",
                      "vehicle",
                      "packaging",
                    ].map((context) => (
                      <label
                        key={context}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={formData.usageContext?.includes(
                            context as any,
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData("usageContext", [
                                ...(formData.usageContext || []),
                                context,
                              ]);
                            } else {
                              updateFormData(
                                "usageContext",
                                formData.usageContext?.filter(
                                  (c) => c !== context,
                                ),
                              );
                            }
                          }}
                        />
                        <span className="text-sm capitalize">
                          {context.replace("-", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes supplémentaires */}
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Notes supplémentaires</Label>
                  <Textarea
                    id="additionalNotes"
                    rows={4}
                    value={formData.additionalNotes || ""}
                    onChange={(e) =>
                      updateFormData("additionalNotes", e.target.value)
                    }
                    placeholder="Références visuelles, contraintes spécifiques, inspirations..."
                  />
                </div>

                {/* Récapitulatif */}
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">
                    Récapitulatif de votre demande
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>Entreprise:</strong> {formData.companyName}
                      </p>
                      <p>
                        <strong>Secteur:</strong> {formData.industry}
                      </p>
                      <p>
                        <strong>Type:</strong> {formData.logoType}
                      </p>
                      <p>
                        <strong>Styles:</strong> {formData.style?.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Couleurs:</strong>{" "}
                        {formData.colorPreferences?.length || 0} sélectionnées
                      </p>
                      <p>
                        <strong>Variations:</strong>{" "}
                        {formData.variations?.length || 0}
                      </p>
                      <p>
                        <strong>Usages:</strong>{" "}
                        {formData.usageContext?.length || 0} contextes
                      </p>
                      <p>
                        <strong>Texte inclus:</strong>{" "}
                        {formData.includeText ? "Oui" : "Non"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onBack : prevStep}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          {currentStep === 1 ? "Retour" : "Précédent"}
        </Button>

        <Button
          onClick={currentStep === totalSteps ? handleSubmit : nextStep}
          className="flex items-center gap-2"
          disabled={generatingAI}
        >
          {currentStep === totalSteps ? (
            <>
              <Sparkles size={16} />
              Finaliser la demande
            </>
          ) : (
            <>
              Suivant
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LogoDesignForm;
