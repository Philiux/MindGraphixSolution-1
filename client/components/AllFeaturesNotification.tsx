import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Settings,
  Users,
  FileText,
  Palette,
  BarChart3,
  Shield,
  X,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "../contexts/AuthContext";

export const AllFeaturesNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isLoggedIn, currentUser } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      const hasSeenAllFeatures = localStorage.getItem(
        "allFeaturesNotificationSeen",
      );
      if (!hasSeenAllFeatures) {
        setTimeout(() => setIsVisible(true), 2000); // Afficher après 2 secondes
      }
    }
  }, [isLoggedIn]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("allFeaturesNotificationSeen", "true");
  };

  const features = [
    {
      icon: Settings,
      title: "Tableau de Bord",
      description: "Interface d'administration complète",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: FileText,
      title: "Gestion des Devis",
      description: "Créer et gérer vos demandes",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Statistiques en temps réel",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Palette,
      title: "Personnalisation",
      description: "Thèmes et styles personnalisés",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      icon: Users,
      title: "Gestion Utilisateurs",
      description: "Administration des comptes",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Shield,
      title: "Fonctions Avancées",
      description: "Outils d'administration",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  if (!isLoggedIn || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-white shadow-2xl border-2 border-primary/20">
            <CardHeader className="text-center relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="absolute top-2 right-2"
              >
                <X size={16} />
              </Button>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
              >
                <Sparkles className="text-white" size={32} />
              </motion.div>

              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Toutes les fonctionnalités sont maintenant accessibles !
              </CardTitle>

              <p className="text-gray-600">
                Bonjour{" "}
                <span className="font-semibold text-primary">
                  {currentUser?.name || "utilisateur"}
                </span>{" "}
                ! Vous avez maintenant accès à toutes les fonctionnalités de
                Mind Graphix, qu'elles soient pour les utilisateurs standards ou
                les administrateurs.
              </p>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg ${feature.bgColor} border border-gray-200 hover:shadow-md transition-all`}
                  >
                    <div className="flex items-center space-x-3">
                      <feature.icon
                        className={`${feature.color} flex-shrink-0`}
                        size={20}
                      />
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Star className="text-primary mr-2" size={16} />
                  Comment accéder aux fonctionnalités :
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    • <strong>Dashboard :</strong> Menu "Dashboard" ou lien dans
                    votre profil
                  </li>
                  <li>
                    • <strong>Paramètres :</strong> Bouton flottant en bas à
                    gauche
                  </li>
                  <li>
                    • <strong>Panel Suprême :</strong> Point rouge discret en
                    haut à droite
                  </li>
                  <li>
                    • <strong>Gestion Devis :</strong> Menu "Mes Devis" ou
                    /admin/quotes
                  </li>
                </ul>
              </div>

              <div className="flex justify-center space-x-3">
                <Button
                  onClick={handleClose}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Parfait, j'ai compris !
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
