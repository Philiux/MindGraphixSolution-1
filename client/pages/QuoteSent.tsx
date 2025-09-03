import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  ArrowRight,
  Calendar,
  FileText,
  Users,
} from "lucide-react";

const QuoteSent: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [requestId, setRequestId] = useState<string>("");

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setRequestId(id);
    } else {
      // Générer un ID de fallback si pas d'ID fourni
      setRequestId(`DEM-${Date.now().toString().slice(-6)}`);
    }
  }, [searchParams]);

  const nextSteps = [
    {
      icon: Clock,
      title: "Analyse de votre demande",
      description: "Notre équipe étudie votre projet en détail",
      time: "Dans les 2h",
    },
    {
      icon: FileText,
      title: "Préparation du devis",
      description: "Création d'une proposition personnalisée",
      time: "Sous 24h",
    },
    {
      icon: Mail,
      title: "Envoi du devis",
      description: "Réception par email avec tous les détails",
      time: "Sous 48h",
    },
    {
      icon: MessageCircle,
      title: "Présentation et discussion",
      description: "Échange pour affiner le projet si nécessaire",
      time: "À votre convenance",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Confirmation principale */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demande Envoyée avec Succès !
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Votre demande de devis a bien été reçue. Nous allons l'analyser et
            vous contacter très rapidement.
          </p>
          <div className="bg-white p-4 rounded-lg shadow-sm inline-block">
            <p className="text-sm text-gray-500">Numéro de demande</p>
            <p className="text-lg font-bold text-primary">{requestId}</p>
          </div>
        </motion.div>

        {/* Prochaines étapes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                Que se passe-t-il maintenant ?
              </CardTitle>
              <CardDescription>
                Voici les prochaines étapes de notre processus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nextSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {step.description}
                      </p>
                      <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">
                        {step.time}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact d'urgence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Besoin d'aide immédiate ?</h3>
                  <p className="text-sm text-gray-600">
                    Contactez-nous directement
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>contact@mindgraphix.com</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Phone className="w-4 h-4 mr-2" />
                Nous appeler
              </Button>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Projet urgent ?</h3>
                  <p className="text-sm text-gray-600">
                    Planifiez un appel immédiat
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Si votre projet a des contraintes de timing spéciales, nous
                pouvons organiser un appel dans l'heure.
              </p>
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Planifier un appel
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-0">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Équipe Dédiée</h3>
                  <p className="text-sm text-gray-600">
                    Une équipe d'experts sera assignée à votre projet pour
                    garantir sa réussite.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Communication Continue</h3>
                  <p className="text-sm text-gray-600">
                    Nous vous tiendrons informé à chaque étape du développement
                    de votre devis.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Satisfaction Garantie</h3>
                  <p className="text-sm text-gray-600">
                    Si notre proposition ne vous convient pas, nous l'ajusterons
                    selon vos besoins.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions finales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="flex items-center gap-2"
            >
              Retour à l'accueil
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  const portfolioSection = document.getElementById("portfolio");
                  if (portfolioSection) {
                    portfolioSection.scrollIntoView({ behavior: "smooth" });
                  }
                }, 100);
              }}
              className="flex items-center gap-2"
            >
              Voir nos réalisations
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            Vous recevrez un email de confirmation dans quelques minutes
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default QuoteSent;
