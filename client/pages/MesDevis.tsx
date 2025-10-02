import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  Home,
  LogOut,
  Search,
  Star,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  Package,
  DollarSign,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { quoteService } from "../services/quoteService";
import type { QuoteRequest as QuoteServiceRequest } from "../types/quote";

interface QuoteRequest {
  id: string;
  title: string;
  category: string;
  description: string;
  status:
    | "pending"
    | "reviewing"
    | "quoted"
    | "accepted"
    | "rejected"
    | "expired";
  submittedAt: Date;
  budget: string;
  timeline: string;
  quotedPrice?: number;
  quotePdf?: string;
  clientEmail: string;
  clientName: string;
  clientPhone: string;
}

const statusConfig = {
  pending: {
    label: "En attente",
    color: "bg-yellow-500",
    description: "Votre demande est en cours d'examen",
  },
  reviewing: {
    label: "En examen",
    color: "bg-blue-500",
    description: "Notre équipe étudie votre projet",
  },
  quoted: {
    label: "Devis envoyé",
    color: "bg-purple-500",
    description: "Le devis a été envoyé par email",
  },
  accepted: {
    label: "Accepté",
    color: "bg-green-500",
    description: "Devis accepté, projet en préparation",
  },
  rejected: {
    label: "Refusé",
    color: "bg-red-500",
    description: "Devis refusé",
  },
  expired: {
    label: "Expiré",
    color: "bg-gray-500",
    description: "Le devis a expiré",
  },
};

