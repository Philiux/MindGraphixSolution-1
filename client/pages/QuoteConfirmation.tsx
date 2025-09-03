import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Download,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  CreditCard,
  FileText,
  Star,
  MessageCircle,
  Share2,
  PrinterIcon,
} from "lucide-react";
import { Quote, Payment, QuoteStatus } from "@/types/quote";
import PaymentSystem from "@/components/PaymentSystem";
import { useToast } from "@/hooks/use-toast";

const QuoteConfirmation: React.FC = () => {
  const { quoteId } = useParams();
  const { toast } = useToast();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation du chargement du devis
    const loadQuote = async () => {
      try {
        // Ici vous feriez un appel API pour récupérer le devis
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Données mockées
        const mockQuote: Quote = {
          id: quoteId || "Q001",
          requestId: "1",
          quoteNumber: "DEV-2024-001",
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
              "Création d'un site e-commerce avec gestion des stocks et paiements en ligne",
            category: "e-commerce",
            budget: "10000-25000",
            urgency: "high",
          },
          services: [
            {
              id: "1",
              name: "Développement E-commerce",
              description:
                "Développement complet de la boutique en ligne avec panier, commandes et paiements",
              quantity: 1,
              unitPrice: 15000,
              total: 15000,
              category: "development",
            },
            {
              id: "2",
              name: "Design UI/UX",
              description:
                "Conception de l'interface utilisateur et expérience utilisateur",
              quantity: 1,
              unitPrice: 5000,
              total: 5000,
              category: "design",
            },
            {
              id: "3",
              name: "Intégration Paiements",
              description: "Configuration des moyens de paiement sécurisés",
              quantity: 1,
              unitPrice: 2000,
              total: 2000,
              category: "development",
            },
          ],
          pricing: {
            subtotal: 22000,
            tax: 4400,
            total: 26400,
            currency: "EUR",
          },
          timeline: {
            estimatedStartDate: new Date("2024-02-01"),
            estimatedEndDate: new Date("2024-05-01"),
            milestones: [
              {
                id: "1",
                title: "Phase Design",
                description: "Création des maquettes et design system",
                dueDate: new Date("2024-02-15"),
                deliverables: [
                  "Maquettes desktop/mobile",
                  "Design system",
                  "Prototype interactif",
                ],
                paymentPercentage: 30,
              },
              {
                id: "2",
                title: "Développement Frontend",
                description: "Intégration de l'interface utilisateur",
                dueDate: new Date("2024-03-15"),
                deliverables: [
                  "Pages produits",
                  "Panier d'achat",
                  "Interface responsive",
                ],
                paymentPercentage: 40,
              },
              {
                id: "3",
                title: "Backend et Intégrations",
                description: "Développement de l'API et intégrations",
                dueDate: new Date("2024-04-15"),
                deliverables: [
                  "API REST",
                  "Base de données",
                  "Paiements sécurisés",
                ],
                paymentPercentage: 20,
              },
              {
                id: "4",
                title: "Tests et Livraison",
                description: "Tests, optimisations et mise en production",
                dueDate: new Date("2024-05-01"),
                deliverables: [
                  "Tests complets",
                  "Optimisations",
                  "Mise en production",
                ],
                paymentPercentage: 10,
              },
            ],
          },
          terms: {
            validUntil: new Date("2024-02-15"),
            paymentTerms:
              "Paiement échelonné selon les jalons : 30% au démarrage, 40% à mi-parcours, 20% avant livraison, 10% à la livraison finale",
            deliverables: [
              "Site e-commerce complet et fonctionnel",
              "Panel d'administration pour la gestion",
              "Intégration des moyens de paiement",
              "Documentation technique complète",
              "Formation à l'utilisation",
              "Support technique pendant 3 mois",
            ],
            additionalNotes:
              "Le projet inclut 2 révisions majeures par phase et un support de 3 mois post-livraison",
          },
          status: "sent",
          createdAt: new Date("2024-01-16"),
          updatedAt: new Date("2024-01-16"),
        };

        setQuote(mockQuote);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le devis",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, [quoteId, toast]);

  const handleAcceptQuote = () => {
    if (quote) {
      setQuote({ ...quote, status: "accepted", acceptedAt: new Date() });
      setShowPayment(true);
      toast({
        title: "Devis accepté",
        description: "Vous pouvez maintenant procéder au paiement",
      });
    }
  };

  const handleRejectQuote = () => {
    if (quote) {
      setQuote({ ...quote, status: "rejected" });
      toast({
        title: "Devis refusé",
        description: "Le devis a été marqué comme refusé",
        variant: "destructive",
      });
    }
  };

  const handlePaymentComplete = (paymentData: Payment) => {
    setPayment(paymentData);
    if (quote) {
      setQuote({
        ...quote,
        status: "in-progress",
        paidAt: new Date(),
      });
    }
    setShowPayment(false);
  };

  const downloadPDF = () => {
    toast({
      title: "Téléchargement",
      description: "Le PDF du devis est en cours de téléchargement",
    });
  };

  const shareQuote = () => {
    if (navigator.share) {
      navigator.share({
        title: `Devis ${quote?.quoteNumber}`,
        text: `Consultez le devis pour ${quote?.projectInfo.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien du devis a été copié dans le presse-papiers",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p>Chargement du devis...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Devis introuvable
          </h2>
          <p className="text-gray-600">
            Le devis demandé n'existe pas ou a expiré
          </p>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <PaymentSystem
        quote={quote}
        onPaymentComplete={handlePaymentComplete}
        onCancel={() => setShowPayment(false)}
      />
    );
  }

  const getStatusBadge = (status: QuoteStatus) => {
    const statusConfig = {
      sent: { color: "bg-blue-100 text-blue-800", label: "Envoyé" },
      accepted: { color: "bg-green-100 text-green-800", label: "Accepté" },
      rejected: { color: "bg-red-100 text-red-800", label: "Refusé" },
      "in-progress": {
        color: "bg-purple-100 text-purple-800",
        label: "En cours",
      },
      completed: { color: "bg-green-100 text-green-800", label: "Terminé" },
      expired: { color: "bg-gray-100 text-gray-800", label: "Expiré" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const isExpired = new Date() > quote.terms.validUntil;
  const canAccept = quote.status === "sent" && !isExpired;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Devis {quote.quoteNumber}
          </h1>
          <p className="text-gray-600">{quote.projectInfo.title}</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            {getStatusBadge(quote.status)}
            {payment && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Payé
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-8"
        >
          <Button
            variant="outline"
            onClick={downloadPDF}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Télécharger PDF
          </Button>
          <Button
            variant="outline"
            onClick={shareQuote}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Partager
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="flex items-center gap-2"
          >
            <PrinterIcon className="w-4 h-4" />
            Imprimer
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {quote.clientInfo.firstName} {quote.clientInfo.lastName}
                    </h4>
                    {quote.clientInfo.company && (
                      <p className="text-gray-600">
                        {quote.clientInfo.company}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {quote.clientInfo.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {quote.clientInfo.phone}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4 mt-0.5" />
                      <div>
                        <p>{quote.clientInfo.address}</p>
                        <p>
                          {quote.clientInfo.city} {quote.clientInfo.postalCode}
                        </p>
                        <p>{quote.clientInfo.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détail du projet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Détail du Projet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium text-lg mb-2">
                  {quote.projectInfo.title}
                </h4>
                <p className="text-gray-600 mb-4">
                  {quote.projectInfo.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Catégorie:</span>
                    <span className="ml-2 text-gray-600">
                      {quote.projectInfo.category}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Budget:</span>
                    <span className="ml-2 text-gray-600">
                      {quote.projectInfo.budget}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services Inclus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quote.services.map((service, index) => (
                    <div
                      key={service.id}
                      className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-600">
                          {service.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {service.quantity} ×{" "}
                          {service.unitPrice.toLocaleString()} €
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {service.total.toLocaleString()} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Planning du Projet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quote.timeline.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="relative">
                      {index < quote.timeline.milestones.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200" />
                      )}
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{milestone.title}</h4>
                              <p className="text-sm text-gray-600">
                                {milestone.description}
                              </p>
                              <p className="text-sm text-primary font-medium">
                                Échéance:{" "}
                                {milestone.dueDate.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {milestone.paymentPercentage}%
                              </p>
                              <p className="text-sm text-gray-600">
                                {(
                                  (quote.pricing.total *
                                    milestone.paymentPercentage) /
                                  100
                                ).toLocaleString()}{" "}
                                €
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">
                              Livrables:
                            </p>
                            <ul className="text-sm text-gray-600 mt-1">
                              {milestone.deliverables.map((deliverable, i) => (
                                <li key={i}>• {deliverable}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Conditions et Livrables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Conditions de paiement</h4>
                  <p className="text-sm text-gray-600">
                    {quote.terms.paymentTerms}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Livrables finaux</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {quote.terms.deliverables.map((deliverable, index) => (
                      <li key={index}>• {deliverable}</li>
                    ))}
                  </ul>
                </div>

                {quote.terms.additionalNotes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">
                        Notes supplémentaires
                      </h4>
                      <p className="text-sm text-gray-600">
                        {quote.terms.additionalNotes}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tarification */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Tarification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{quote.pricing.subtotal.toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TVA (20%)</span>
                    <span>{quote.pricing.tax.toLocaleString()} €</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total TTC</span>
                    <span>{quote.pricing.total.toLocaleString()} €</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      Valide jusqu'au{" "}
                      {quote.terms.validUntil.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Durée:{" "}
                      {Math.ceil(
                        (quote.timeline.estimatedEndDate.getTime() -
                          quote.timeline.estimatedStartDate.getTime()) /
                          (1000 * 60 * 60 * 24 * 30),
                      )}{" "}
                      mois
                    </span>
                  </div>
                </div>

                {canAccept && (
                  <div className="space-y-2 pt-4">
                    <Button
                      onClick={handleAcceptQuote}
                      className="w-full"
                      size="lg"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accepter et Payer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRejectQuote}
                      className="w-full"
                    >
                      Décliner
                    </Button>
                  </div>
                )}

                {isExpired && quote.status === "sent" && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">
                      Devis expiré
                    </p>
                    <p className="text-xs text-red-600">
                      Ce devis a expiré le{" "}
                      {quote.terms.validUntil.toLocaleDateString()}
                    </p>
                  </div>
                )}

                {quote.status === "accepted" && !payment && (
                  <Button
                    onClick={() => setShowPayment(true)}
                    className="w-full"
                    size="lg"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Procéder au paiement
                  </Button>
                )}

                {payment && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-green-800 font-medium">
                        Paiement effectué
                      </p>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Le projet démarrera selon le planning convenu
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Questions sur ce devis ?</p>
                    <p className="text-gray-600">
                      Contactez-nous pour toute clarification
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>contact@mindgraphix.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>+33 1 23 45 67 89</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Nous contacter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteConfirmation;
