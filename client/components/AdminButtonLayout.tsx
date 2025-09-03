import React from "react";

/**
 * Système de positionnement organisé pour les boutons administrateurs
 * Évite les chevauchements en définissant des zones spécifiques
 */
export const AdminButtonPositions = {
  // Côté gauche - boutons principaux (de bas en haut)
  primarySettings: "fixed bottom-6 left-6 z-30", // ConsolidatedSettingsButton
  healthChecker: "fixed bottom-24 left-6 z-40", // AppHealthChecker
  userGuide: "fixed bottom-42 left-6 z-50", // AdminUserGuide

  // Outils spécialisés conservés
  designTools: "fixed top-20 right-4 z-40", // AdminDesignTools
  securityPanel:
    "fixed bottom-2 left-2 opacity-5 hover:opacity-100 transition-opacity duration-300", // SupremeSecurityPanel
  aiAssistant: "fixed bottom-6 right-24 z-50", // SupremeAIAssistant pour admins

  // Indicateurs discrets
  adminIndicator: "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30", // DiscreteAdminIndicator
};

/**
 * Composant wrapper pour organiser visuellement les boutons admin
 */
export const AdminButtonLayoutGuide: React.FC<{ isVisible: boolean }> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      {/* Grille de guidage pour le développement */}
      <div className="absolute inset-0 opacity-20">
        {/* Zones gauche */}
        <div className="absolute bottom-6 left-6 w-16 h-16 border-2 border-blue-400 rounded-lg bg-blue-400/10">
          <div className="text-xs text-blue-400 p-1">Settings</div>
        </div>
        <div className="absolute bottom-24 left-6 w-16 h-16 border-2 border-green-400 rounded-lg bg-green-400/10">
          <div className="text-xs text-green-400 p-1">Health</div>
        </div>
        <div className="absolute bottom-42 left-6 w-16 h-16 border-2 border-purple-400 rounded-lg bg-purple-400/10">
          <div className="text-xs text-purple-400 p-1">Guide</div>
        </div>

        {/* Zones droite */}
        <div className="absolute bottom-6 left-24 w-16 h-16 border-2 border-yellow-400 rounded-lg bg-yellow-400/10">
          <div className="text-xs text-yellow-400 p-1">Perf</div>
        </div>
        <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-red-400 rounded-lg bg-red-400/10">
          <div className="text-xs text-red-400 p-1">Palette</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook pour obtenir la position d'un bouton admin
 */
export const useAdminButtonPosition = (
  buttonType: keyof typeof AdminButtonPositions,
) => {
  return AdminButtonPositions[buttonType];
};
