import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Building,
  Shield,
  CheckCircle,
  AlertCircle,
  Lock,
  Euro,
  Calendar,
  User,
  Smartphone,
} from "lucide-react";
import { Quote, Payment, PaymentMethod, PaymentStatus } from "@/types/quote";
import { useToast } from "@/hooks/use-toast";

interface PaymentSystemProps {
  quote: Quote;
  onPaymentComplete: (payment: Payment) => void;
  onCancel?: () => void;
}

interface PaymentFormData {
  method: PaymentMethod;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  bankDetails?: {
    iban: string;
    bic: string;
  };
  paypalEmail?: string;
}

const PaymentSystem: React.FC<PaymentSystemProps> = ({
  quote,
  onPaymentComplete,
  onCancel,
}) => {
  const { toast } = useToast();
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    method: "credit-card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: {
      address: quote.clientInfo.address || "",
      city: quote.clientInfo.city || "",
      postalCode: quote.clientInfo.postalCode || "",
      country: quote.clientInfo.country || "France",
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");

  const updatePaymentData = (section: keyof PaymentFormData, data: any) => {
    setPaymentData((prev) => ({
      ...prev,
      [section]:
        typeof prev[section] === "object"
          ? { ...prev[section], ...data }
          : data,
    }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus("processing");

    // Simulation du traitement de paiement
    try {
      // Ici, vous intégreriez avec votre gateway de paiement (Stripe, PayPal, etc.)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const payment: Payment = {
        id: `PAY-${Date.now()}`,
        quoteId: quote.id,
        amount: quote.pricing.total,
        currency: quote.pricing.currency,
        method: paymentData.method,
        status: "completed",
        transactionId: `TXN-${Date.now()}`,
        processedAt: new Date(),
      };

      setPaymentStatus("completed");
      onPaymentComplete(payment);

      toast({
        title: "Paiement réussi",
        description: `Votre paiement de ${quote.pricing.total.toLocaleString()} € a été traité avec succès`,
      });
    } catch (error) {
      setPaymentStatus("failed");
      toast({
        title: "Erreur de paiement",
        description:
          "Une erreur est survenue lors du traitement de votre paiement",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "credit-card":
        return <CreditCard className="w-5 h-5" />;
      case "bank-transfer":
        return <Building className="w-5 h-5" />;
      case "paypal":
        return <Smartphone className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  if (paymentStatus === "completed") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Paiement Réussi!
            </h2>
            <p className="text-gray-600">
              Votre paiement de{" "}
              <strong>{quote.pricing.total.toLocaleString()} €</strong> a été
              traité avec succès.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Prochaines étapes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Vous recevrez un email de confirmation</li>
              <li>• Le projet démarrera selon le planning convenu</li>
              <li>• Vous serez tenu informé de l'avancement</li>
            </ul>
          </div>
          <Button onClick={onCancel} className="w-full">
            Retour au tableau de bord
          </Button>
        </motion.div>
      </div>
    );
  }

  if (paymentStatus === "processing") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Lock className="w-10 h-10 text-blue-600" />
            </motion.div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Traitement en cours...
            </h2>
            <p className="text-gray-600">
              Votre paiement est en cours de traitement. Veuillez patienter.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Paiement Sécurisé
        </h2>
        <p className="text-gray-600">
          Finalisez votre commande en toute sécurité
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de paiement */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Méthode de Paiement
              </CardTitle>
              <CardDescription>
                Choisissez votre mode de paiement préféré
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={paymentData.method}
                onValueChange={(value) =>
                  updatePaymentData("method", value as PaymentMethod)
                }
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="credit-card"
                    className="flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Carte
                  </TabsTrigger>
                  <TabsTrigger
                    value="bank-transfer"
                    className="flex items-center gap-2"
                  >
                    <Building className="w-4 h-4" />
                    Virement
                  </TabsTrigger>
                  <TabsTrigger
                    value="paypal"
                    className="flex items-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    PayPal
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="credit-card" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Numéro de carte</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) =>
                          updatePaymentData(
                            "cardNumber",
                            formatCardNumber(e.target.value),
                          )
                        }
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Date d'expiration</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) =>
                            updatePaymentData("expiryDate", e.target.value)
                          }
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) =>
                            updatePaymentData("cvv", e.target.value)
                          }
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Nom du titulaire</Label>
                      <Input
                        id="cardholderName"
                        placeholder="Jean Dupont"
                        value={paymentData.cardholderName}
                        onChange={(e) =>
                          updatePaymentData("cardholderName", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bank-transfer" className="space-y-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Informations bancaires</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>IBAN:</strong> FR76 1234 5678 9012 3456 7890 123
                      </p>
                      <p>
                        <strong>BIC:</strong> BANKFRPP
                      </p>
                      <p>
                        <strong>Bénéficiaire:</strong> Mind Graphix Solution
                      </p>
                      <p>
                        <strong>Référence:</strong> {quote.quoteNumber}
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800">Important</p>
                        <p className="text-amber-700">
                          N'oubliez pas d'inclure la référence{" "}
                          {quote.quoteNumber} dans le libellé de votre virement.
                          Le projet démarrera après réception du paiement (1-2
                          jours ouvrés).
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="paypal" className="space-y-4 mt-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Smartphone className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Paiement PayPal</h4>
                      <p className="text-sm text-gray-600">
                        Vous serez redirigé vers PayPal pour finaliser votre
                        paiement en toute sécurité.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Adresse de facturation */}
          <Card>
            <CardHeader>
              <CardTitle>Adresse de facturation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Adresse</Label>
                  <Input
                    id="billingAddress"
                    value={paymentData.billingAddress.address}
                    onChange={(e) =>
                      updatePaymentData("billingAddress", {
                        address: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingCity">Ville</Label>
                    <Input
                      id="billingCity"
                      value={paymentData.billingAddress.city}
                      onChange={(e) =>
                        updatePaymentData("billingAddress", {
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingPostalCode">Code postal</Label>
                    <Input
                      id="billingPostalCode"
                      value={paymentData.billingAddress.postalCode}
                      onChange={(e) =>
                        updatePaymentData("billingAddress", {
                          postalCode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingCountry">Pays</Label>
                  <Select
                    value={paymentData.billingAddress.country}
                    onValueChange={(value) =>
                      updatePaymentData("billingAddress", { country: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Belgique">Belgique</SelectItem>
                      <SelectItem value="Suisse">Suisse</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Récapitulatif */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="w-5 h-5" />
                Récapitulatif
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{quote.projectInfo.title}</h4>
                <p className="text-sm text-gray-600">
                  Devis N° {quote.quoteNumber}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                {quote.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex justify-between text-sm"
                  >
                    <span>{service.name}</span>
                    <span>{service.total.toLocaleString()} €</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{quote.pricing.subtotal.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>TVA (20%)</span>
                  <span>{quote.pricing.tax.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{quote.pricing.total.toLocaleString()} €</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Début:{" "}
                    {quote.timeline.estimatedStartDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
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
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">
                    Paiement sécurisé
                  </p>
                  <p className="text-gray-600">
                    Vos données sont protégées par un cryptage SSL 256 bits
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <Lock className="w-4 h-4" />
                  </motion.div>
                  Traitement...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Payer {quote.pricing.total.toLocaleString()} €
                </>
              )}
            </Button>

            {onCancel && (
              <Button variant="outline" onClick={onCancel} className="w-full">
                Annuler
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;
