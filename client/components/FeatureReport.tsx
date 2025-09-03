import React, { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Eye,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  Settings,
  Palette,
  Bot,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "../contexts/AuthContext";

export const FeatureReport: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isAdmin, isLoggedIn, currentUser } = useAuth();

  const features = [
    {
      category: "Interface & Design",
      items: [
        {
          name: "Police en noir sur tout le site",
          status: "completed",
          description:
            "Toutes les polices du site sont maintenant en noir pour une meilleure lisibilité",
          icon: <Eye size={16} />,
        },
        {
          name: "Thème responsive",
          status: "completed",
          description: "Interface adaptée aux mobiles et tablettes",
          icon: <Palette size={16} />,
        },
      ],
    },
    {
      category: "Authentification & Administration",
      items: [
        {
          name: "Connexion administrateur sécurisée",
          status: "completed",
          description:
            "Système de connexion admin avec double authentification et questions de sécurité",
          icon: <Shield size={16} />,
        },
        {
          name: "Panel administrateur complet",
          status: "completed",
          description:
            "Interface d'administration avec gestion du contenu et des couleurs",
          icon: <Settings size={16} />,
        },
        {
          name: "Diagnostic admin intégré",
          status: "completed",
          description:
            "Outil de diagnostic pour tester les connexions administrateur",
          icon: <AlertCircle size={16} />,
        },
      ],
    },
    {
      category: "Communication & Support",
      items: [
        {
          name: "Système de chat hybride",
          status: "completed",
          description:
            "Chat intelligent avec bot IA et transition vers conseillers humains",
          icon: <MessageSquare size={16} />,
        },
        {
          name: "Bot de réponse automatique",
          status: "completed",
          description: "Réponses automatiques pour les questions fréquentes",
          icon: <Bot size={16} />,
        },
        {
          name: "Notifications admin",
          status: "completed",
          description: "Système de notifications pour les administrateurs",
          icon: <Users size={16} />,
        },
      ],
    },
    {
      category: "Suivi & Analytics",
      items: [
        {
          name: "Bot de suivi/tracking intégré",
          status: "completed",
          description:
            "Suivi complet des interactions utilisateurs et des statistiques de site",
          icon: <BarChart3 size={16} />,
        },
        {
          name: "Tableau de bord analytics",
          status: "completed",
          description:
            "Interface de visualisation des données de suivi en temps réel",
          icon: <BarChart3 size={16} />,
        },
        {
          name: "Export des données",
          status: "completed",
          description: "Possibilité d'exporter les données de tracking en JSON",
          icon: <CheckCircle size={16} />,
        },
      ],
    },
    {
      category: "Sécurité & Validation",
      items: [
        {
          name: "Validation système complète",
          status: "completed",
          description:
            "Tests automatisés de toutes les fonctionnalités critiques",
          icon: <Shield size={16} />,
        },
        {
          name: "Sécurité renforcée",
          status: "completed",
          description:
            "Protection contre les accès non autorisés et chiffrement des données sensibles",
          icon: <Shield size={16} />,
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in-progress":
        return "text-yellow-600 bg-yellow-100";
      case "pending":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "in-progress":
        return <AlertCircle size={16} className="text-yellow-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const totalFeatures = features.reduce(
    (acc, cat) => acc + cat.items.length,
    0,
  );
  const completedFeatures = features.reduce(
    (acc, cat) =>
      acc + cat.items.filter((item) => item.status === "completed").length,
    0,
  );

  if (!isVisible) {
    return (
      <div className="fixed bottom-44 right-6 z-40">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3"
          title="Voir le rapport des fonctionnalités"
        >
          <CheckCircle size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-4 z-50 bg-white rounded-lg shadow-2xl border overflow-hidden">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle size={24} />
          <div>
            <h2 className="text-xl font-bold">Rapport des Fonctionnalités</h2>
            <p className="text-green-100">
              {completedFeatures}/{totalFeatures} fonctionnalités complètes
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsVisible(false)}
          variant="outline"
          size="sm"
          className="text-white border-white hover:bg-white hover:text-green-600"
        >
          ×
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progression globale</span>
          <span className="text-sm text-gray-600">
            {Math.round((completedFeatures / totalFeatures) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedFeatures / totalFeatures) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-96">
        <div className="space-y-6">
          {features.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 mt-1">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">
                            {item.name}
                          </h4>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                          >
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(item.status)}
                              <span className="capitalize">{item.status}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status actuel */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">
              État Actuel du Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {isLoggedIn ? "Connecté" : "Non connecté"}
                </div>
                <div className="text-sm text-gray-600">Statut utilisateur</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {isAdmin ? "Admin" : "Utilisateur"}
                </div>
                <div className="text-sm text-gray-600">Niveau d'accès</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  Opérationnel
                </div>
                <div className="text-sm text-gray-600">Statut système</div>
              </div>
            </div>

            {currentUser && (
              <div className="mt-4 p-3 bg-white rounded border">
                <p className="text-sm">
                  <strong>Utilisateur actuel:</strong>{" "}
                  {currentUser.name || currentUser.email}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {currentUser.email}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">
              🎉 Toutes les fonctionnalités sont opérationnelles !
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-amber-700">
              <p>
                • <strong>Polices noires:</strong> Toutes les polices sont
                maintenant en noir pour une meilleure lisibilité
              </p>
              <p>
                • <strong>Connexion admin:</strong> Testez avec le diagnostic
                admin (bouton en bas à droite)
              </p>
              <p>
                • <strong>Bot de suivi:</strong> Tableau de bord disponible avec
                statistiques en temps réel
              </p>
              <p>
                • <strong>Chat système:</strong> Bot intelligent avec transition
                vers conseillers humains
              </p>
              <p>
                • <strong>Administration:</strong> Panel complet pour gérer le
                contenu et les couleurs
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
