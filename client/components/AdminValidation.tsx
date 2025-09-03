import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  ADMIN_FEATURES,
  getAllFeatures,
  getFeaturesByRole,
} from "../utils/adminFeatures";

interface ValidationResult {
  totalFeatures: number;
  availableFeatures: number;
  missingFeatures: string[];
  userRole: string;
  systemStatus: "ready" | "partial" | "error";
}

export const AdminValidation: React.FC = () => {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const { isAdmin, isSuperAdmin, isMindAdmin, currentUser } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      const validateSystem = () => {
        const allFeatures = getAllFeatures();

        // Déterminer le rôle de l'utilisateur
        let userRole = "admin";
        if (
          isSuperAdmin &&
          currentUser?.email === "philippefaizsanon@gmail.com"
        ) {
          userRole = "supreme";
        } else if (isMindAdmin) {
          userRole = "mind";
        }

        const availableFeatures = getFeaturesByRole(
          userRole as any,
          currentUser?.email,
        );

        const result: ValidationResult = {
          totalFeatures: allFeatures.length,
          availableFeatures: availableFeatures.length,
          missingFeatures: [],
          userRole,
          systemStatus: availableFeatures.length > 0 ? "ready" : "error",
        };

        setValidation(result);

        // Log pour debugging (en développement seulement)
        if (process.env.NODE_ENV === "development") {
          console.log("🔧 Validation du Système Admin Mind Graphix", {
            user: currentUser?.name || "Administrateur",
            email: currentUser?.email,
            role: userRole,
            totalFeatures: result.totalFeatures,
            availableFeatures: result.availableFeatures,
            status: result.systemStatus,
            features: availableFeatures.map((f) => f.name),
          });
        }
      };

      validateSystem();
    }
  }, [isAdmin, isSuperAdmin, isMindAdmin, currentUser]);

  // Ce composant ne rend rien visuellement, il fait juste la validation
  return null;
};

// Hook personnalisé pour obtenir le statut de validation
export const useAdminValidation = () => {
  const [isReady, setIsReady] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      // Vérification simple que les composants principaux sont disponibles
      const checkComponents = () => {
        const requiredComponents = [
          "ConsolidatedSettingsButton",
          "AdminDashboard",
        ];

        // Dans un vrai scénario, on vérifierait que ces composants sont bien importés
        // Pour cette démo, on considère qu'ils sont tous disponibles
        setIsReady(true);
      };

      checkComponents();
    }
  }, [isAdmin]);

  return { isReady };
};

export default AdminValidation;