export default function MesDevis() {
  const { currentUser, isLoggedIn, logout, isAdmin } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    // Charger les demandes de devis du client depuis quoteService
    try {
      const userQuotes = quoteService.getClientQuoteRequests(currentUser.email);
      // Convertir au format attendu par le composant
      const convertedQuotes = userQuotes.map((quote) => ({
        id: quote.id!,
        title: quote.projectInfo.title,
        category: quote.projectInfo.category,
        description: quote.projectInfo.description,
        status: quote.status as any, // Conversion pour compatibilité
        submittedAt: quote.createdAt,
        budget: quote.projectInfo.budget,
        timeline: `${
          quote.projectInfo.urgency === "urgent"
            ? "Urgent"
            : quote.projectInfo.urgency === "high"
              ? "Prioritaire"
              : quote.projectInfo.urgency === "low"
                ? "Flexible"
                : "Normal"
        }`,
        quotedPrice: undefined, // Will be filled when quote is generated
        quotePdf: undefined,
        clientEmail: quote.clientInfo.email,
        clientName: `${quote.clientInfo.firstName} ${quote.clientInfo.lastName}`,
        clientPhone: quote.clientInfo.phone,
      }));
      setQuotes(convertedQuotes);
    } catch (error) {
      console.error("Erreur lors du chargement des devis:", error);
    }

    // Écouter les mises à jour de statut
    const handleStatusUpdate = (event: CustomEvent) => {
      const { id, status } = event.detail;
      setQuotes((prev) =>
        prev.map((quote) => (quote.id === id ? { ...quote, status } : quote)),
      );
    };

    window.addEventListener(
      "quoteStatusUpdated",
      handleStatusUpdate as EventListener,
    );
    return () =>
      window.removeEventListener(
        "quoteStatusUpdated",
        handleStatusUpdate as EventListener,
      );
  }, [currentUser]);

  if (!isLoggedIn || !currentUser) {
    return <Navigate to="/" replace />;
  }

  // Si c'est un admin, rediriger vers la gestion des devis admin
  if (isAdmin) {
    return <Navigate to="/admin/quotes" replace />;
  }

  const filteredQuotes = quotes.filter(
    (quote) =>
      (quote.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quote.category || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusStats = () => {
    return {
      total: quotes.length,
      pending: quotes.filter((q) => ["pending", "reviewing"].includes(q.status))
        .length,
      quoted: quotes.filter((q) => q.status === "quoted").length,
      accepted: quotes.filter((q) => q.status === "accepted").length,
    };
  };

  const stats = getStatusStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "reviewing":
        return Search;
      case "quoted":
        return FileText;
      case "accepted":
        return CheckCircle;
      case "rejected":
        return XCircle;
      case "expired":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <Home className="w-5 h-5 mr-2" />
                <span className="text-sm">Accueil</span>
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-semibold text-gray-900">
                Mes Demandes de Devis
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/client-dashboard"
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Espace Client</span>
              </Link>

              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {currentUser?.name || currentUser?.email}
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedQuote ? (
          /* Vue détaillée du devis */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedQuote(null)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à mes devis
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {selectedQuote.title}
                    </h2>
                    <p className="text-gray-600">{selectedQuote.category}</p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${statusConfig[selectedQuote.status].color}`}
                    >
                      {React.createElement(
                        getStatusIcon(selectedQuote.status),
                        { className: "w-4 h-4 mr-1" },
                      )}
                      {statusConfig[selectedQuote.status].label}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Soumis le {selectedQuote.submittedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Détails du projet */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Description du projet
                      </h3>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {selectedQuote.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Statut actuel
                      </h3>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        {React.createElement(
                          getStatusIcon(selectedQuote.status),
                          {
                            className: `w-6 h-6 text-white p-1 rounded-full ${statusConfig[selectedQuote.status].color}`,
                          },
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {statusConfig[selectedQuote.status].label}
                          </p>
                          <p className="text-sm text-gray-600">
                            {statusConfig[selectedQuote.status].description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedQuote.quotedPrice && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          Devis proposé
                        </h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-semibold text-blue-900">
                                {selectedQuote.quotedPrice?.toLocaleString()}{" "}
                                FCFA
                              </p>
                              <p className="text-sm text-blue-700">
                                Prix final pour votre projet
                              </p>
                            </div>
                            {selectedQuote.quotePdf && (
                              <Button className="bg-blue-600 hover:bg-blue-700">
                                <Download className="w-4 h-4 mr-2" />
                                Télécharger le devis
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Informations latérales */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Détails de la demande
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Budget indicatif:
                          </span>
                          <span className="font-medium">
                            {selectedQuote.budget}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Délais souhaités:
                          </span>
                          <span className="font-medium">
                            {selectedQuote.timeline}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Soumis le:</span>
                          <span className="font-medium">
                            {selectedQuote.submittedAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Contact
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {selectedQuote.clientEmail}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {selectedQuote.clientPhone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedQuote.status === "quoted" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-800 mb-2">
                          Action requise
                        </h4>
                        <p className="text-sm text-yellow-700 mb-3">
                          Votre devis vous attend ! Consultez votre email pour
                          plus de détails.
                        </p>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Accepter le devis
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Refuser le devis
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Liste des devis */
          <div className="space-y-6">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      En attente
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.pending}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Devis reçus
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.quoted}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Acceptés
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.accepted}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Liste des devis */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Mes demandes de devis
                  </h2>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher..."
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <Link to="/demande-devis">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <FileText className="w-4 h-4 mr-2" />
                        Nouvelle demande
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {filteredQuotes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {quotes.length === 0
                        ? "Aucune demande de devis"
                        : "Aucun résultat"}
                    </h3>
                    <p className="mt-2 text-gray-500">
                      {quotes.length === 0
                        ? "Commencez par faire une demande de devis pour vos projets."
                        : "Essayez d'autres mots-clés pour votre recherche."}
                    </p>
                    {quotes.length === 0 && (
                      <Link to="/demande-devis" className="mt-4 inline-block">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <FileText className="w-4 h-4 mr-2" />
                          Faire une demande
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredQuotes.map((quote) => {
                      const config = statusConfig[quote.status];
                      const StatusIcon = getStatusIcon(quote.status);

                      return (
                        <motion.div
                          key={quote.id}
                          whileHover={{ scale: 1.02 }}
                          className="border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => setSelectedQuote(quote)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {quote.title}
                              </h3>
                              <p className="text-gray-600">{quote.category}</p>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${config.color}`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                            {quote.description}
                          </p>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Budget:</span>
                              <span className="font-medium">
                                {quote.budget}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Délais:</span>
                              <span className="font-medium">
                                {quote.timeline}
                              </span>
                            </div>
                            {quote.quotedPrice && (
                              <div className="flex justify-between">
                                <span>Prix proposé:</span>
                                <span className="font-medium text-blue-600">
                                  {quote.quotedPrice.toLocaleString()} FCFA
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                            Soumis le {quote.submittedAt.toLocaleDateString()}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
