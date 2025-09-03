import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  DollarSign,
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { orderService } from "../services/orderService";

interface QuoteFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectTitle: string;
  projectCategory: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  additionalRequirements: string;
}

interface BotQuoteFormProps {
  onSubmit: (data: QuoteFormData) => void;
  onCancel: () => void;
}

export const BotQuoteForm: React.FC<BotQuoteFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuoteFormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    projectTitle: "",
    projectCategory: "",
    projectDescription: "",
    budget: "",
    timeline: "",
    additionalRequirements: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const projectCategories = [
    "Site Web Vitrine",
    "Site E-commerce",
    "Application Web",
    "Application Mobile",
    "Logo & Identité Visuelle",
    "Design Graphique",
    "Marketing Digital",
    "Refonte de Site",
    "Autre",
  ];

  const budgetRanges = [
    "Moins de 100 000 FCFA",
    "100 000 - 300 000 FCFA",
    "300 000 - 500 000 FCFA",
    "500 000 - 1 000 000 FCFA",
    "1 000 000 - 2 500 000 FCFA",
    "Plus de 2 500 000 FCFA",
    "À discuter",
  ];

  const timelineOptions = [
    "Urgent (moins d'1 semaine)",
    "Rapide (1-2 semaines)",
    "Standard (1 mois)",
    "Flexible (2-3 mois)",
    "Long terme (3+ mois)",
    "Pas de contrainte",
  ];

  const updateFormData = (field: keyof QuoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepNumber) {
      case 1:
        if (!formData.clientName) newErrors.clientName = "Le nom est requis";
        if (!formData.clientEmail) newErrors.clientEmail = "L'email est requis";
        if (
          formData.clientEmail &&
          !/^\S+@\S+\.\S+$/.test(formData.clientEmail)
        ) {
          newErrors.clientEmail = "Email invalide";
        }
        if (!formData.clientPhone)
          newErrors.clientPhone = "Le téléphone est requis";
        break;

      case 2:
        if (!formData.projectTitle)
          newErrors.projectTitle = "Le titre est requis";
        if (!formData.projectCategory)
          newErrors.projectCategory = "La catégorie est requise";
        if (!formData.projectDescription)
          newErrors.projectDescription = "La description est requise";
        break;

      case 3:
        if (!formData.budget) newErrors.budget = "Le budget est requis";
        if (!formData.timeline) newErrors.timeline = "Les délais sont requis";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      // Initialiser le service de commandes
      orderService.initialize();

      // Créer ou récupérer le client
      const client = orderService.createOrUpdateClient({
        name: formData.clientName,
        email: formData.clientEmail,
        phone: formData.clientPhone,
      });

      // Créer la commande unifiée
      const order = orderService.createOrder({
        clientId: client.id,
        client: client,
        type: "quote",
        title: formData.projectTitle,
        category: formData.projectCategory,
        description: formData.projectDescription,
        budget: formData.budget,
        timeline: formData.timeline,
        additionalRequirements: formData.additionalRequirements,
      });

      onSubmit(formData);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <User className="mx-auto text-blue-500 mb-2" size={32} />
              <h3 className="text-lg font-semibold">Vos informations</h3>
              <p className="text-sm text-gray-600">Dites-nous qui vous êtes</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => updateFormData("clientName", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.clientName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: Jean Dupont"
              />
              {errors.clientName && (
                <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => updateFormData("clientEmail", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.clientEmail ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: jean@example.com"
              />
              {errors.clientEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.clientEmail}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => updateFormData("clientPhone", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.clientPhone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: +226 70 00 00 00"
              />
              {errors.clientPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.clientPhone}
                </p>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <Briefcase className="mx-auto text-green-500 mb-2" size={32} />
              <h3 className="text-lg font-semibold">Votre projet</h3>
              <p className="text-sm text-gray-600">
                Décrivez-nous votre vision
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre du projet *
              </label>
              <input
                type="text"
                value={formData.projectTitle}
                onChange={(e) => updateFormData("projectTitle", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.projectTitle ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: Site web pour mon restaurant"
              />
              {errors.projectTitle && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.projectTitle}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                value={formData.projectCategory}
                onChange={(e) =>
                  updateFormData("projectCategory", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.projectCategory ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Sélectionnez une catégorie</option>
                {projectCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.projectCategory && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.projectCategory}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description du projet *
              </label>
              <textarea
                value={formData.projectDescription}
                onChange={(e) =>
                  updateFormData("projectDescription", e.target.value)
                }
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.projectDescription
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Décrivez votre projet, vos objectifs, fonctionnalités souhaitées..."
              />
              {errors.projectDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.projectDescription}
                </p>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <Calendar className="mx-auto text-purple-500 mb-2" size={32} />
              <h3 className="text-lg font-semibold">Budget & Délais</h3>
              <p className="text-sm text-gray-600">Planifions ensemble</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget prévu *
              </label>
              <select
                value={formData.budget}
                onChange={(e) => updateFormData("budget", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.budget ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Sélectionnez votre budget</option>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
              {errors.budget && (
                <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Délais souhaités *
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => updateFormData("timeline", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.timeline ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Sélectionnez vos délais</option>
                {timelineOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.timeline && (
                <p className="text-red-500 text-xs mt-1">{errors.timeline}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exigences particulières
              </label>
              <textarea
                value={formData.additionalRequirements}
                onChange={(e) =>
                  updateFormData("additionalRequirements", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Technologies spécifiques, contraintes, références..."
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Demande envoyée !
            </h3>
            <p className="text-gray-600 mb-6">
              Votre demande de devis a été transmise à notre équipe. Nous vous
              répondrons dans les plus brefs délais !
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-semibold mb-2">Récapitulatif :</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>Projet :</strong> {formData.projectTitle}
                </li>
                <li>
                  <strong>Catégorie :</strong> {formData.projectCategory}
                </li>
                <li>
                  <strong>Budget :</strong> {formData.budget}
                </li>
                <li>
                  <strong>Délais :</strong> {formData.timeline}
                </li>
              </ul>
            </div>
          </motion.div>
        );
    }
  };

  if (step === 4) {
    return <div className="p-6">{renderStep()}</div>;
  }

  return (
    <div className="p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Étape {step} sur 3
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((step / 3) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {renderStep()}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <div>
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Précédent</span>
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Retour</span>
            </button>
          )}
        </div>

        <div>
          {step < 3 ? (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span>Continuer</span>
              <Send size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FileText size={16} />
              <span>Envoyer la demande</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
