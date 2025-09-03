import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Monitor,
  Printer,
  Star,
  Smartphone,
  Megaphone,
  ArrowRight,
  Sparkles,
  Wand2,
  Brain,
} from "lucide-react";
import { ServiceType } from "@/types/specializedServices";

interface SpecializedServiceSelectorProps {
  onServiceSelect: (serviceType: ServiceType) => void;
  onCancel?: () => void;
}

const SpecializedServiceSelector: React.FC<SpecializedServiceSelectorProps> = ({
  onServiceSelect,
  onCancel,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null,
  );
  const [hoveredService, setHoveredService] = useState<ServiceType | null>(
    null,
  );

  const services = [
    {
      type: "logo-design" as ServiceType,
      title: "Création de Logo",
      description: "Logo professionnel avec identité visuelle complète",
      icon: Palette,
      color: "from-pink-500 to-purple-600",
      features: [
        "Analyse de votre secteur",
        "Propositions de couleurs IA",
        "Variations multiples",
        "Fichiers vectoriels",
        "Guide d'utilisation",
      ],
      aiFeatures: [
        "Génération automatique de palettes",
        "Analyse des tendances du secteur",
        "Suggestions de styles basées sur l'industrie",
      ],
      examples: [
        "Logo minimaliste tech",
        "Logo vintage artisanal",
        "Logo moderne startup",
      ],
    },
    {
      type: "website-development" as ServiceType,
      title: "Site Web Sur Mesure",
      description: "Site web responsive avec design personnalisé",
      icon: Monitor,
      color: "from-blue-500 to-cyan-600",
      features: [
        "Design responsive",
        "Optimisation SEO",
        "Interface intuitive",
        "Performance optimisée",
        "Maintenance incluse",
      ],
      aiFeatures: [
        "Analyse UX automatique",
        "Optimisation de contenu",
        "Suggestions de structure",
      ],
      examples: [
        "Site e-commerce moderne",
        "Portfolio créatif",
        "Site corporate",
      ],
    },
    {
      type: "print-design" as ServiceType,
      title: "Design Print",
      description: "Supports imprimés professionnels et percutants",
      icon: Printer,
      color: "from-green-500 to-emerald-600",
      features: [
        "Haute résolution",
        "Profils couleurs CMYK",
        "Formats personnalisés",
        "Finitions premium",
        "Prêt à imprimer",
      ],
      aiFeatures: [
        "Optimisation automatique des couleurs",
        "Suggestions de mise en page",
        "Analyse de lisibilité",
      ],
      examples: [
        "Brochure entreprise",
        "Affiche événement",
        "Packaging produit",
      ],
    },
    {
      type: "branding" as ServiceType,
      title: "Identité de Marque",
      description: "Stratégie de marque complète et cohérente",
      icon: Star,
      color: "from-amber-500 to-orange-600",
      features: [
        "Audit de marque",
        "Charte graphique",
        "Guide de style",
        "Déclinaisons multiples",
        "Stratégie de communication",
      ],
      aiFeatures: [
        "Analyse concurrentielle IA",
        "Positionnement automatique",
        "Tendances du marché",
      ],
      examples: [
        "Rebranding complet",
        "Nouvelle identité startup",
        "Extension de marque",
      ],
    },
    {
      type: "mobile-app" as ServiceType,
      title: "Application Mobile",
      description: "App native ou cross-platform sur mesure",
      icon: Smartphone,
      color: "from-purple-500 to-indigo-600",
      features: [
        "Design natif",
        "Performance optimisée",
        "Intégrations API",
        "Tests utilisateurs",
        "Déploiement stores",
      ],
      aiFeatures: [
        "Analyse comportementale",
        "Optimisation UX",
        "Prédiction d'usage",
      ],
      examples: ["App e-commerce", "App de services", "App communautaire"],
    },
    {
      type: "marketing-material" as ServiceType,
      title: "Supports Marketing",
      description: "Contenus visuels pour vos campagnes",
      icon: Megaphone,
      color: "from-red-500 to-pink-600",
      features: [
        "Designs impactants",
        "Multi-formats",
        "Déclinaisons campagne",
        "Optimisation ROI",
        "A/B testing",
      ],
      aiFeatures: [
        "Génération de concepts",
        "Analyse d'engagement",
        "Optimisation de conversion",
      ],
      examples: [
        "Campagne social media",
        "Email marketing",
        "Bannières publicitaires",
      ],
    },
  ];

  const handleServiceSelect = (serviceType: ServiceType) => {
    setSelectedService(serviceType);
    setTimeout(() => {
      onServiceSelect(serviceType);
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-8 h-8 text-primary" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Services Assistés par IA
          </h2>
          <Sparkles className="w-8 h-8 text-accent" />
        </div>
        <p className="text-xl text-gray-600 mb-6">
          Choisissez votre service et bénéficiez de nos outils IA avancés pour
          un résultat optimal
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Wand2 className="w-4 h-4" />
          <span>
            Génération automatique • Analyse intelligente • Optimisation
            continue
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          const isSelected = selectedService === service.type;
          const isHovered = hoveredService === service.type;

          return (
            <motion.div
              key={service.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`h-full cursor-pointer transition-all duration-300 hover:shadow-xl relative overflow-hidden ${
                  isSelected ? "ring-2 ring-primary shadow-2xl" : ""
                }`}
                onMouseEnter={() => setHoveredService(service.type)}
                onMouseLeave={() => setHoveredService(null)}
                onClick={() => handleServiceSelect(service.type)}
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 transition-opacity duration-300 ${
                    isHovered ? "opacity-10" : ""
                  }`}
                />

                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center transition-transform duration-300 ${
                        isHovered ? "scale-110" : ""
                      }`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    {service.aiFeatures.length > 0 && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        <Brain className="w-3 h-3 mr-1" />
                        IA
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  {/* Features traditionnelles */}
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      ✨ Inclus :
                    </h4>
                    <ul className="space-y-1">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-600 flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Features IA */}
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-purple-700 mb-2 flex items-center gap-1">
                      <Brain className="w-3 h-3" />
                      Assisté par IA :
                    </h4>
                    <ul className="space-y-1">
                      {service.aiFeatures.slice(0, 2).map((feature, i) => (
                        <li
                          key={i}
                          className="text-sm text-purple-600 flex items-center gap-2"
                        >
                          <Sparkles className="w-3 h-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exemples */}
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      💡 Exemples :
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {service.examples.slice(0, 2).map((example, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className={`w-full mt-4 transition-all duration-300 ${
                      isSelected ? "bg-primary scale-105" : ""
                    }`}
                    variant={isSelected ? "default" : "outline"}
                  >
                    {isSelected ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Sélectionné
                      </>
                    ) : (
                      <>
                        Choisir ce service
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>

                {/* Animation de sélection */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info supplémentaire */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Brain className="w-6 h-6 text-primary" />
              <h3 className="font-semibold text-lg">Technologie IA Avancée</h3>
              <Wand2 className="w-6 h-6 text-accent" />
            </div>
            <p className="text-gray-600 mb-4">
              Nos outils d'intelligence artificielle analysent vos besoins et
              génèrent des propositions personnalisées pour accélérer votre
              projet tout en maintenant une qualité exceptionnelle.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                Analyse Automatique
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                Génération de Contenu
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                Optimisation Continue
              </Badge>
              <Badge className="bg-orange-100 text-orange-800">
                Suggestions Intelligentes
              </Badge>
            </div>
          </CardContent>
        </Card>

        {onCancel && (
          <Button variant="outline" onClick={onCancel} className="mt-6">
            Retour
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default SpecializedServiceSelector;
