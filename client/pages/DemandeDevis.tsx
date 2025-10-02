import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuoteRequestForm from "@/components/QuoteRequestForm";
import { QuoteFormData } from "@/types/quote";
import {
  FileText,
  Clock,
  CheckCircle,
  CreditCard,
  Users,
  Lightbulb,
  Rocket,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import quoteService from "@/services/quoteService";

const DemandeDevis: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const handleFormSubmit = async (data: QuoteFormData) => {
    try {
      // Envoyer la demande via le service
      const requestId = await quoteService.submitQuoteRequest(data);

      console.log("Demande de devis soumise avec ID:", requestId);

      toast({
        title: "Demande envoyée avec succès!",
        description:
          "Nous vous contacterons dans les 24h pour discuter de votre projet",
      });

      // Redirection vers une page de confirmation avec l'ID
      navigate(`/quote-sent?id=${requestId}`);
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'envoi de votre demande",
        variant: "destructive",
      });
    }
  };

  const processSteps = [
    {
      icon: FileText,
      title: "1. Demande de devis",
      description:
        "Remplissez notre formulaire détaillé pour nous permettre de comprendre votre projet",
    },
    {
      icon: Clock,
      title: "2. Analyse & Étude",
      description:
        "Notre équipe analyse votre demande et prépare une proposition personnalisée (24-48h)",
    },
    {
      icon: CheckCircle,
      title: "3. Proposition & Discussion",
      description:
        "Nous vous présentons notre devis détaillé et discutons de votre projet",
    },
    {
      icon: CreditCard,
      title: "4. Validation & Paiement",
      description:
        "Après validation, procédez au paiement sécurisé pour lancer le projet",
    },
  ];

  const advantages = [
    {
      icon: Users,
      title: "Équipe Experte",
      description: "Plus de 5 ans d'expérience en développement web et design",
    },
    {
      icon: Lightbulb,
      title: "Solutions Innovantes",
      description:
        "Approche créative et technologies modernes pour votre projet",
    },
    {
      icon: Rocket,
      title: "Livraison Rapide",
      description:
        "Méthodologie agile pour des résultats efficaces et dans les délais",
    },
    {
      icon: Shield,
      title: "Garantie Qualité",
      description:
        "Support inclus et garantie de satisfaction sur tous nos projets",
    },
  ];

  if (showForm) {
    return (
      <QuoteRequestForm
        onSubmit={handleFormSubmit}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Demandez Votre{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Devis Gratuit
            </span>
          </h1>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transformez votre vision en réalité digitale. Obtenez un devis
            personnalisé pour votre projet web, application mobile ou stratégie
            digitale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowForm(true)}
              size="lg"
              className="text-lg px-8 py-6"
            >
              <FileText className="w-5 h-5 mr-2" />
              Demander un Devis
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  const portfolioSection = document.getElementById("portfolio");
                  if (portfolioSection) {
                    portfolioSection.scrollIntoView({ behavior: "smooth" });
                  }
                }, 100);
              }}
            >
              Voir nos Réalisations
            </Button>
          </div>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 font-medium max-w-2xl mx-auto">
              Un processus simple et transparent pour transformer votre idée en
              projet concret
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-base font-medium leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Advantages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir MGS ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre expertise et notre approche garantissent le succès de votre
              projet digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + 0.1 * index }}
                >
                  <Card className="h-full text-center border-2 hover:border-primary/20 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-base font-medium leading-relaxed">
                        {advantage.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Services rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-0">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Nos Services Populaires
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Sites web sur mesure (vitrine, e-commerce)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Applications mobiles iOS/Android</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Branding et identité visuelle</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Stratégie digitale et SEO</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Support et maintenance</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
                    <div className="text-4xl font-bold text-primary mb-2">
                      24h
                    </div>
                    <div className="text-gray-600 mb-4">
                      Délai de réponse garanti
                    </div>
                    <Button
                      onClick={() => setShowForm(true)}
                      className="w-full"
                    >
                      Commencer maintenant
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ rapide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Le devis est-il vraiment gratuit ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Oui, absolument ! Nous offrons une étude gratuite et sans
                  engagement de votre projet pour vous proposer la meilleure
                  solution.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Combien de temps pour recevoir le devis ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nous nous engageons à vous répondre sous 24h maximum avec une
                  première estimation et sous 48h pour un devis détaillé.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Puis-je modifier ma demande après envoi ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Bien sûr ! Nous restons flexibles et pouvons ajuster notre
                  proposition selon l'évolution de vos besoins.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Quels sont vos délais de réalisation ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Les délais varient selon la complexité du projet. Nous nous
                  adaptons à vos contraintes de timing tout en garantissant la
                  qualité.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-primary to-accent text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à donner vie à votre projet ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Commencez dès maintenant et recevez votre devis personnalisé
              </p>
              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                variant="secondary"
                className="text-lg px-12 py-6"
              >
                <FileText className="w-5 h-5 mr-2" />
                Demander mon devis gratuit
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DemandeDevis;
