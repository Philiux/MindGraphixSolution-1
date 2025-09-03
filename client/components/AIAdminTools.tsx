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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  Sparkles,
  Wand2,
  TrendingUp,
  BarChart3,
  Target,
  Lightbulb,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Clock,
  Star,
  Eye,
  FileText,
  Calculator,
  Palette,
  Users,
} from "lucide-react";
import { Quote, QuoteRequest } from "@/types/quote";
import { LogoDesignData, PrintDesignData } from "@/types/specializedServices";

interface AIAnalysis {
  projectComplexity: "simple" | "medium" | "complex" | "enterprise";
  estimatedHours: number;
  suggestedPrice: number;
  competitiveAdvantage: string[];
  riskFactors: string[];
  recommendations: string[];
  similarProjects: SimilarProject[];
  marketAnalysis: MarketAnalysis;
  profitabilityScore: number;
}

interface SimilarProject {
  id: string;
  title: string;
  completedDate: Date;
  actualHours: number;
  finalPrice: number;
  clientSatisfaction: number;
  challenges: string[];
}

interface MarketAnalysis {
  industryRate: number;
  demandLevel: "low" | "medium" | "high";
  seasonalFactors: string[];
  trendingFeatures: string[];
}

interface AIAdminToolsProps {
  quoteRequest?: QuoteRequest;
  onQuoteGenerated?: (quote: Quote) => void;
}

