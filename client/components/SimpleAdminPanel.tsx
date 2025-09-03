import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  FileText,
  Users,
  MessageSquare,
  Eye,
  Save,
  X,
  RefreshCw,
  Shield,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

export const SimpleAdminPanel: React.FC = () => {
  const {
    isAdmin,
    isSuperAdmin,
    isMindAdmin,
    currentUser,
    isEditMode,
    toggleEditMode,
    logout,
    updateContent,
    getContent,
  } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  // Visible seulement pour les admins qui ne sont pas Philippe ou Mind
  const isSimpleAdmin = isAdmin && !isMindAdmin;
  const isNotPhilippe = currentUser?.email !== "philippefaizsanon@gmail.com";
  const isNotMindAdmin =
    currentUser?.email !== "admin@mindgraphix.com" &&
    currentUser?.role !== "mind";

  if (!isSimpleAdmin || !isNotPhilippe || !isNotMindAdmin) return null;

  const handleContentUpdate = (key: string, value: string) => {
    updateContent(key, value);
  };

  const simplifiedSections = [
    {
      key: "hero.title",
      label: "Titre Principal",
      type: "text",
      defaultValue: "Mind Graphix Solution",
    },
    {
      key: "hero.subtitle",
      label: "Sous-titre",
      type: "textarea",
      defaultValue: "Votre partenaire digital de confiance",
    },
    {
      key: "about.description",
      label: "Description À Propos",
      type: "textarea",
      defaultValue: "Description de l'entreprise",
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        title="Panneau Admin Simple"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings size={24} />
                  <div>
                    <h2 className="text-2xl font-bold">Administration</h2>
                    <p className="text-blue-200 text-sm">
                      Panneau d'administration standard • {currentUser?.name}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-800 rounded-full text-xs font-bold">
                    ADMIN
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={toggleEditMode}
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    {isEditMode ? (
                      <>
                        <Save size={16} className="mr-2" />
                        Mode Édition ON
                      </>
                    ) : (
                      <>
                        <Eye size={16} className="mr-2" />
                        Mode Lecture
                      </>
                    )}
                  </Button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-blue-800 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Tabs simplifiés */}
              <div className="flex space-x-4 mt-4">
                {[
                  { id: "content", label: "Contenu", icon: FileText },
                  { id: "requests", label: "Demandes", icon: MessageSquare },
                  { id: "users", label: "Utilisateurs", icon: Users },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-white text-blue-600"
                        : "text-blue-200 hover:text-white hover:bg-blue-800"
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
              {activeTab === "content" && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Shield size={16} className="text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Accès Administrateur Standard
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Vous avez accès aux fonctionnalités de base
                      d'administration. Pour des fonctionnalités avancées,
                      contactez l'administrateur suprême.
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {simplifiedSections.map((section) => (
                      <div
                        key={section.key}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {section.label}
                        </label>
                        {section.type === "textarea" ? (
                          <textarea
                            value={getContent(
                              section.key,
                              section.defaultValue,
                            )}
                            onChange={(e) =>
                              handleContentUpdate(section.key, e.target.value)
                            }
                            disabled={!isEditMode}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        ) : (
                          <input
                            type="text"
                            value={getContent(
                              section.key,
                              section.defaultValue,
                            )}
                            onChange={(e) =>
                              handleContentUpdate(section.key, e.target.value)
                            }
                            disabled={!isEditMode}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "requests" && (
                <div className="text-center py-12">
                  <MessageSquare
                    size={48}
                    className="mx-auto mb-4 text-gray-400"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Gestion des Demandes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Consultez et gérez les demandes clients
                  </p>
                  <p className="text-sm text-yellow-600">
                    Fonctionnalité en cours de développement pour les
                    administrateurs standards
                  </p>
                </div>
              )}

              {activeTab === "users" && (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Gestion des Utilisateurs
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Consultez la liste des utilisateurs inscrits
                  </p>
                  <p className="text-sm text-yellow-600">
                    Accès en lecture seule pour les administrateurs standards
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
