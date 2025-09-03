import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  X,
  ArrowRight,
  Check,
  FileText,
  Send,
  Eye,
} from "lucide-react";
import { ModernCard, GradientText } from "./ModernVisualEffects";

export const QuoteProcessGuide: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const steps = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "1. Examiner la Demande",
      description:
        "Cliquez sur 'Détails' pour voir toutes les informations du client et du projet.",
      action: "Bouton 'Détails'",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "2. Créer le Devis",
      description:
        "Cliquez sur 'Créer Devis' pour générer automatiquement un devis basé sur les services demandés.",
      action: "Bouton 'Créer Devis'",
    },
    {
      icon: <Check className="w-6 h-6" />,
      title: "3. Personnaliser",
      description:
        "Modifiez les prix, délais et conditions selon vos tarifs et disponibilités.",
      action: "Bouton 'Modifier'",
    },
    {
      icon: <Send className="w-6 h-6" />,
      title: "4. Envoyer au Client",
      description: "Une fois finalisé, envoyez le devis au client par email.",
      action: "Bouton 'Envoyer'",
    },
  ];

  return (
    <>
      {/* Bouton d'aide */}
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 z-50 p-3 bg-blue-600/90 hover:bg-blue-600 text-white rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 group"
        title="Guide du processus de devis"
      >
        <HelpCircle
          size={20}
          className="group-hover:scale-110 transition-transform"
        />
      </button>

      {/* Modal du guide */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full"
            >
              <ModernCard className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    <GradientText>🎯 Comment Traiter les Devis</GradientText>
                  </h2>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Description */}
                <p className="text-white/80 mb-8 leading-relaxed">
                  Voici le processus simple pour traiter efficacement les
                  demandes de devis reçues :
                </p>

                {/* Étapes */}
                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">
                          {step.title}
                        </h3>
                        <p className="text-white/70 text-sm mb-2">
                          {step.description}
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-xs">
                          <span>Action:</span>
                          <span className="font-medium">{step.action}</span>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <ArrowRight className="text-white/30 mt-4" size={20} />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Conseils */}
                <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <h4 className="font-semibold text-yellow-200 mb-2">
                    💡 Conseils Pro
                  </h4>
                  <ul className="text-yellow-200/80 text-sm space-y-1">
                    <li>
                      • Répondez rapidement aux demandes pour maximiser vos
                      chances
                    </li>
                    <li>
                      • Personnalisez toujours les prix selon la complexité
                      réelle
                    </li>
                    <li>
                      • Ajoutez des détails sur votre approche dans les notes
                    </li>
                    <li>• Suivez le statut des devis dans l'onglet "Devis"</li>
                  </ul>
                </div>

                {/* Bouton de fermeture */}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setIsVisible(false)}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    ✅ Compris !
                  </button>
                </div>
              </ModernCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