const AIAdminTools: React.FC<AIAdminToolsProps> = ({
  quoteRequest,
  onQuoteGenerated,
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<Partial<Quote> | null>(
    null,
  );
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [customAdjustments, setCustomAdjustments] = useState({
    priceMultiplier: 1,
    timeMultiplier: 1,
    complexityAdjustment: 0,
    notes: "",
  });

  const analyzeProject = async () => {
    if (!quoteRequest) return;

    setIsAnalyzing(true);

    // Simulation d'analyse IA avancée
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockAnalysis: AIAnalysis = {
      projectComplexity: determineComplexity(quoteRequest),
      estimatedHours: calculateEstimatedHours(quoteRequest),
      suggestedPrice: calculateSuggestedPrice(quoteRequest),
      competitiveAdvantage: [
        "Expertise unique en design IA-assisté",
        "Livraison 30% plus rapide que la concurrence",
        "Support post-livraison inclus",
        "Optimisation SEO intégrée",
      ],
      riskFactors: [
        "Délai serré demandé par le client",
        "Secteur hautement concurrentiel",
        "Besoins techniques complexes",
      ],
      recommendations: [
        "Proposer une approche en phases",
        "Inclure options de révisions limitées",
        "Mettre en avant notre expertise IA",
        "Proposer un suivi post-livraison",
      ],
      similarProjects: [
        {
          id: "1",
          title: "Logo startup tech similaire",
          completedDate: new Date("2024-01-15"),
          actualHours: 25,
          finalPrice: 3500,
          clientSatisfaction: 9.2,
          challenges: ["Révisions multiples", "Brief initial flou"],
        },
        {
          id: "2",
          title: "Identité visuelle fintech",
          completedDate: new Date("2024-02-10"),
          actualHours: 35,
          finalPrice: 5200,
          clientSatisfaction: 9.8,
          challenges: ["Contraintes réglementaires", "Délai serré"],
        },
      ],
      marketAnalysis: {
        industryRate: 150, // €/heure
        demandLevel: "high",
        seasonalFactors: ["Pic d'activité Q4", "Ralentissement été"],
        trendingFeatures: [
          "Design minimaliste",
          "Couleurs vives",
          "Typographie personnalisée",
        ],
      },
      profitabilityScore: 8.5,
    };

    setAiAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const determineComplexity = (
    request: QuoteRequest,
  ): AIAnalysis["projectComplexity"] => {
    const services = request.services?.length || 0;
    const budget = request.projectInfo.budget;

    if (services <= 2 && ["under-1000", "1000-5000"].includes(budget))
      return "simple";
    if (services <= 4 && ["5000-10000", "10000-25000"].includes(budget))
      return "medium";
    if (services > 4 || ["25000-50000", "over-50000"].includes(budget))
      return "complex";

    return "medium";
  };

  const calculateEstimatedHours = (request: QuoteRequest): number => {
    const baseHours = {
      "logo-design": 20,
      "website-development": 80,
      "print-design": 15,
      branding: 60,
      "mobile-app": 120,
      "marketing-material": 10,
    };

    return (
      request.services?.reduce((total, service) => {
        return (
          total + (baseHours[service.category as keyof typeof baseHours] || 20)
        );
      }, 0) || 40
    );
  };

  const calculateSuggestedPrice = (request: QuoteRequest): number => {
    const hourlyRate = 120; // €/heure
    const hours = calculateEstimatedHours(request);
    const complexityMultiplier = {
      simple: 1,
      medium: 1.2,
      complex: 1.5,
      enterprise: 2,
    };

    const complexity = determineComplexity(request);
    return Math.round(hours * hourlyRate * complexityMultiplier[complexity]);
  };

  const generateQuote = async () => {
    if (!aiAnalysis || !quoteRequest) return;

    setIsGeneratingQuote(true);

    // Simulation de génération de devis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const adjustedPrice = Math.round(
      aiAnalysis.suggestedPrice * customAdjustments.priceMultiplier,
    );
    const adjustedHours = Math.round(
      aiAnalysis.estimatedHours * customAdjustments.timeMultiplier,
    );

    const quote: Partial<Quote> = {
      id: `Q${Date.now()}`,
      quoteNumber: `MGS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      clientInfo: quoteRequest.clientInfo,
      projectInfo: quoteRequest.projectInfo,
      services: generateServiceItems(quoteRequest, adjustedPrice),
      pricing: {
        subtotal: adjustedPrice,
        tax: Math.round(adjustedPrice * 0.2),
        total: Math.round(adjustedPrice * 1.2),
        currency: "EUR",
      },
      timeline: generateTimeline(adjustedHours),
      terms: {
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        paymentTerms:
          "30% à la signature, 40% à mi-parcours, 30% à la livraison",
        deliverables: generateDeliverables(quoteRequest),
        additionalNotes:
          customAdjustments.notes || "Devis généré avec assistance IA",
      },
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setGeneratedQuote(quote);
    setIsGeneratingQuote(false);
  };

  const generateServiceItems = (request: QuoteRequest, totalPrice: number) => {
    return (
      request.services?.map((service, index) => ({
        id: (index + 1).toString(),
        name: service.name,
        description: service.description || `${service.name} personnalisé`,
        quantity: 1,
        unitPrice: Math.round(totalPrice / request.services.length),
        total: Math.round(totalPrice / request.services.length),
        category: service.category,
      })) || []
    );
  };

  const generateTimeline = (totalHours: number) => {
    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + (totalHours / 8) * 24 * 60 * 60 * 1000,
    );

    return {
      estimatedStartDate: startDate,
      estimatedEndDate: endDate,
      milestones: [
        {
          id: "1",
          title: "Conception et Design",
          description: "Phase créative initiale",
          dueDate: new Date(
            startDate.getTime() +
              ((totalHours * 0.4) / 8) * 24 * 60 * 60 * 1000,
          ),
          deliverables: ["Concepts initiaux", "Maquettes"],
          paymentPercentage: 30,
        },
        {
          id: "2",
          title: "Développement",
          description: "Réalisation technique",
          dueDate: new Date(
            startDate.getTime() +
              ((totalHours * 0.8) / 8) * 24 * 60 * 60 * 1000,
          ),
          deliverables: ["Version beta", "Tests"],
          paymentPercentage: 40,
        },
        {
          id: "3",
          title: "Finalisation",
          description: "Livraison finale",
          dueDate: endDate,
          deliverables: ["Version finale", "Documentation"],
          paymentPercentage: 30,
        },
      ],
    };
  };

  const generateDeliverables = (request: QuoteRequest): string[] => {
    const baseDeliverables = [
      "Fichiers sources haute qualité",
      "Formats d'export multiples",
      "Guide d'utilisation",
      "Support technique",
    ];

    const serviceSpecificDeliverables: Record<string, string[]> = {
      design: ["Fichiers vectoriels", "Palettes couleurs", "Variantes logo"],
      development: ["Code source", "Documentation technique", "Formation"],
      marketing: ["Assets marketing", "Templates", "Guide de marque"],
    };

    const additionalDeliverables =
      request.services?.reduce((acc, service) => {
        const specific = serviceSpecificDeliverables[service.category] || [];
        return [...acc, ...specific];
      }, [] as string[]) || [];

    return [...baseDeliverables, ...additionalDeliverables];
  };

  const getComplexityColor = (complexity: AIAnalysis["projectComplexity"]) => {
    const colors = {
      simple: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      complex: "bg-orange-100 text-orange-800",
      enterprise: "bg-red-100 text-red-800",
    };
    return colors[complexity];
  };

  const getProfitabilityColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  if (!quoteRequest) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Aucune demande sélectionnée
          </h3>
          <p className="text-gray-500">
            Sélectionnez une demande de devis pour activer l'analyse IA
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Assistant IA Administration
          </h2>
          <Wand2 className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-gray-600">
          Analyse intelligente et génération automatique de devis pour :{" "}
          <strong>{quoteRequest.projectInfo.title}</strong>
        </p>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Analyse IA</TabsTrigger>
          <TabsTrigger value="quote-generation">Génération Devis</TabsTrigger>
          <TabsTrigger value="market-insights">Insights Marché</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          {!aiAnalysis ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Brain className="w-12 h-12 text-purple-600" />
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Analyse IA du Projet
                </h3>
                <p className="text-gray-600 mb-6">
                  Notre IA va analyser la demande, évaluer la complexité,
                  estimer les coûts et identifier les opportunités
                  d'optimisation.
                </p>
                <Button
                  onClick={analyzeProject}
                  disabled={isAnalyzing}
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Lancer l'Analyse IA
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vue d'ensemble */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Vue d'Ensemble
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Complexité</span>
                    <Badge
                      className={getComplexityColor(
                        aiAnalysis.projectComplexity,
                      )}
                    >
                      {aiAnalysis.projectComplexity}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Heures estimées</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">
                        {aiAnalysis.estimatedHours}h
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Prix suggéré</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {aiAnalysis.suggestedPrice.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Score Rentabilité</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span
                        className={`font-semibold ${getProfitabilityColor(aiAnalysis.profitabilityScore)}`}
                      >
                        {aiAnalysis.profitabilityScore}/10
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Avantages concurrentiels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Avantages Concurrentiels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {aiAnalysis.competitiveAdvantage.map((advantage, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Facteurs de risque */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Facteurs de Risque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {aiAnalysis.riskFactors.map((risk, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recommandations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Recommandations IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {aiAnalysis.recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="quote-generation" className="space-y-6">
          {!aiAnalysis ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">
                  Veuillez d'abord effectuer l'analyse IA
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Ajustements personnalisés */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Ajustements Personnalisés
                  </CardTitle>
                  <CardDescription>
                    Modifiez les paramètres suggérés par l'IA selon votre
                    expertise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Multiplicateur Prix</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="3"
                        value={customAdjustments.priceMultiplier}
                        onChange={(e) =>
                          setCustomAdjustments((prev) => ({
                            ...prev,
                            priceMultiplier: parseFloat(e.target.value),
                          }))
                        }
                      />
                      <p className="text-xs text-gray-500">
                        Prix ajusté:{" "}
                        {Math.round(
                          aiAnalysis.suggestedPrice *
                            customAdjustments.priceMultiplier,
                        ).toLocaleString()}{" "}
                        €
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Multiplicateur Temps</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="3"
                        value={customAdjustments.timeMultiplier}
                        onChange={(e) =>
                          setCustomAdjustments((prev) => ({
                            ...prev,
                            timeMultiplier: parseFloat(e.target.value),
                          }))
                        }
                      />
                      <p className="text-xs text-gray-500">
                        Temps ajusté:{" "}
                        {Math.round(
                          aiAnalysis.estimatedHours *
                            customAdjustments.timeMultiplier,
                        )}
                        h
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes supplémentaires</Label>
                    <Textarea
                      value={customAdjustments.notes}
                      onChange={(e) =>
                        setCustomAdjustments((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Justifications des ajustements, notes internes..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Génération du devis */}
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold mb-4">
                    Génération Automatique du Devis
                  </h3>
                  <p className="text-gray-600 mb-6">
                    L'IA va créer un devis détaillé avec timeline, jalons et
                    conditions
                  </p>
                  <Button
                    onClick={generateQuote}
                    disabled={isGeneratingQuote}
                    size="lg"
                  >
                    {isGeneratingQuote ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Générer le Devis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Devis généré */}
              {generatedQuote && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Devis Généré - {generatedQuote.quoteNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Total HT</div>
                        <div className="text-lg font-bold">
                          {generatedQuote.pricing?.subtotal.toLocaleString()} €
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">TVA</div>
                        <div className="text-lg font-bold">
                          {generatedQuote.pricing?.tax.toLocaleString()} €
                        </div>
                      </div>
                      <div className="bg-primary/10 p-3 rounded">
                        <div className="text-sm text-primary">Total TTC</div>
                        <div className="text-lg font-bold text-primary">
                          {generatedQuote.pricing?.total.toLocaleString()} €
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() =>
                          onQuoteGenerated?.(generatedQuote as Quote)
                        }
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Valider et Envoyer
                      </Button>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Prévisualiser
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="market-insights" className="space-y-6">
          {aiAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Analyse de Marché
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Taux horaire industrie</span>
                    <span className="font-semibold">
                      {aiAnalysis.marketAnalysis.industryRate} €/h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Niveau de demande</span>
                    <Badge
                      className={
                        aiAnalysis.marketAnalysis.demandLevel === "high"
                          ? "bg-green-100 text-green-800"
                          : aiAnalysis.marketAnalysis.demandLevel === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {aiAnalysis.marketAnalysis.demandLevel}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Facteurs saisonniers</h4>
                    <ul className="space-y-1">
                      {aiAnalysis.marketAnalysis.seasonalFactors.map(
                        (factor, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            • {factor}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Projets Similaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiAnalysis.similarProjects.map((project) => (
                      <div key={project.id} className="border rounded p-3">
                        <h4 className="font-medium text-sm">{project.title}</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                          <div>Heures: {project.actualHours}h</div>
                          <div>
                            Prix: {project.finalPrice.toLocaleString()} €
                          </div>
                          <div>
                            Satisfaction: {project.clientSatisfaction}/10
                          </div>
                          <div>
                            Date: {project.completedDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAdminTools;
