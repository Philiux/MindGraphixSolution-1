import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Briefcase,
  CreditCard,
  FileText,
  RefreshCw,
} from "lucide-react";
import {
  QuoteFormData,
  ServiceItem,
  ProjectCategory,
  BudgetRange,
  UrgencyLevel,
} from "@/types/quote";
import { ServiceType } from "@/types/specializedServices";
import SpecializedServiceSelector from "./SpecializedServiceSelector";
import LogoDesignForm from "./LogoDesignForm";
import PrintDesignForm from "./PrintDesignForm";
import { useToast } from "@/hooks/use-toast";

interface QuoteRequestFormProps {
  onSubmit: (data: QuoteFormData) => Promise<void> | void;
  onCancel?: () => void;
}

const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0); // Start with service selection
  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<QuoteFormData>({
    step: 0,
    clientInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Burkina Faso",
    },
    projectInfo: {
      title: "",
      description: "",
      category: "web-development",
      budget: "to-discuss",
      urgency: "medium",
    },
    services: [],
    additionalRequirements: "",
    attachments: [],
  });

  const totalSteps = 5; // 0: selection service, 1: formulaire spécialisé, 2: infos projet (si nécessaire), 3: infos client, 4: finalisation
  const progress = (currentStep / totalSteps) * 100;

  const handleServiceSelection = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType);
    setCurrentStep(1);
  };

  // Fonction de validation email robuste avec messages détaillés
  const validateEmail = (
    email: string,
  ): { isValid: boolean; message: string } => {
    const cleanEmail = (email || "").trim().toLowerCase();
    console.log("🔍 Email à valider:", `"${cleanEmail}"`);

    if (!cleanEmail) {
      return { isValid: false, message: "Veuillez saisir une adresse email" };
    }

    // Vérifications spécifiques avec messages informatifs
    if (!cleanEmail.includes("@")) {
      return {
        isValid: false,
        message:
          "L'email doit contenir le symbole @ (exemple: nom@domaine.com)",
      };
    }

    const parts = cleanEmail.split("@");
    if (parts.length !== 2) {
      return {
        isValid: false,
        message:
          "L'email ne peut contenir qu'un seul @ (exemple: nom@domaine.com)",
      };
    }

    const [localPart, domainPart] = parts;

    // Vérification de la partie locale (avant @)
    if (!localPart || localPart.length === 0) {
      return {
        isValid: false,
        message:
          "Veuillez saisir un nom avant le @ (exemple: votrenom@domaine.com)",
      };
    }

    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      return {
        isValid: false,
        message: "Le nom ne peut pas commencer ou finir par un point",
      };
    }

    // Vérification de la partie domaine (après @)
    if (!domainPart || domainPart.length === 0) {
      return {
        isValid: false,
        message:
          "Veuillez saisir un domaine après le @ (exemple: nom@gmail.com)",
      };
    }

    if (!domainPart.includes(".")) {
      return {
        isValid: false,
        message: "Le domaine doit contenir un point (exemple: nom@gmail.com)",
      };
    }

    if (domainPart.startsWith(".") || domainPart.endsWith(".")) {
      return {
        isValid: false,
        message: "Le domaine ne peut pas commencer ou finir par un point",
      };
    }

    if (domainPart.includes("..")) {
      return {
        isValid: false,
        message: "Le domaine ne peut pas contenir deux points consécutifs",
      };
    }

    // Vérification de l'extension (partie après le dernier point)
    const domainParts = domainPart.split(".");
    const extension = domainParts[domainParts.length - 1];

    if (!extension || extension.length < 2) {
      return {
        isValid: false,
        message:
          "L'extension doit contenir au moins 2 caractères (exemple: .com, .fr, .org)",
      };
    }

    if (extension.length > 6) {
      return {
        isValid: false,
        message: "L'extension ne peut pas dépasser 6 caractères",
      };
    }

    // Regex finale pour vérifier le format global
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(cleanEmail)) {
      console.error("❌ Email invalide:", cleanEmail);
      return {
        isValid: false,
        message:
          "Format d'email invalide. Utilisez le format : nom@domaine.com",
      };
    }

    console.log("✅ Email valide:", cleanEmail);
    return { isValid: true, message: "" };
  };

  const handleSpecializedFormSubmit = (data: any) => {
    console.log("🎯 Données du formulaire spécialisé reçues:", data);

    // Convert specialized form data to general form data
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        projectInfo: {
          ...prev.projectInfo,
          title: data.projectName || data.companyName || data.title || "",
          description: data.description || "",
          category: selectedServiceType as ProjectCategory,
        },
        clientInfo: {
          ...prev.clientInfo,
          ...(data.clientInfo || {}),
        },
        services: [
          {
            category: selectedServiceType,
            name: getServiceName(selectedServiceType),
            description: data.description || "",
            selected: true,
          },
        ],
      };

      console.log(
        "📋 Données mises à jour après formulaire spécialisé:",
        updatedData,
      );
      console.log("👤 ClientInfo dans updatedData:", updatedData.clientInfo);
      return updatedData;
    });

    // Si le formulaire spécialisé a collecté les infos client (comme LogoDesignForm),
    // aller directement à la finalisation
    const hasClientInfo = data.clientInfo?.firstName && data.clientInfo?.email;

    if (hasClientInfo) {
      console.log("✅ Informations client complètes, direction finalisation");
      setCurrentStep(4); // Finalisation directe
    } else {
      console.log("⚠️ Informations client manquantes, direction étape contact");
      setCurrentStep(3); // Étape contact
    }
  };

  const getServiceName = (serviceType: ServiceType): string => {
    const names = {
      "logo-design": "Création de Logo",
      "website-development": "Développement Web",
      "print-design": "Design Print",
      branding: "Identité de Marque",
      "mobile-app": "Application Mobile",
      "marketing-material": "Support Marketing",
    };
    return names[serviceType] || serviceType;
  };

  const availableServices: ServiceItem[] = [
    // DESIGN & IDENTITÉ VISUELLE
    {
      category: "design",
      name: "🎨 Logo Design",
      description: "Création de logo professionnel et identité visuelle",
      selected: false,
    },
    {
      category: "design",
      name: "🎯 UI/UX Design",
      description: "Interface utilisateur et expérience optimisée",
      selected: false,
    },
    {
      category: "design",
      name: "🏷️ Branding Complet",
      description: "Identité visuelle complète (logo, couleurs, typographie)",
      selected: false,
    },
    {
      category: "design",
      name: "📄 Design Print",
      description: "Supports imprimés (cartes, flyers, brochures)",
      selected: false,
    },
    {
      category: "design",
      name: "📱 Design Mobile",
      description: "Design d'applications mobiles et interfaces",
      selected: false,
    },
    {
      category: "design",
      name: "🎨 Illustrations",
      description: "Illustrations personnalisées et iconographie",
      selected: false,
    },

    // DÉVELOPPEMENT WEB
    {
      category: "development",
      name: "🌐 Site Web Vitrine",
      description: "Site web informatif et professionnel",
      selected: false,
    },
    {
      category: "development",
      name: "🛒 E-commerce",
      description: "Boutique en ligne complète",
      selected: false,
    },
    {
      category: "development",
      name: "⚙️ Application Web",
      description: "Application web sur mesure et interactive",
      selected: false,
    },
    {
      category: "development",
      name: "💻 Site Web Dynamique",
      description: "Site avec CMS et gestion de contenu",
      selected: false,
    },
    {
      category: "development",
      name: "🔗 API & Intégrations",
      description: "Développement d'API et intégrations tiers",
      selected: false,
    },
    {
      category: "development",
      name: "🗄️ Base de Données",
      description: "Conception et optimisation de bases de données",
      selected: false,
    },

    // APPLICATIONS MOBILES
    {
      category: "mobile-app",
      name: "📱 App iOS/Android",
      description: "Application mobile native ou cross-platform",
      selected: false,
    },
    {
      category: "mobile-app",
      name: "🔔 App avec Notifications",
      description: "Application avec système de notifications push",
      selected: false,
    },
    {
      category: "mobile-app",
      name: "🛒 App E-commerce Mobile",
      description: "Application mobile de vente en ligne",
      selected: false,
    },

    // MARKETING & SEO
    {
      category: "marketing",
      name: "📈 SEO/Référencement",
      description: "Optimisation pour moteurs de recherche",
      selected: false,
    },
    {
      category: "marketing",
      name: "📊 Marketing Digital",
      description: "Stratégie marketing en ligne complète",
      selected: false,
    },
    {
      category: "marketing",
      name: "📱 Social Media",
      description: "Gestion réseaux sociaux et contenu",
      selected: false,
    },
    {
      category: "marketing",
      name: "📧 Email Marketing",
      description: "Campagnes emailing et newsletters",
      selected: false,
    },
    {
      category: "marketing",
      name: "💰 Google Ads",
      description: "Campagnes publicitaires Google et Facebook",
      selected: false,
    },
    {
      category: "marketing",
      name: "📊 Analytics",
      description: "Analyse de données et reporting",
      selected: false,
    },

    // CONSEIL & FORMATION
    {
      category: "consulting",
      name: "🎯 Conseil Stratégique",
      description: "Accompagnement et conseil en transformation digitale",
      selected: false,
    },
    {
      category: "consulting",
      name: "📚 Formation",
      description: "Formation aux outils digitaux et web",
      selected: false,
    },
    {
      category: "consulting",
      name: "🔍 Audit Digital",
      description: "Audit de présence digitale et recommandations",
      selected: false,
    },
    {
      category: "consulting",
      name: "📋 Cahier des Charges",
      description: "Rédaction de cahier des charges technique",
      selected: false,
    },

    // MAINTENANCE & SUPPORT
    {
      category: "maintenance",
      name: "🛠️ Maintenance Site",
      description: "Maintenance et mises à jour de site web",
      selected: false,
    },
    {
      category: "maintenance",
      name: "🔒 Sécurisation",
      description: "Sécurisation et sauvegarde de sites",
      selected: false,
    },
    {
      category: "maintenance",
      name: "⚡ Optimisation Performance",
      description: "Optimisation vitesse et performance",
      selected: false,
    },
    {
      category: "maintenance",
      name: "📞 Support Technique",
      description: "Support technique et assistance utilisateur",
      selected: false,
    },

    // SERVICES SPÉCIALISÉS
    {
      category: "specialized",
      name: "🎥 Vidéo & Motion",
      description: "Création de vidéos et animations",
      selected: false,
    },
    {
      category: "specialized",
      name: "📸 Photographie",
      description: "Photographie professionnelle et retouche",
      selected: false,
    },
    {
      category: "specialized",
      name: "🖨️ Impression 3D",
      description: "Modélisation et impression 3D",
      selected: false,
    },
    {
      category: "specialized",
      name: "🎮 Gamification",
      description: "Intégration d'éléments de jeu",
      selected: false,
    },
    {
      category: "specialized",
      name: "🤖 IA & Automatisation",
      description: "Solutions d'intelligence artificielle et chatbots",
      selected: false,
    },
    {
      category: "specialized",
      name: "🌐 Traduction",
      description: "Traduction de contenus multilingues",
      selected: false,
    },
  ];

  const updateFormData = (section: keyof QuoteFormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]:
        typeof prev[section] === "object"
          ? { ...prev[section], ...data }
          : data,
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setFormData((prev) => ({ ...prev, step: currentStep + 1 }));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setFormData((prev) => ({ ...prev, step: currentStep - 1 }));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Éviter les double-clics

    console.log("🚀 Début de l'envoi de la demande...");
    console.log("📋 Données du formulaire:", formData);
    console.log("👤 ClientInfo détaillé:", formData.clientInfo);
    console.log("📊 ProjectInfo détaillé:", formData.projectInfo);
    console.log("🔍 Email:", formData.clientInfo?.email);
    console.log("🔍 FirstName:", formData.clientInfo?.firstName);

    setIsSubmitting(true);

    // Validation renforcée
    const missingFields = [];

    // Debug : Afficher l'état actuel des données
    console.log("🔍 Validation - État actuel des données client:");
    console.log("  - Email:", `"${formData.clientInfo?.email || ""}"`);
    console.log("  - FirstName:", `"${formData.clientInfo?.firstName || ""}"`);
    console.log("  - Service Type:", selectedServiceType);
    console.log("  - Current Step:", currentStep);

    // Validation des informations client (toujours requises)
    if (!formData.clientInfo?.email?.trim()) {
      console.log("❌ Email manquant:", formData.clientInfo?.email);
      missingFields.push("Email");
    }
    if (!formData.clientInfo?.firstName?.trim()) {
      console.log("❌ Prénom manquant:", formData.clientInfo?.firstName);
      missingFields.push("Prénom");
    }

    // Validation du projet (adaptée selon le type de service)
    if (selectedServiceType) {
      // Si on vient d'un formulaire spécialisé, on vérifie différemment
      if (!formData.projectInfo?.title?.trim()) {
        console.log("❌ Titre manquant:", formData.projectInfo?.title);
        missingFields.push("Titre du projet");
      }
    } else {
      // Pour le formulaire général
      if (!formData.projectInfo?.title?.trim()) {
        console.log("❌ Titre manquant:", formData.projectInfo?.title);
        missingFields.push("Titre du projet");
      }
      if (!formData.projectInfo?.description?.trim()) {
        console.log(
          "❌ Description manquante:",
          formData.projectInfo?.description,
        );
        missingFields.push("Description du projet");
      }
    }

    if (missingFields.length > 0) {
      console.error("❌ Validation échouée - champs manquants:", missingFields);

      // Rediriger vers l'étape appropriée
      if (missingFields.includes("Email") || missingFields.includes("Prénom")) {
        console.log("📍 Redirection vers l'étape des informations client");
        setCurrentStep(3); // Étape des infos client
      } else if (
        missingFields.includes("Titre du projet") ||
        missingFields.includes("Description du projet")
      ) {
        console.log("📍 Redirection vers l'étape du projet");
        setCurrentStep(2); // Étape du projet
      }

      toast({
        title: "Informations manquantes",
        description: `Veuillez remplir les champs suivants: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValidation = validateEmail(formData.clientInfo.email);
    if (!emailValidation.isValid) {
      console.error("❌ Email invalide");
      toast({
        title: "Email invalide",
        description: emailValidation.message,
        variant: "destructive",
      });

      // Rediriger vers l'étape des infos client
      setCurrentStep(3);
      setIsSubmitting(false);
      return;
    }

    try {
      // Toast d'information pour indiquer le début du traitement
      toast({
        title: "🔄 Traitement en cours",
        description: "Envoi de votre demande de devis...",
      });

      console.log("📨 Appel de onSubmit...");
      await onSubmit(formData);
      console.log("✅ Demande envoyée avec succès!");

      // Petit délai pour que l'utilisateur voit le changement
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "🎉 Demande envoyée avec succès !",
        description:
          "Nous vous contacterons dans les 24h pour discuter de votre projet.",
      });
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleService = (index: number) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = {
      ...updatedServices[index],
      selected: !updatedServices[index].selected,
    };
    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const stepIcons = [User, Briefcase, FileText, Check, CreditCard];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header avec progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Demande de Devis
          </h2>
          <div className="text-base font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            Étape {currentStep} sur {totalSteps}
          </div>
        </div>
        <Progress value={progress} className="w-full h-2" />

        {/* Indicateurs d'étapes */}
        <div className="flex items-center justify-between mt-6">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNumber = i + 1;
            const StepIcon = stepIcons[i] || User; // Fallback to User icon if undefined
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-primary border-primary text-white"
                      : isActive
                        ? "border-primary text-primary bg-primary/10"
                        : "border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check size={20} /> : <StepIcon size={20} />}
                </div>
                <span
                  className={`text-sm mt-2 font-medium ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                        ? "text-green-600"
                        : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {
                    ["Service", "Détails", "Projet", "Contact", "Finalisation"][
                      i
                    ]
                  }
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 0 && (
            <SpecializedServiceSelector
              onServiceSelect={handleServiceSelection}
              onCancel={onCancel}
            />
          )}

          {currentStep === 1 && selectedServiceType === "logo-design" && (
            <LogoDesignForm
              onSubmit={handleSpecializedFormSubmit}
              onBack={() => setCurrentStep(0)}
            />
          )}

          {currentStep === 1 && selectedServiceType === "print-design" && (
            <PrintDesignForm
              onSubmit={handleSpecializedFormSubmit}
              onBack={() => setCurrentStep(0)}
            />
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations Client
                </CardTitle>
                <CardDescription className="text-base text-gray-700 dark:text-gray-300">
                  Renseignez vos coordonnées pour que nous puissions vous
                  contacter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.clientInfo.firstName || ""}
                      onChange={(e) =>
                        updateFormData("clientInfo", {
                          firstName: e.target.value,
                        })
                      }
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.clientInfo.lastName || ""}
                      onChange={(e) =>
                        updateFormData("clientInfo", {
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.clientInfo.email || ""}
                      onChange={(e) => {
                        const email = e.target.value;
                        updateFormData("clientInfo", {
                          email: email,
                        });

                        // Validation en temps réel (optionnelle)
                        if (email && email.length > 5) {
                          const validation = validateEmail(email);
                          console.log(
                            "⏰ Validation temps réel:",
                            validation.isValid ? "✅" : "❌",
                            validation.message,
                          );
                        }
                      }}
                      placeholder="votre.email@exemple.com"
                      className={`${
                        formData.clientInfo.email &&
                        formData.clientInfo.email.length > 5 &&
                        !validateEmail(formData.clientInfo.email).isValid
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                    {formData.clientInfo.email &&
                      formData.clientInfo.email.length > 5 &&
                      !validateEmail(formData.clientInfo.email).isValid && (
                        <p className="text-sm text-red-600 mt-1">
                          {validateEmail(formData.clientInfo.email).message}
                        </p>
                      )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.clientInfo.phone || ""}
                      onChange={(e) =>
                        updateFormData("clientInfo", {
                          phone: e.target.value,
                        })
                      }
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <Input
                    id="company"
                    value={formData.clientInfo.company || ""}
                    onChange={(e) =>
                      updateFormData("clientInfo", {
                        company: e.target.value,
                      })
                    }
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.clientInfo.address || ""}
                    onChange={(e) =>
                      updateFormData("clientInfo", {
                        address: e.target.value,
                      })
                    }
                    placeholder="Votre adresse"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={formData.clientInfo.city || ""}
                      onChange={(e) =>
                        updateFormData("clientInfo", { city: e.target.value })
                      }
                      placeholder="Votre ville"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      value={formData.clientInfo.postalCode || ""}
                      onChange={(e) =>
                        updateFormData("clientInfo", {
                          postalCode: e.target.value,
                        })
                      }
                      placeholder="12345"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={formData.clientInfo.country || "France"}
                      onChange={(e) =>
                        updateFormData("clientInfo", {
                          country: e.target.value,
                        })
                      }
                      placeholder="France"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Détails du Projet
                </CardTitle>
                <CardDescription>
                  Décrivez votre projet en détail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du projet *</Label>
                  <Input
                    id="title"
                    value={formData.projectInfo.title || ""}
                    onChange={(e) =>
                      updateFormData("projectInfo", { title: e.target.value })
                    }
                    placeholder="Ex: Création de site web e-commerce"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={formData.projectInfo.category || ""}
                    onValueChange={(value) =>
                      updateFormData("projectInfo", {
                        category: value as ProjectCategory,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-development">
                        Développement Web
                      </SelectItem>
                      <SelectItem value="mobile-app">
                        Application Mobile
                      </SelectItem>
                      <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                      <SelectItem value="branding">Branding</SelectItem>
                      <SelectItem value="e-commerce">E-commerce</SelectItem>
                      <SelectItem value="consulting">Conseil</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="seo-marketing">
                        SEO/Marketing
                      </SelectItem>
                      <SelectItem value="custom-software">
                        Logiciel Sur Mesure
                      </SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description détaillée *</Label>
                  <Textarea
                    id="description"
                    rows={6}
                    value={formData.projectInfo.description || ""}
                    onChange={(e) =>
                      updateFormData("projectInfo", {
                        description: e.target.value,
                      })
                    }
                    placeholder="Décrivez votre projet, vos objectifs, votre public cible, les fonctionnalités souhaitées..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget estimé</Label>
                    <Select
                      value={formData.projectInfo.budget || ""}
                      onValueChange={(value) =>
                        updateFormData("projectInfo", {
                          budget: value as BudgetRange,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-1000">
                          Moins de 1 000€
                        </SelectItem>
                        <SelectItem value="1000-5000">
                          1 000€ - 5 000€
                        </SelectItem>
                        <SelectItem value="5000-10000">
                          5 000€ - 10 000€
                        </SelectItem>
                        <SelectItem value="10000-25000">
                          10 000€ - 25 000€
                        </SelectItem>
                        <SelectItem value="25000-50000">
                          25 000€ - 50 000€
                        </SelectItem>
                        <SelectItem value="over-50000">
                          Plus de 50 000€
                        </SelectItem>
                        <SelectItem value="to-discuss">À discuter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Niveau d'urgence</Label>
                    <Select
                      value={formData.projectInfo.urgency || ""}
                      onValueChange={(value) =>
                        updateFormData("projectInfo", {
                          urgency: value as UrgencyLevel,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Niveau d'urgence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible - Pas pressé</SelectItem>
                        <SelectItem value="medium">
                          Moyen - Dans les prochains mois
                        </SelectItem>
                        <SelectItem value="high">
                          Élevé - Dans les prochaines semaines
                        </SelectItem>
                        <SelectItem value="urgent">
                          Urgent - Le plus tôt possible
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Date limite souhaitée</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={
                      formData.projectInfo.deadline
                        ? formData.projectInfo.deadline
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      updateFormData("projectInfo", {
                        deadline: new Date(e.target.value),
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Services Requis
                </CardTitle>
                <CardDescription>
                  Sélectionnez les services dont vous avez besoin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableServices.map((service, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                        formData.services[index]?.selected
                          ? "border-primary bg-primary/5"
                          : "border-gray-200"
                      }`}
                      onClick={() => {
                        if (!formData.services[index]) {
                          setFormData((prev) => ({
                            ...prev,
                            services: [
                              ...prev.services,
                              { ...service, selected: true },
                            ],
                          }));
                        } else {
                          toggleService(index);
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={formData.services[index]?.selected || false}
                          onChange={() => {}}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {service.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalRequirements">
                    Exigences supplémentaires
                  </Label>
                  <Textarea
                    id="additionalRequirements"
                    rows={4}
                    value={formData.additionalRequirements}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        additionalRequirements: e.target.value,
                      }))
                    }
                    placeholder="Décrivez toute exigence particulière, contrainte technique, intégrations spécifiques..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fichiers joints (optionnel)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        Choisir des fichiers
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        Cahier des charges, maquettes, images de référence...
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Récapitulatif
                </CardTitle>
                <CardDescription>
                  Vérifiez vos informations avant l'envoi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Informations Client
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formData.clientInfo.firstName}{" "}
                      {formData.clientInfo.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formData.clientInfo.email}
                    </p>
                    {formData.clientInfo.company && (
                      <p className="text-sm text-gray-600">
                        {formData.clientInfo.company}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Projet</h4>
                    <p className="text-sm text-gray-600 font-medium">
                      {formData.projectInfo.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formData.projectInfo.description}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Services Sélectionnés
                    </h4>
                    <div className="space-y-1">
                      {formData.services
                        .filter((s) => s.selected)
                        .map((service, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            • {service.name}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2">
                    Prochaines étapes
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Analyse de votre demande (24-48h)</li>
                    <li>• Préparation du devis personnalisé</li>
                    <li>• Envoi du devis par email</li>
                    <li>• Présentation et discussion du projet</li>
                    <li>• Validation et début du projet</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Debug info for admins */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">🔧 Debug Info (Dev Mode)</h4>
          <p>
            <strong>Étape actuelle:</strong> {currentStep}/{totalSteps}
          </p>
          <p>
            <strong>Service sélectionné:</strong>{" "}
            {selectedServiceType || "Aucun"}
          </p>
          <p>
            <strong>Email:</strong> "{formData.clientInfo?.email || ""}"
          </p>
          <p>
            <strong>Prénom:</strong> "{formData.clientInfo?.firstName || ""}"
          </p>
          <p>
            <strong>Titre projet:</strong> "{formData.projectInfo?.title || ""}"
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("📋 FormData complet:", formData)}
            className="mt-2"
          >
            Log FormData
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : prevStep}
          className="flex items-center gap-2 font-medium"
        >
          <ArrowLeft size={16} />
          {currentStep === 0 ? "Annuler" : "Précédent"}
        </Button>

        <Button
          onClick={currentStep === 4 ? handleSubmit : nextStep}
          disabled={currentStep === 4 && isSubmitting}
          className="flex items-center gap-2 font-medium"
        >
          {currentStep === 4 ? (
            <>
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <RefreshCw size={16} />
                  </motion.div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Envoyer la demande
                </>
              )}
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

export default QuoteRequestForm;
