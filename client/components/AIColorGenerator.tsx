import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Palette,
  Brain,
  Sparkles,
  RefreshCw,
  Copy,
  Download,
  Heart,
  Wand2,
  Eye,
  Zap,
  Star,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { ColorScheme, ColorMood } from "@/types/specializedServices";
import { useToast } from "@/hooks/use-toast";

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  mood: ColorMood;
  industry: string;
  accessibility: number;
  trending: boolean;
  description: string;
  psychologyInsight: string;
  usageRecommendations: string[];
}

interface AIColorGeneratorProps {
  industry?: string;
  projectType?: string;
  targetAudience?: string;
  brandPersonality?: string[];
  onColorSelect?: (colors: string[]) => void;
}

const AIColorGenerator: React.FC<AIColorGeneratorProps> = ({
  industry = "",
  projectType = "",
  targetAudience = "",
  brandPersonality = [],
  onColorSelect,
}) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
  const [adoptedPalette, setAdoptedPalette] = useState<string | null>(null);
  const [customParams, setCustomParams] = useState({
    mood: "" as ColorMood | "",
    style: "",
    contrast: "medium",
  });

  // Palettes pré-générées avec analyse IA
  const predefinedPalettes: ColorPalette[] = [
    {
      id: "1",
      name: "Tech Innovation",
      colors: ["#0066FF", "#3399FF", "#66CCFF", "#99E6FF", "#FFFFFF"],
      mood: "technological",
      industry: "technology",
      accessibility: 95,
      trending: true,
      description: "Palette moderne inspirée de l'innovation technologique",
      psychologyInsight:
        "Le bleu inspire confiance et professionnalisme, essentiel dans la tech",
      usageRecommendations: [
        "Sites web tech",
        "Applications SaaS",
        "Startups",
        "Fintech",
      ],
    },
    {
      id: "2",
      name: "Organic Nature",
      colors: ["#2D5D31", "#4A7C59", "#689B68", "#A8D5A8", "#F0F9F0"],
      mood: "natural",
      industry: "health",
      accessibility: 88,
      trending: false,
      description: "Palette naturelle évoquant croissance et durabilité",
      psychologyInsight:
        "Le vert représente la nature, la santé et la prospérité",
      usageRecommendations: [
        "Marques bio",
        "Santé/bien-être",
        "Environnement",
        "Agriculture",
      ],
    },
    {
      id: "3",
      name: "Premium Luxury",
      colors: ["#1A1A1A", "#2D2D30", "#C9A96E", "#F4E4BC", "#FFFFFF"],
      mood: "elegant",
      industry: "luxury",
      accessibility: 92,
      trending: true,
      description: "Élégance et sophistication pour marques premium",
      psychologyInsight: "Le noir et or évoquent luxe, exclusivité et prestige",
      usageRecommendations: [
        "Marques de luxe",
        "Joaillerie",
        "Mode haut de gamme",
        "Services premium",
      ],
    },
    {
      id: "4",
      name: "Creative Energy",
      colors: ["#FF6B35", "#F7931E", "#FFD23F", "#06FFA5", "#4ECDC4"],
      mood: "energetic",
      industry: "creative",
      accessibility: 85,
      trending: true,
      description: "Palette vibrante pour stimuler créativité et innovation",
      psychologyInsight:
        "Les couleurs vives stimulent l'énergie et la créativité",
      usageRecommendations: [
        "Agences créatives",
        "Design",
        "Arts",
        "Entertainment",
      ],
    },
    {
      id: "5",
      name: "Calm Professional",
      colors: ["#2C3E50", "#34495E", "#5D737E", "#95A5A6", "#ECF0F1"],
      mood: "calm",
      industry: "corporate",
      accessibility: 96,
      trending: false,
      description: "Palette apaisante pour environnements professionnels",
      psychologyInsight:
        "Les tons neutres favorisent concentration et sérénité",
      usageRecommendations: ["Corporate", "Consulting", "Finance", "Éducation"],
    },
    {
      id: "6",
      name: "Playful Innovation",
      colors: ["#9B59B6", "#E74C3C", "#F39C12", "#2ECC71", "#3498DB"],
      mood: "playful",
      industry: "entertainment",
      accessibility: 82,
      trending: true,
      description: "Palette ludique pour marques jeunes et dynamiques",
      psychologyInsight:
        "Les couleurs vives attirent l'attention et évoquent la joie",
      usageRecommendations: [
        "Gaming",
        "Apps mobiles",
        "Enfants",
        "Entertainment",
      ],
    },
  ];

  useEffect(() => {
    if (industry || projectType) {
      generateAIPalettes();
    } else {
      setPalettes(predefinedPalettes);
    }
  }, [industry, projectType, targetAudience, brandPersonality]);

  const generateAIPalettes = async () => {
    setGenerating(true);

    // Simulation d'analyse IA
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Filtrer et adapter les palettes selon les paramètres
    let filtered = predefinedPalettes;

    if (industry) {
      filtered = filtered.filter(
        (p) =>
          p.industry === industry ||
          (industry === "technology" && p.mood === "technological") ||
          (industry === "creative" && p.mood === "energetic"),
      );
    }

    // Ajouter des variations générées par IA
    const generatedVariations = filtered.map((palette) => ({
      ...palette,
      id: `${palette.id}_ai`,
      name: `${palette.name} (IA Optimisé)`,
      colors: palette.colors.map((color) =>
        adjustColorForBrand(color, brandPersonality),
      ),
      trending: true,
      description: `${palette.description} - Optimisé par IA pour ${industry || "votre projet"}`,
    }));

    setPalettes([...filtered, ...generatedVariations]);
    setGenerating(false);
  };

  const adjustColorForBrand = (
    color: string,
    personality: string[],
  ): string => {
    // Simulation d'ajustement de couleur basé sur la personnalité
    if (personality.includes("bold")) {
      return adjustBrightness(color, 1.2);
    }
    if (personality.includes("sophisticated")) {
      return adjustSaturation(color, 0.8);
    }
    return color;
  };

  const adjustBrightness = (color: string, factor: number): string => {
    // Simulation d'ajustement de luminosité
    return color; // Simplification pour la démo
  };

  const adjustSaturation = (color: string, factor: number): string => {
    // Simulation d'ajustement de saturation
    return color; // Simplification pour la démo
  };

  const copyColorCode = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Couleur copiée",
      description: `${color} copié dans le presse-papiers`,
    });
  };

  const downloadPalette = (palette: ColorPalette) => {
    const data = {
      name: palette.name,
      colors: palette.colors,
      description: palette.description,
      recommendations: palette.usageRecommendations,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${palette.name.replace(/\s+/g, "_")}_palette.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Palette téléchargée",
      description: "La palette a été sauvegardée",
    });
  };

  const getAccessibilityLevel = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "bg-green-500" };
    if (score >= 80) return { label: "Bon", color: "bg-yellow-500" };
    return { label: "À améliorer", color: "bg-red-500" };
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Générateur de Couleurs IA
          </h2>
          <Wand2 className="w-8 h-8 text-pink-600" />
        </div>
        <p className="text-gray-600 mb-6">
          Intelligence artificielle avancée pour créer des palettes parfaitement
          adaptées à votre marque
        </p>

        {/* Indicateur de palette active */}
        {adoptedPalette && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto"
          >
            <div className="flex items-center justify-center gap-2 text-green-700">
              <Heart className="w-5 h-5 fill-current" />
              <span className="font-medium">
                Palette active :{" "}
                {palettes.find((p) => p.id === adoptedPalette)?.name}
              </span>
            </div>
            <div className="flex justify-center gap-1 mt-2">
              {palettes
                .find((p) => p.id === adoptedPalette)
                ?.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Paramètres de génération */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Paramètres IA
          </CardTitle>
          <CardDescription>
            Personnalisez la génération selon vos besoins spécifiques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Ambiance</Label>
              <Select
                value={customParams.mood}
                onValueChange={(value) =>
                  setCustomParams((prev) => ({
                    ...prev,
                    mood: value as ColorMood,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une ambiance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energetic">Énergique</SelectItem>
                  <SelectItem value="calm">Calme</SelectItem>
                  <SelectItem value="professional">Professionnel</SelectItem>
                  <SelectItem value="playful">Ludique</SelectItem>
                  <SelectItem value="elegant">Élégant</SelectItem>
                  <SelectItem value="bold">Audacieux</SelectItem>
                  <SelectItem value="natural">Naturel</SelectItem>
                  <SelectItem value="technological">Technologique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <Select
                value={customParams.style}
                onValueChange={(value) =>
                  setCustomParams((prev) => ({ ...prev, style: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Style de couleurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monochromatic">Monochromatique</SelectItem>
                  <SelectItem value="complementary">Complémentaire</SelectItem>
                  <SelectItem value="triadic">Triadique</SelectItem>
                  <SelectItem value="analogous">Analogues</SelectItem>
                  <SelectItem value="split-complementary">
                    Split-Complémentaire
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Contraste</Label>
              <Select
                value={customParams.contrast}
                onValueChange={(value) =>
                  setCustomParams((prev) => ({ ...prev, contrast: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="high">Élevé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateAIPalettes}
            disabled={generating}
            className="w-full"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Génération IA en cours...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Générer de Nouvelles Palettes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Palettes générées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {palettes.map((palette, index) => {
            const accessibilityLevel = getAccessibilityLevel(
              palette.accessibility,
            );
            const isSelected = selectedPalette === palette.id;
            const isAdopted = adoptedPalette === palette.id;

            return (
              <motion.div
                key={palette.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`cursor-pointer relative transition-all duration-300 ${
                  isAdopted
                    ? "ring-4 ring-green-500 ring-offset-2 shadow-2xl transform scale-105 bg-gradient-to-br from-green-50 to-green-100"
                    : isSelected
                      ? "ring-4 ring-primary ring-offset-2 shadow-2xl transform scale-105"
                      : "hover:shadow-lg"
                }`}
                onClick={() =>
                  setSelectedPalette(isSelected ? null : palette.id)
                }
              >
                {/* Indicateur de palette adoptée */}
                {isAdopted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-3 -right-3 z-20"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                      <Heart className="w-5 h-5 text-white fill-current" />
                    </div>
                  </motion.div>
                )}

                {/* Indicateur de sélection temporaire */}
                {isSelected && !isAdopted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-3 -right-3 z-20"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>
                )}

                {/* Badge statut */}
                {(isAdopted || isSelected) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-2 left-2 z-10"
                  >
                    {isAdopted ? (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                        <Heart className="w-3 h-3 mr-1 fill-current" />
                        Adoptée
                      </Badge>
                    ) : (
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
                        <Eye className="w-3 h-3 mr-1" />
                        Prévisualisation
                      </Badge>
                    )}
                  </motion.div>
                )}

                <Card
                  className={`h-full overflow-hidden transition-all duration-300 ${
                    isAdopted
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-green-200"
                      : isSelected
                        ? "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/30"
                        : ""
                  }`}
                >
                  <CardContent className="p-0">
                    {/* Prévisualisation couleurs */}
                    <div
                      className={`h-32 flex relative ${
                        isAdopted
                          ? "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-green-300/20 after:to-transparent after:animate-pulse"
                          : isSelected
                            ? "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:animate-pulse"
                            : ""
                      }`}
                    >
                      {palette.colors.map((color, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 relative group"
                          style={{ backgroundColor: color }}
                          whileHover={{ scale: 1.05, zIndex: 10 }}
                          animate={
                            isAdopted
                              ? { y: [0, -3, 0], scale: [1, 1.02, 1] }
                              : isSelected
                                ? { y: [0, -2, 0] }
                                : {}
                          }
                          transition={{
                            duration: isAdopted ? 2 : 1.5,
                            repeat: isAdopted || isSelected ? Infinity : 0,
                            repeatType: "reverse",
                          }}
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyColorCode(color);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/50 hover:bg-black/70"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Informations */}
                    <div
                      className={`p-4 transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-primary/5 to-transparent"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3
                          className={`font-semibold transition-colors duration-300 ${
                            isAdopted
                              ? "text-green-600 font-bold"
                              : isSelected
                                ? "text-primary font-bold"
                                : ""
                          }`}
                        >
                          {palette.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {palette.trending && (
                            <Badge className="bg-orange-100 text-orange-800">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                          <Badge
                            className={`${accessibilityLevel.color} text-white`}
                          >
                            {accessibilityLevel.label}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {palette.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {palette.psychologyInsight}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-600">
                            Accessibilité: {palette.accessibility}%
                          </span>
                        </div>
                      </div>

                      {/* Recommandations d'usage */}
                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">
                          Recommandé pour :
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {palette.usageRecommendations
                            .slice(0, 2)
                            .map((rec, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                {rec}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant={
                            isAdopted
                              ? "default"
                              : isSelected
                                ? "default"
                                : "outline"
                          }
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isAdopted) {
                              // Désadopter
                              setAdoptedPalette(null);
                              toast({
                                title: "Palette désadoptée",
                                description: `La palette "${palette.name}" n'est plus utilisée.`,
                              });
                            } else {
                              // Adopter
                              setAdoptedPalette(palette.id);
                              onColorSelect?.(palette.colors);
                              toast({
                                title: "✨ Palette adoptée !",
                                description: `La palette "${palette.name}" est maintenant active pour votre projet.`,
                              });
                            }
                          }}
                          className={`flex-1 transition-all duration-300 ${
                            isAdopted
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                              : isSelected
                                ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                                : ""
                          }`}
                        >
                          {isAdopted ? (
                            <>
                              <Heart className="w-3 h-3 mr-1 fill-current" />
                              Adoptée ✓
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Adopter
                            </>
                          )}
                        </Button>
                        <Button
                          variant={isSelected ? "secondary" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPalette(palette);
                          }}
                          className={isSelected ? "shadow-md" : ""}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Palette sélectionnée - Détails */}
      <AnimatePresence>
        {selectedPalette && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            {(() => {
              const selected = palettes.find((p) => p.id === selectedPalette);
              if (!selected) return null;

              return (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Analyse Détaillée - {selected.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Codes Couleurs</h4>
                        <div className="space-y-2">
                          {selected.colors.map((color, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                            >
                              <div
                                className="w-8 h-8 rounded border"
                                style={{ backgroundColor: color }}
                              />
                              <span className="font-mono text-sm">{color}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyColorCode(color)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">
                          Recommandations Complètes
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {selected.usageRecommendations.map((rec, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4">
                          <h4 className="font-medium mb-2">
                            Psychologie des Couleurs
                          </h4>
                          <p className="text-sm text-gray-600">
                            {selected.psychologyInsight}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIColorGenerator;
