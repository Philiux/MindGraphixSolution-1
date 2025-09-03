import React, { useState, useEffect } from "react";
import { DollarSign, Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface ServicePrice {
  id: string;
  title: string;
  price: string;
  timeline: string;
  description: string;
}

const defaultPrices: ServicePrice[] = [
  {
    id: "design",
    title: "Design Graphique",
    price: "À partir de 800€",
    timeline: "2-4 semaines",
    description: "Création d'identités visuelles percutantes",
  },
  {
    id: "web-dev",
    title: "Développement Web",
    price: "À partir de 2000€",
    timeline: "4-8 semaines",
    description: "Sites web et applications sur mesure",
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    price: "À partir de 1500€",
    timeline: "3-6 semaines",
    description: "Interfaces intuitives et expériences optimisées",
  },
  {
    id: "motion",
    title: "Motion Design",
    price: "À partir de 1200€",
    timeline: "3-5 semaines",
    description: "Animations et vidéos captivantes",
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    price: "À partir de 3500€",
    timeline: "6-10 semaines",
    description: "Solutions e-commerce complètes",
  },
  {
    id: "marketing",
    title: "SEO & Marketing",
    price: "À partir de 600€/mois",
    timeline: "En continu",
    description: "Stratégies digitales pour améliorer la visibilité",
  },
];

interface PriceManagerProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export const PriceManager: React.FC<PriceManagerProps> = ({
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}) => {
  const { isAdmin, isSuperAdmin, getContent, updateContent } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;
  const [prices, setPrices] = useState<ServicePrice[]>(defaultPrices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ServicePrice | null>(null);

  useEffect(() => {
    const savedPrices = getContent("services.prices", null);
    if (savedPrices) {
      setPrices(savedPrices);
    }
  }, []);

  if (!isAdmin) return null;

  const savePrice = () => {
    if (!editForm) return;

    const updatedPrices = prices.map((price) =>
      price.id === editForm.id ? editForm : price,
    );

    setPrices(updatedPrices);
    updateContent("services.prices", updatedPrices);
    setEditingId(null);
    setEditForm(null);
  };

  const startEditing = (price: ServicePrice) => {
    setEditingId(price.id);
    setEditForm({ ...price });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const addNewService = () => {
    const newId = `service-${Date.now()}`;
    const newService: ServicePrice = {
      id: newId,
      title: "Nouveau Service",
      price: "À définir",
      timeline: "À définir",
      description: "Description du nouveau service",
    };

    const updatedPrices = [...prices, newService];
    setPrices(updatedPrices);
    updateContent("services.prices", updatedPrices);
    startEditing(newService);
  };

  const deleteService = (id: string) => {
    if (confirm("Supprimer définitivement ce service ?")) {
      const updatedPrices = prices.filter((price) => price.id !== id);
      setPrices(updatedPrices);
      updateContent("services.prices", updatedPrices);
    }
  };

  const resetPrices = () => {
    if (confirm("Réinitialiser tous les prix aux valeurs par défaut ?")) {
      setPrices(defaultPrices);
      updateContent("services.prices", defaultPrices);
    }
  };

  return (
    <>
      {/* Price Manager Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign size={24} />
                  <h2 className="text-2xl font-bold">Gestionnaire de Prix</h2>
                  <span className="px-2 py-1 bg-green-800 rounded-full text-xs font-bold">
                    {isSuperAdmin ? "SUPREME" : "ADMIN"}
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-green-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Gestion des Tarifs des Services
                </h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={addNewService}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Plus size={16} className="mr-1" />
                    Ajouter Service
                  </Button>
                  <Button
                    onClick={resetPrices}
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-600"
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
              <div className="space-y-4">
                {prices.map((price) => (
                  <div
                    key={price.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                  >
                    {editingId === price.id && editForm ? (
                      /* Mode édition */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">
                            Modification : {editForm.title}
                          </h4>
                          <div className="flex space-x-2">
                            <Button
                              onClick={savePrice}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <Save size={16} className="mr-1" />
                              Sauvegarder
                            </Button>
                            <Button
                              onClick={cancelEditing}
                              size="sm"
                              variant="outline"
                            >
                              <X size={16} className="mr-1" />
                              Annuler
                            </Button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nom du Service
                            </label>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  title: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Prix
                            </label>
                            <input
                              type="text"
                              value={editForm.price}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  price: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder="ex: À partir de 1500€"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Délai
                            </label>
                            <input
                              type="text"
                              value={editForm.timeline}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  timeline: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder="ex: 2-4 semaines"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description courte
                            </label>
                            <input
                              type="text"
                              value={editForm.description}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder="Description du service"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Mode affichage */
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {price.title}
                            </h4>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              {price.price}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {price.timeline}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {price.description}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            onClick={() => startEditing(price)}
                            size="sm"
                            variant="outline"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </Button>

                          {![
                            "design",
                            "web-dev",
                            "ui-ux",
                            "motion",
                            "ecommerce",
                            "marketing",
                          ].includes(price.id) && (
                            <Button
                              onClick={() => deleteService(price.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Information */}
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  Information
                </h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>
                    • Les modifications sont appliquées immédiatement sur le
                    site
                  </li>
                  <li>• Les prix sont affichés sur la page des services</li>
                  <li>
                    • Utilisez des formats comme "À partir de 1500€" ou
                    "500€/mois"
                  </li>
                  <li>
                    • Les services par défaut ne peuvent pas être supprimés
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
