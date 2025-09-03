import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Send,
  Download,
  Plus,
  Calendar,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Quote, QuoteRequest, QuoteStatus } from "@/types/quote";
import { useToast } from "@/hooks/use-toast";
import { QuoteProcessGuide } from "@/components/QuoteProcessGuide";

const QuoteManagement: React.FC = () => {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [showRequestDetails, setShowRequestDetails] = useState(false);

  // Données de démonstration
  useEffect(() => {
    const mockRequests: QuoteRequest[] = [
      {
        id: "1",
        clientInfo: {
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean.dupont@email.com",
          phone: "+33 6 12 34 56 78",
          company: "Tech Solutions",
          address: "123 Rue de la Paix",
          city: "Paris",
          postalCode: "75001",
          country: "France",
        },
        projectInfo: {
          title: "Site E-commerce Moderne",
          description:
            "Création d'un site e-commerce avec gestion des stocks et paiements",
          category: "e-commerce",
          budget: "10000-25000",
          urgency: "high",
        },
        services: [
          {
            category: "development",
            name: "E-commerce",
            description: "Boutique en ligne",
            selected: true,
          },
          {
            category: "design",
            name: "UI/UX Design",
            description: "Interface utilisateur",
            selected: true,
          },
        ],
        status: "pending",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        clientInfo: {
          firstName: "Marie",
          lastName: "Martin",
          email: "marie.martin@startup.com",
          phone: "+33 6 98 76 54 32",
          company: "StartupCo",
          address: "456 Avenue des Champs",
          city: "Lyon",
          postalCode: "69001",
          country: "France",
        },
        projectInfo: {
          title: "Application Mobile Innovation",
          description:
            "Application mobile pour gestion de projets collaboratifs",
          category: "mobile-app",
          budget: "25000-50000",
          urgency: "medium",
        },
        services: [
          {
            category: "development",
            name: "Application Mobile",
            description: "App iOS/Android",
            selected: true,
          },
          {
            category: "design",
            name: "UI/UX Design",
            description: "Interface utilisateur",
            selected: true,
          },
        ],
        status: "under-review",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-12"),
      },
    ];

    const mockQuotes: Quote[] = [
      {
        id: "Q001",
        requestId: "1",
        quoteNumber: "DEV-2024-001",
        clientInfo: mockRequests[0].clientInfo,
        projectInfo: mockRequests[0].projectInfo,
        services: [
          {
            id: "1",
            name: "E-commerce Platform",
            description: "Développement complet de la boutique en ligne",
            quantity: 1,
            unitPrice: 15000,
            total: 15000,
            category: "development",
          },
          {
            id: "2",
            name: "UI/UX Design",
            description: "Design de l'interface utilisateur",
            quantity: 1,
            unitPrice: 5000,
            total: 5000,
            category: "design",
          },
        ],
        pricing: {
          subtotal: 20000,
          tax: 4000,
          total: 24000,
          currency: "EUR",
        },
        timeline: {
          estimatedStartDate: new Date("2024-02-01"),
          estimatedEndDate: new Date("2024-04-30"),
          milestones: [
            {
              id: "1",
              title: "Design et Maquettes",
              description: "Création des maquettes et design system",
              dueDate: new Date("2024-02-15"),
              deliverables: ["Maquettes", "Design System", "Prototype"],
              paymentPercentage: 30,
            },
            {
              id: "2",
              title: "Développement Frontend",
              description: "Intégration et développement de l'interface",
              dueDate: new Date("2024-03-15"),
              deliverables: [
                "Interface utilisateur",
                "Pages produits",
                "Panier",
              ],
              paymentPercentage: 40,
            },
            {
              id: "3",
              title: "Backend et Intégrations",
              description: "API, base de données et paiements",
              dueDate: new Date("2024-04-15"),
              deliverables: ["API", "Base de données", "Paiements"],
              paymentPercentage: 20,
            },
            {
              id: "4",
              title: "Tests et Livraison",
              description: "Tests finaux et mise en production",
              dueDate: new Date("2024-04-30"),
              deliverables: ["Tests", "Documentation", "Mise en production"],
              paymentPercentage: 10,
            },
          ],
        },
        terms: {
          validUntil: new Date("2024-02-15"),
          paymentTerms:
            "30% à la signature, 40% à mi-parcours, 20% avant livraison, 10% à la livraison",
          deliverables: [
            "Site e-commerce complet",
            "Panel d'administration",
            "Intégration paiements",
            "Documentation technique",
            "Formation utilisateur",
          ],
          additionalNotes: "Maintenance incluse pendant 3 mois",
        },
        status: "sent",
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-16"),
      },
    ];

    setRequests(mockRequests);
    setQuotes(mockQuotes);
  }, []);

  const getStatusBadge = (status: QuoteStatus) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", icon: Edit },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      "under-review": { color: "bg-blue-100 text-blue-800", icon: Eye },
      sent: { color: "bg-purple-100 text-purple-800", icon: Send },
      accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
      expired: { color: "bg-gray-100 text-gray-800", icon: AlertCircle },
      "in-progress": { color: "bg-blue-100 text-blue-800", icon: Clock },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent size={12} />
        {status}
      </Badge>
    );
  };

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      (quote.quoteNumber || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (quote.clientInfo?.firstName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (quote.clientInfo?.lastName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (quote.clientInfo?.company || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || quote.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (quoteId: string, newStatus: QuoteStatus) => {
    setQuotes((prev) =>
      prev.map((quote) =>
        quote.id === quoteId
          ? { ...quote, status: newStatus, updatedAt: new Date() }
          : quote,
      ),
    );

    toast({
      title: "Statut mis à jour",
      description: `Le devis a été marqué comme ${newStatus}`,
    });
  };

  const handleSendQuote = (quoteId: string) => {
    handleStatusUpdate(quoteId, "sent");
    toast({
      title: "Devis envoyé",
      description: "Le devis a été envoyé au client par email",
    });
  };

  const handleRequestStatusUpdate = (
    requestId: string,
    newStatus: QuoteStatus,
  ) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? { ...request, status: newStatus, updatedAt: new Date() }
          : request,
      ),
    );

    toast({
      title: "Statut mis à jour",
      description: `La demande a été marquée comme ${newStatus}`,
    });
  };

  const handleCreateQuoteFromRequest = (request: QuoteRequest) => {
    // Créer un nouveau devis à partir de la demande
    const newQuote: Quote = {
      id: `Q${String(quotes.length + 1).padStart(3, "0")}`,
      requestId: request.id,
      quoteNumber: `DEV-2024-${String(quotes.length + 1).padStart(3, "0")}`,
      clientInfo: request.clientInfo,
      projectInfo: request.projectInfo,
      services: request.services
        .filter((s) => s.selected)
        .map((service, index) => ({
          id: String(index + 1),
          name: service.name,
          description: service.description,
          quantity: 1,
          unitPrice: 5000, // Prix par défaut à ajuster
          total: 5000,
          category: service.category,
        })),
      pricing: {
        subtotal: request.services.filter((s) => s.selected).length * 5000,
        tax: request.services.filter((s) => s.selected).length * 1000,
        total: request.services.filter((s) => s.selected).length * 6000,
        currency: "EUR",
      },
      timeline: {
        estimatedStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
        estimatedEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // +90 jours
        milestones: [
          {
            id: "1",
            title: "Démarrage du projet",
            description: "Analyse et planification détaillée",
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            deliverables: ["Cahier des charges", "Planning", "Maquettes"],
            paymentPercentage: 30,
          },
          {
            id: "2",
            title: "Développement",
            description: "Réalisation technique du projet",
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            deliverables: ["Version beta", "Tests", "Documentation"],
            paymentPercentage: 50,
          },
          {
            id: "3",
            title: "Livraison finale",
            description: "Finalisation et mise en production",
            dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            deliverables: ["Version finale", "Formation", "Support"],
            paymentPercentage: 20,
          },
        ],
      },
      terms: {
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentTerms:
          "30% à la signature, 50% à mi-parcours, 20% à la livraison",
        deliverables: request.services
          .filter((s) => s.selected)
          .map((s) => s.name),
        additionalNotes: "Devis généré automatiquement - à personnaliser",
      },
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setQuotes((prev) => [...prev, newQuote]);
    handleRequestStatusUpdate(request.id, "under-review");

    toast({
      title: "Devis créé",
      description: `Le devis ${newQuote.quoteNumber} a été créé avec succès`,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Devis
        </h1>
        <p className="text-gray-600">
          Gérez vos demandes de devis et propositions commerciales
        </p>
      </div>

      <Tabs defaultValue="quotes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quotes">Devis ({quotes.length})</TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            Demandes ({requests.length})
            {requests.filter((r) => r.status === "pending").length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs px-1 py-0">
                {requests.filter((r) => r.status === "pending").length}{" "}
                nouvelles
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-6">
          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  placeholder="Rechercher un devis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as QuoteStatus | "all")
                }
              >
                <SelectTrigger className="w-48">
                  <Filter size={16} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="sent">Envoyé</SelectItem>
                  <SelectItem value="accepted">Accepté</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => setShowCreateQuote(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Nouveau Devis
            </Button>
          </div>

          {/* Liste des devis */}
          <div className="grid gap-4">
            {filteredQuotes.map((quote) => (
              <Card
                key={quote.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {quote.quoteNumber}
                        </h3>
                        <p className="text-gray-600">
                          {quote.clientInfo.firstName}{" "}
                          {quote.clientInfo.lastName}
                        </p>
                        {quote.clientInfo.company && (
                          <p className="text-sm text-gray-500">
                            {quote.clientInfo.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(quote.status)}
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {quote.pricing.total.toLocaleString()} €
                        </p>
                        <p className="text-sm text-gray-500">Total TTC</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      Créé le {quote.createdAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      Valide jusqu'au{" "}
                      {quote.terms.validUntil.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={16} />
                      {quote.services.length} service(s)
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedQuote(quote)}
                      >
                        <Eye size={16} className="mr-1" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit size={16} className="mr-1" />
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download size={16} className="mr-1" />
                        PDF
                      </Button>
                    </div>

                    {quote.status === "draft" && (
                      <Button
                        size="sm"
                        onClick={() => handleSendQuote(quote.id)}
                        className="flex items-center gap-1"
                      >
                        <Send size={16} />
                        Envoyer
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          {/* Alerte pour nouvelles demandes */}
          {requests.filter((r) => r.status === "pending").length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-blue-600" size={20} />
                <h3 className="font-semibold text-blue-800">
                  {requests.filter((r) => r.status === "pending").length}{" "}
                  nouvelle(s) demande(s) en attente
                </h3>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                Cliquez sur "Détails" pour examiner les demandes et "Créer
                Devis" pour générer une proposition.
              </p>
            </div>
          )}

          {/* Liste des demandes */}
          <div className="grid gap-4">
            {requests.map((request) => (
              <Card
                key={request.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {request.projectInfo.title}
                      </h3>
                      <p className="text-gray-600">
                        {request.clientInfo.firstName}{" "}
                        {request.clientInfo.lastName}
                      </p>
                      {request.clientInfo.company && (
                        <p className="text-sm text-gray-500">
                          {request.clientInfo.company}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {request.projectInfo.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      {request.createdAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign size={16} />
                      Budget: {request.projectInfo.budget}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AlertCircle size={16} />
                      Urgence: {request.projectInfo.urgency}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRequestDetails(true);
                        }}
                      >
                        <Eye size={16} className="mr-1" />
                        Détails
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleCreateQuoteFromRequest(request)}
                      disabled={request.status === "under-review"}
                    >
                      <Plus size={16} />
                      {request.status === "under-review"
                        ? "Devis en cours"
                        : "Créer Devis"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de détail du devis */}
      {selectedQuote && (
        <Dialog
          open={!!selectedQuote}
          onOpenChange={() => setSelectedQuote(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Devis {selectedQuote.quoteNumber}</DialogTitle>
              <DialogDescription>
                Détails complets du devis pour{" "}
                {selectedQuote.clientInfo.firstName}{" "}
                {selectedQuote.clientInfo.lastName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Informations client */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong>Nom:</strong>{" "}
                        {selectedQuote.clientInfo.firstName}{" "}
                        {selectedQuote.clientInfo.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedQuote.clientInfo.email}
                      </p>
                      <p>
                        <strong>Téléphone:</strong>{" "}
                        {selectedQuote.clientInfo.phone}
                      </p>
                    </div>
                    <div>
                      {selectedQuote.clientInfo.company && (
                        <p>
                          <strong>Entreprise:</strong>{" "}
                          {selectedQuote.clientInfo.company}
                        </p>
                      )}
                      <p>
                        <strong>Adresse:</strong>{" "}
                        {selectedQuote.clientInfo.address}
                      </p>
                      <p>
                        <strong>Ville:</strong> {selectedQuote.clientInfo.city}{" "}
                        {selectedQuote.clientInfo.postalCode}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services et pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Services et Tarification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedQuote.services.map((service) => (
                      <div
                        key={service.id}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {service.total.toLocaleString()} €
                          </p>
                          <p className="text-sm text-gray-600">
                            {service.quantity} ×{" "}
                            {service.unitPrice.toLocaleString()} €
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Sous-total:</span>
                        <span>
                          {selectedQuote.pricing.subtotal.toLocaleString()} €
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>TVA (20%):</span>
                        <span>
                          {selectedQuote.pricing.tax.toLocaleString()} €
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total TTC:</span>
                        <span>
                          {selectedQuote.pricing.total.toLocaleString()} €
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Planning et Jalons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedQuote.timeline.milestones.map(
                      (milestone, index) => (
                        <div
                          key={milestone.id}
                          className="border-l-2 border-primary pl-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{milestone.title}</h4>
                              <p className="text-sm text-gray-600">
                                {milestone.description}
                              </p>
                              <p className="text-sm text-primary">
                                {milestone.dueDate.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {milestone.paymentPercentage}%
                              </p>
                              <p className="text-sm text-gray-600">du total</p>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <Button variant="outline">
                  <Download size={16} className="mr-2" />
                  Télécharger PDF
                </Button>
                <Button variant="outline">
                  <Edit size={16} className="mr-2" />
                  Modifier
                </Button>
                {selectedQuote.status === "draft" && (
                  <Button onClick={() => handleSendQuote(selectedQuote.id)}>
                    <Send size={16} className="mr-2" />
                    Envoyer au Client
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de détail de la demande */}
      {selectedRequest && (
        <Dialog
          open={showRequestDetails}
          onOpenChange={() => {
            setShowRequestDetails(false);
            setSelectedRequest(null);
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Demande de Devis - {selectedRequest.projectInfo.title}
              </DialogTitle>
              <DialogDescription>
                Détails de la demande de {selectedRequest.clientInfo.firstName}{" "}
                {selectedRequest.clientInfo.lastName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Informations client */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong>Nom:</strong>{" "}
                        {selectedRequest.clientInfo.firstName}{" "}
                        {selectedRequest.clientInfo.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedRequest.clientInfo.email}
                      </p>
                      <p>
                        <strong>Téléphone:</strong>{" "}
                        {selectedRequest.clientInfo.phone}
                      </p>
                    </div>
                    <div>
                      {selectedRequest.clientInfo.company && (
                        <p>
                          <strong>Entreprise:</strong>{" "}
                          {selectedRequest.clientInfo.company}
                        </p>
                      )}
                      <p>
                        <strong>Adresse:</strong>{" "}
                        {selectedRequest.clientInfo.address}
                      </p>
                      <p>
                        <strong>Ville:</strong>{" "}
                        {selectedRequest.clientInfo.city}{" "}
                        {selectedRequest.clientInfo.postalCode}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations projet */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Détails du Projet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">
                        Description du projet
                      </h4>
                      <p className="text-gray-600">
                        {selectedRequest.projectInfo.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium">Catégorie</h4>
                        <p className="text-gray-600">
                          {selectedRequest.projectInfo.category}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Budget estimé</h4>
                        <p className="text-gray-600">
                          {selectedRequest.projectInfo.budget}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Urgence</h4>
                        <p className="text-gray-600">
                          {selectedRequest.projectInfo.urgency}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services demandés */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Services Demandés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedRequest.services
                      .filter((s) => s.selected)
                      .map((service, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                          <Badge className="mt-2">{service.category}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <Select
                  value={selectedRequest.status}
                  onValueChange={(value) =>
                    handleRequestStatusUpdate(
                      selectedRequest.id,
                      value as QuoteStatus,
                    )
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="under-review">
                      En cours d'étude
                    </SelectItem>
                    <SelectItem value="rejected">Rejetée</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => {
                    handleCreateQuoteFromRequest(selectedRequest);
                    setShowRequestDetails(false);
                    setSelectedRequest(null);
                  }}
                  disabled={selectedRequest.status === "under-review"}
                >
                  <Plus size={16} className="mr-2" />
                  Créer le Devis
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Guide du processus */}
      <QuoteProcessGuide />
    </div>
  );
};

export default QuoteManagement;
