import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  X,
  ArrowRight,
  MessageCircle,
  FileText,
  User,
  Check,
  Lightbulb,
  PlayCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action?: () => void;
  actionLabel?: string;
}

export const QuickStartGuide: React.FC = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Définition des étapes pour les invités et utilisateurs connectés
  const guestSteps: GuideStep[] = [
    {
      id: "explore",
      title: "Explorez nos services",
      description: "Découvrez notre portfolio et nos solutions créatives",
      icon: Lightbulb,
      action: () => {
        // Essayer de scroller vers la section services sur la page actuelle
        const servicesSection = document.getElementById("services");
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: "smooth" });
        } else {
          // Si on n'est pas sur la page d'accueil, rediriger vers la page services
          navigate("/services");
        }
        markStepCompleted("explore");
      },
      actionLabel: "Voir les services",
    },
    {
      id: "chat",
      title: "Discutez avec notre IA",
      description: "Notre assistant IA peut vous aider à définir votre projet",
      icon: MessageCircle,
      action: () => {
        // Déclencher l'ouverture du bot IA
        window.dispatchEvent(new CustomEvent("openAIBot"));
        markStepCompleted("chat");
      },
      actionLabel: "Ouvrir le chat",
    },
    {
      id: "quote",
      title: "Demandez un devis",
      description: "Obtenez une estimation personnalisée pour votre projet",
      icon: FileText,
      action: () => {
        navigate("/demande-devis");
        markStepCompleted("quote");
      },
      actionLabel: "Demander un devis",
    },
    {
      id: "register",
      title: "Créez votre compte",
      description: "Suivez vos projets et recevez des mises à jour",
      icon: User,
      action: () => {
        // Déclencher l'ouverture du modal d'inscription
        window.dispatchEvent(new CustomEvent("openRegisterModal"));
        markStepCompleted("register");
      },
      actionLabel: "S'inscrire",
    },
  ];

  const userSteps: GuideStep[] = [
    {
      id: "dashboard",
      title: "Accédez à votre espace",
      description: "Consultez vos projets et demandes en cours",
      icon: User,
      action: () => {
        navigate("/client-dashboard");
        markStepCompleted("dashboard");
      },
      actionLabel: "Espace Client",
    },
    {
      id: "requests",
      title: "Suivez vos demandes",
      description: "Consultez l'état de vos demandes de devis",
      icon: FileText,
      action: () => {
        navigate("/mes-devis");
        markStepCompleted("requests");
      },
      actionLabel: "Mes demandes",
    },
    {
      id: "chat",
      title: "Utilisez le chat IA",
      description: "Posez des questions ou demandez de l'aide",
      icon: MessageCircle,
      action: () => {
        window.dispatchEvent(new CustomEvent("openAIBot"));
        markStepCompleted("chat");
      },
      actionLabel: "Ouvrir le chat",
    },
  ];

  const steps = isLoggedIn ? userSteps : guestSteps;

  const markStepCompleted = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps((prev) => [...prev, stepId]);

      // Feedback visuel
      const step = steps.find((s) => s.id === stepId);
      if (step) {
        toast({
          title: "✅ Étape terminée !",
          description: `"${step.title}" a été complétée avec succès.`,
        });
      }
    }
  };

  useEffect(() => {
    // Afficher le guide pour les nouveaux utilisateurs
    const hasSeenGuide = localStorage.getItem("hasSeenQuickStartGuide");
    if (!hasSeenGuide && !isAdmin) {
      setTimeout(() => setIsVisible(true), 2000);
    }

    // Gestionnaire d'événement pour rouvrir le guide depuis l'administration
    const handleReopenGuide = () => {
      setIsVisible(true);
      setCurrentStep(0);
      setCompletedSteps([]);
    };

    window.addEventListener("reopenQuickStartGuide", handleReopenGuide);
    return () =>
      window.removeEventListener("reopenQuickStartGuide", handleReopenGuide);
  }, [isAdmin]);

  // Raccourcis clavier pour le guide
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeGuide();
      } else if (e.key === "ArrowRight" && currentStep < steps.length - 1) {
        nextStep();
      } else if (e.key === "ArrowLeft" && currentStep > 0) {
        prevStep();
      } else if (e.key === "Enter" && steps[currentStep]?.action) {
        steps[currentStep].action!();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, currentStep, steps]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeGuide = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenQuickStartGuide", "true");
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData?.icon || Lightbulb;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Guide de démarrage</h2>
                <p className="text-white/80">
                  {isLoggedIn
                    ? "Découvrez votre espace"
                    : "Bienvenue chez Mind Graphix"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeGuide}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-6 py-3 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>
                Étape {currentStep + 1} sur {steps.length}
              </span>
              <span>
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentStepData.title}
                  </h3>
                  <p className="text-gray-600">{currentStepData.description}</p>
                </div>

                {/* Action button */}
                {currentStepData.action && (
                  <div className="text-center mb-6">
                    <Button
                      onClick={currentStepData.action}
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-3"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {currentStepData.actionLabel}
                    </Button>
                  </div>
                )}

                {/* Step indicators */}
                <div className="flex justify-center space-x-2 mb-6">
                  {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isCurrent = index === currentStep;

                    return (
                      <motion.div
                        key={step.id}
                        className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                          isCompleted
                            ? "bg-green-500"
                            : isCurrent
                              ? "bg-primary"
                              : "bg-gray-300"
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                          scale: isCurrent ? [1, 1.1, 1] : 1,
                        }}
                        transition={{
                          duration: 0.3,
                          repeat: isCurrent ? Infinity : 0,
                          repeatType: "reverse",
                        }}
                        onClick={() => setCurrentStep(index)}
                        title={`Étape ${index + 1}: ${step.title}`}
                      >
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-full h-full bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-2 h-2 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-4"
                  >
                    Précédent
                  </Button>

                  {currentStep === steps.length - 1 ? (
                    <Button onClick={closeGuide} className="px-6">
                      <Check className="w-4 h-4 mr-2" />
                      Terminer
                    </Button>
                  ) : (
                    <Button onClick={nextStep} className="px-6">
                      Suivant
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                onClick={closeGuide}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Passer le guide
              </button>
              <div className="text-xs text-gray-400 space-y-1">
                <div>📌 Raccourcis: ← → pour naviguer</div>
                <div>⏎ Entrée pour l'action • Échap pour fermer</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickStartGuide;
