import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Printer,
  Palette,
  ArrowRight,
  ArrowLeft,
  Brain,
  Sparkles,
  Ruler,
  Image,
  Type,
  Layers,
} from "lucide-react";
import {
  PrintDesignData,
  PrintType,
  PrintQuality,
  FinishType,
  ContentElement,
  PrintDimensions,
} from "@/types/specializedServices";
import AIColorGenerator from "./AIColorGenerator";

interface PrintDesignFormProps {
  onSubmit: (data: PrintDesignData) => void;
  onBack?: () => void;
}

const PrintDesignForm: React.FC<PrintDesignFormProps> = ({
  onSubmit,
  onBack,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<PrintDesignData>>({
    serviceType: "print-design",
    printType: "flyer",
    orientation: "portrait",
    colorMode: "cmyk",
    finishType: [],
    contentElements: [],
    printQuality: "standard",
  });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const totalSteps = 4;

  const printTypes = [
    {
      value: "business-card",
      label: "Carte de Visite",
      desc: "85x55mm, Format professionnel",
    },
    {
      value: "flyer",
      label: "Flyer/Prospectus",
      desc: "A5/A4, Communication directe",
    },
    { value: "poster", label: "Affiche", desc: "A3/A2/A1, Affichage public" },
    {
      value: "brochure",
      label: "Brochure",
      desc: "Multi-pages, Présentation détaillée",
    },
    {
      value: "banner",
      label: "Bannière",
      desc: "Format panoramique, Événements",
    },
    {
      value: "catalog",
      label: "Catalogue",
      desc: "Produits/Services, Multi-pages",
    },
    { value: "packaging", label: "Packaging", desc: "Emballage produit, 3D" },
    { value: "sticker", label: "Autocollant", desc: "Découpe personnalisée" },
  ];

  const dimensionPresets: Record<string, PrintDimensions> = {
    "business-card": { width: 85, height: 55, unit: "mm" as const },
    flyer: { width: 148, height: 210, unit: "mm" as const }, // A5
    poster: { width: 297, height: 420, unit: "mm" as const }, // A3
    brochure: { width: 210, height: 297, unit: "mm" as const }, // A4
    banner: { width: 200, height: 80, unit: "cm" as const },
    catalog: { width: 210, height: 297, unit: "mm" as const },
    packaging: { width: 100, height: 150, unit: "mm" as const },
    sticker: { width: 50, height: 50, unit: "mm" as const },
  };

  const contentElementsOptions = [
    {
      value: "headline",
      label: "Titre Principal",
      icon: Type,
      desc: "Titre accrocheur principal",
    },
    {
      value: "body-text",
      label: "Texte Corps",
      icon: Type,
      desc: "Contenu textuel détaillé",
    },
    {
      value: "images",
      label: "Images/Photos",
      icon: Image,
      desc: "Visuels haute qualité",
    },
    {
      value: "logo",
      label: "Logo",
      icon: Sparkles,
      desc: "Identité de marque",
    },
    {
      value: "contact-info",
      label: "Coordonnées",
      icon: Type,
      desc: "Informations de contact",
    },
    {
      value: "qr-code",
      label: "QR Code",
      icon: Layers,
      desc: "Lien digital interactif",
    },
    {
      value: "call-to-action",
      label: "Appel à Action",
      icon: Type,
      desc: "Bouton/Phrase incitatif",
    },
    {
      value: "social-media",
      label: "Réseaux Sociaux",
      icon: Layers,
      desc: "Icônes réseaux sociaux",
    },
  ];

  const updateFormData = (field: keyof PrintDesignData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-update dimensions based on print type
    if (field === "printType" && value in dimensionPresets) {
      const preset = dimensionPresets[value as keyof typeof dimensionPresets];
      setFormData((prev) => ({
        ...prev,
        dimensions: preset,
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Valider les informations client requises
    if (!formData.clientInfo?.firstName || !formData.clientInfo?.email) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez renseigner au minimum votre prénom et email.",
        variant: "destructive",
      });
      setCurrentStep(4); // Retour à l'étape des infos client
      return;
    }

    const finalData = {
      ...formData,
      selectedColors,
    };
    onSubmit(finalData as PrintDesignData);
  };

  const handleColorSelection = (colors: string[]) => {
    setSelectedColors(colors);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Printer className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold">Design Print Assisté par IA</h2>
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

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="w-5 h-5" />
              Type et Format
            </CardTitle>
            <CardDescription>
              Choisissez le type de support à créer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type de print */}
            <div className="space-y-3">
              <Label>Type de support *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {printTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.printType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                    onClick={() => updateFormData("printType", type.value)}
                  >
                    <h4 className="font-medium">{type.label}</h4>
                    <p className="text-sm text-gray-600">{type.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Nom du projet *</Label>
                <Input
                  id="projectName"
                  value={formData.projectName || ""}
                  onChange={(e) =>
                    updateFormData("projectName", e.target.value)
                  }
                  placeholder="Ex: Affiche concert été 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity || 100}
                  onChange={(e) =>
                    updateFormData("quantity", parseInt(e.target.value))
                  }
                  placeholder="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description du projet *</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description || ""}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Décrivez votre projet : objectif, message à transmettre, style souhaité..."
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
                  <SelectItem value="enfants-0-12">
                    Enfants (0-12 ans)
                  </SelectItem>
                  <SelectItem value="adolescents-13-17">
                    Adolescents (13-17 ans)
                  </SelectItem>
                  <SelectItem value="jeunes-18-25">
                    Jeunes adultes (18-25 ans)
                  </SelectItem>
                  <SelectItem value="adultes-26-40">
                    Adultes (26-40 ans)
                  </SelectItem>
                  <SelectItem value="adultes-41-60">
                    Adultes (41-60 ans)
                  </SelectItem>
                  <SelectItem value="seniors-60plus">
                    Seniors (60+ ans)
                  </SelectItem>
                  <SelectItem value="familles">
                    Familles avec enfants
                  </SelectItem>
                  <SelectItem value="professionnels">Professionnels</SelectItem>
                  <SelectItem value="etudiants">Étudiants</SelectItem>
                  <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                  <SelectItem value="artistes">Artistes et créatifs</SelectItem>
                  <SelectItem value="sportifs">Sportifs</SelectItem>
                  <SelectItem value="touristes">Touristes</SelectItem>
                  <SelectItem value="grand-public">Grand public</SelectItem>
                  <SelectItem value="autre">Autre (à préciser)</SelectItem>
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
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Dimensions et Spécifications
            </CardTitle>
            <CardDescription>
              Définissez les caractéristiques techniques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dimensions */}
            <div className="space-y-4">
              <Label>Dimensions</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Largeur</Label>
                  <Input
                    id="width"
                    type="number"
                    value={formData.dimensions?.width || ""}
                    onChange={(e) =>
                      updateFormData("dimensions", {
                        ...formData.dimensions,
                        width: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Hauteur</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.dimensions?.height || ""}
                    onChange={(e) =>
                      updateFormData("dimensions", {
                        ...formData.dimensions,
                        height: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unité</Label>
                  <Select
                    value={formData.dimensions?.unit || "mm"}
                    onValueChange={(value) =>
                      updateFormData("dimensions", {
                        ...formData.dimensions,
                        unit: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm">mm</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="in">pouces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Orientation */}
            <div className="space-y-3">
              <Label>Orientation</Label>
              <div className="flex gap-3">
                {[
                  { value: "portrait", label: "Portrait" },
                  { value: "landscape", label: "Paysage" },
                  { value: "square", label: "Carré" },
                ].map((orientation) => (
                  <div
                    key={orientation.value}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      formData.orientation === orientation.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                    onClick={() =>
                      updateFormData("orientation", orientation.value)
                    }
                  >
                    <span className="text-sm font-medium">
                      {orientation.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mode couleur */}
            <div className="space-y-3">
              <Label>Mode couleur</Label>
              <div className="flex gap-3">
                {[
                  {
                    value: "cmyk",
                    label: "CMYK",
                    desc: "Impression professionnelle",
                  },
                  { value: "rgb", label: "RGB", desc: "Affichage numérique" },
                  {
                    value: "pantone",
                    label: "Pantone",
                    desc: "Couleurs spéciales",
                  },
                ].map((mode) => (
                  <div
                    key={mode.value}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      formData.colorMode === mode.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                    onClick={() => updateFormData("colorMode", mode.value)}
                  >
                    <div className="font-medium text-sm">{mode.label}</div>
                    <div className="text-xs text-gray-600">{mode.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualité d'impression */}
            <div className="space-y-2">
              <Label>Qualité d'impression</Label>
              <Select
                value={formData.printQuality}
                onValueChange={(value) =>
                  updateFormData("printQuality", value as PrintQuality)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">
                    Standard - Bon rapport qualité/prix
                  </SelectItem>
                  <SelectItem value="premium">
                    Premium - Qualité supérieure
                  </SelectItem>
                  <SelectItem value="luxury">
                    Luxe - Qualité exceptionnelle
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Finitions */}
            <div className="space-y-3">
              <Label>Finitions (optionnelles)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "matte",
                  "gloss",
                  "satin",
                  "uv-coating",
                  "embossing",
                  "foil-stamping",
                  "die-cutting",
                ].map((finish) => (
                  <label
                    key={finish}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={formData.finishType?.includes(
                        finish as FinishType,
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData("finishType", [
                            ...(formData.finishType || []),
                            finish,
                          ]);
                        } else {
                          updateFormData(
                            "finishType",
                            formData.finishType?.filter((f) => f !== finish),
                          );
                        }
                      }}
                    />
                    <span className="text-sm capitalize">
                      {finish.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Couleurs et Style
              </CardTitle>
              <CardDescription>
                Choisissez les couleurs avec l'aide de notre IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="ai-generator" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ai-generator">Générateur IA</TabsTrigger>
                  <TabsTrigger value="content-elements">
                    Éléments de Contenu
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ai-generator" className="space-y-4">
                  <AIColorGenerator
                    industry="print-design"
                    projectType={formData.printType}
                    targetAudience={formData.targetAudience}
                    onColorSelect={handleColorSelection}
                  />

                  {selectedColors.length > 0 && (
                    <div className="mt-4">
                      <Label>Couleurs sélectionnées</Label>
                      <div className="flex gap-2 mt-2">
                        {selectedColors.map((color, index) => (
                          <div
                            key={index}
                            className="w-12 h-12 rounded border shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="content-elements" className="space-y-4">
                  <div className="space-y-3">
                    <Label>Éléments de contenu requis</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {contentElementsOptions.map((element) => {
                        const IconComponent = element.icon;
                        return (
                          <div
                            key={element.value}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              formData.contentElements?.includes(
                                element.value as ContentElement,
                              )
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-primary/50"
                            }`}
                            onClick={() => {
                              const isSelected =
                                formData.contentElements?.includes(
                                  element.value as ContentElement,
                                );
                              if (isSelected) {
                                updateFormData(
                                  "contentElements",
                                  formData.contentElements?.filter(
                                    (e) => e !== element.value,
                                  ),
                                );
                              } else {
                                updateFormData("contentElements", [
                                  ...(formData.contentElements || []),
                                  element.value,
                                ]);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-5 h-5 text-primary" />
                              <div>
                                <div className="font-medium text-sm">
                                  {element.label}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {element.desc}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Finalisation
            </CardTitle>
            <CardDescription>
              Vérifiez et complétez votre demande
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Récapitulatif */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">
                Récapitulatif de votre projet
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Type:</strong>{" "}
                    {
                      printTypes.find((t) => t.value === formData.printType)
                        ?.label
                    }
                  </p>
                  <p>
                    <strong>Dimensions:</strong> {formData.dimensions?.width} ×{" "}
                    {formData.dimensions?.height} {formData.dimensions?.unit}
                  </p>
                  <p>
                    <strong>Orientation:</strong> {formData.orientation}
                  </p>
                  <p>
                    <strong>Quantité:</strong> {formData.quantity}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Mode couleur:</strong>{" "}
                    {formData.colorMode?.toUpperCase()}
                  </p>
                  <p>
                    <strong>Qualité:</strong> {formData.printQuality}
                  </p>
                  <p>
                    <strong>Couleurs:</strong> {selectedColors.length}{" "}
                    sélectionnées
                  </p>
                  <p>
                    <strong>Éléments:</strong>{" "}
                    {formData.contentElements?.length || 0} éléments
                  </p>
                </div>
              </div>
            </div>

            {/* Notes supplémentaires */}
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">
                Notes et instructions supplémentaires
              </Label>
              <Textarea
                id="additionalNotes"
                rows={4}
                value={formData.additionalNotes || ""}
                onChange={(e) =>
                  updateFormData("additionalNotes", e.target.value)
                }
                placeholder="Références visuelles, contraintes spécifiques, délais particuliers..."
              />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Date limite souhaitée</Label>
              <Input
                id="deadline"
                type="date"
                value={
                  formData.deadline
                    ? formData.deadline.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  updateFormData("deadline", new Date(e.target.value))
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

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
        >
          {currentStep === totalSteps ? (
            <>
              <Sparkles size={16} />
              Envoyer la demande
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

export default PrintDesignForm;
