import React, { useState } from "react";
import { Link } from "react-router-dom";
import { EnhancedHeader } from "../components/EnhancedHeader";
import { Footer } from "../components/Footer";
import { AuthModal } from "../components/AuthModal";
import { AdminViewSwitcher } from "../components/AdminViewSwitcher";
import {
  Palette,
  Code,
  Smartphone,
  Video,
  ShoppingCart,
  Search,
  Check,
  ArrowRight,
  Star,
  Clock,
  Users,
  Zap,
} from "lucide-react";

export default function Services() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const services = [
    {
      id: "design-graphique",
      icon: Palette,
      title: "Design Graphique",
      subtitle: "Identité visuelle & Communication",
      description:
        "Création d'identités visuelles percutantes, logos, supports print et éléments graphiques qui renforcent votre image de marque.",
      features: [
        "Création de logos et identités visuelles",
        "Charte graphique complète",
        "Supports print (brochures, cartes, affiches)",
        "Design pour réseaux sociaux",
        "Illustrations personnalisées",
        "Retouche et montage photo",
      ],
      pricing: "À partir de 98.000 FCFA",
      duration: "3-7 jours",
      gradient: "from-pink-500 to-purple-600",
      image:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "developpement-web",
      icon: Code,
      title: "Développement Web",
      subtitle: "Sites & Applications sur mesure",
      description:
        "Sites web et applications sur mesure, performants et sécurisés, conçus avec les dernières technologies du marché.",
      features: [
        "Sites web responsives",
        "Applications web progressives (PWA)",
        "Intégration CMS (WordPress, Strapi)",
        "API et services backend",
        "Optimisation SEO technique",
        "Maintenance et support",
      ],
      pricing: "À partir de 525.000 FCFA",
      duration: "2-6 semaines",
      gradient: "from-blue-500 to-cyan-600",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "ui-ux-design",
      icon: Smartphone,
      title: "UI/UX Design",
      subtitle: "Expériences utilisateur optimisées",
      description:
        "Interfaces intuitives et expériences utilisateur optimisées pour maximiser l'engagement et la conversion.",
      features: [
        "Recherche utilisateur et personas",
        "Wireframes et prototypes",
        "Design d'interfaces modernes",
        "Tests d'utilisabilité",
        "Design systems et composants",
        "Optimisation mobile",
      ],
      pricing: "À partir de 394.000 FCFA",
      duration: "1-4 semaines",
      gradient: "from-green-500 to-teal-600",
      image:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "motion-design",
      icon: Video,
      title: "Motion Design",
      subtitle: "Animations & Vidéos captivantes",
      description:
        "Animations et vidéos captivantes pour dynamiser votre communication et renforcer votre storytelling.",
      features: [
        "Animations 2D et 3D",
        "Vidéos promotionnelles",
        "Motion graphics pour web",
        "Animations logo et texte",
        "Montage vidéo professionnel",
        "Post-production et effets",
      ],
      pricing: "À partir de 262.000 FCFA",
      duration: "1-3 semaines",
      gradient: "from-orange-500 to-red-600",
      image:
        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "ecommerce",
      icon: ShoppingCart,
      title: "E-commerce",
      subtitle: "Solutions de vente en ligne",
      description:
        "Solutions e-commerce complètes pour vendre en ligne avec une expérience client optimisée.",
      features: [
        "Boutiques en ligne complètes",
        "Intégration paiements sécurisés",
        "Gestion d'inventaire",
        "Tableaux de bord analytiques",
        "Optimisation conversions",
        "Support multi-devises",
      ],
      pricing: "À partir de 787.000 FCFA",
      duration: "3-8 semaines",
      gradient: "from-indigo-500 to-purple-600",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "seo-marketing",
      icon: Search,
      title: "SEO & Marketing Digital",
      subtitle: "Visibilité & Acquisition",
      description:
        "Stratégies digitales pour améliorer votre visibilité en ligne et générer plus de leads qualifiés.",
      features: [
        "Audit SEO complet",
        "Optimisation on-page et off-page",
        "Stratégie de contenu",
        "Campagnes publicitaires (Google Ads)",
        "Analytics et reporting",
        "Social media management",
      ],
      pricing: "À partir de 197.000 FCFA/mois",
      duration: "Suivi continu",
      gradient: "from-yellow-500 to-orange-600",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Consultation",
      description: "Analyse de vos besoins et définition des objectifs",
      icon: Users,
    },
    {
      step: "02",
      title: "Stratégie",
      description: "Élaboration d'une stratégie sur mesure",
      icon: Zap,
    },
    {
      step: "03",
      title: "Création",
      description: "Développement et design de votre solution",
      icon: Code,
    },
    {
      step: "04",
      title: "Livraison",
      description: "Tests, optimisations et mise en ligne",
      icon: Check,
    },
  ];

  return (
    <div className="min-h-screen">
      <EnhancedHeader
        onLoginClick={() => {
          setAuthMode("login");
          setShowAuthModal(true);
        }}
        onRegisterClick={() => {
          setAuthMode("register");
          setShowAuthModal(true);
        }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Nos{" "}
              <span className="bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Une gamme complète de solutions digitales sur mesure pour
              propulser votre entreprise vers le succès dans l'écosystème
              numérique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const element = document.querySelector("#services-detail");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-accent text-black px-8 py-4 rounded-full font-semibold hover:bg-orange-400 transform hover:scale-105 transition-all duration-300"
              >
                Découvrir nos services
              </button>
              <Link
                to="/#contact"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section id="services-detail" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* Image */}
                <div
                  className={`relative group ${index % 2 === 1 ? "lg:col-start-2" : ""}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 opacity-20`}
                  ></div>
                  <div className="relative bg-white p-2 rounded-2xl shadow-xl">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-80 object-cover rounded-xl"
                    />
                  </div>
                  <div
                    className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div
                  className={
                    index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                  }
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-primary mb-2">
                        {service.title}
                      </h3>
                      <p
                        className={`text-lg font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}
                      >
                        {service.subtitle}
                      </p>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-lg">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      {service.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start space-x-3"
                        >
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing & Duration */}
                    <div className="flex flex-wrap gap-6 pt-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-gray-900">
                          {service.pricing}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-gray-600">
                          {service.duration}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-4">
                      <Link
                        to="/#contact"
                        className={`inline-flex items-center space-x-2 bg-gradient-to-r ${service.gradient} text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
                      >
                        <span>Demander un devis</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">
              Notre Processus de Travail
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Une méthodologie éprouvée pour garantir le succès de votre projet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative text-center group">
                {/* Connection line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent z-0"></div>
                )}

                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Prêt à donner vie à votre projet ?
            </h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Contactez-nous dès aujourd'hui pour discuter de vos besoins et
              obtenir un devis personnalisé adapté à votre budget et vos
              objectifs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#contact"
                className="bg-accent text-black px-8 py-4 rounded-full font-semibold hover:bg-orange-400 transform hover:scale-105 transition-all duration-300"
              >
                Demander un devis gratuit
              </Link>
              <Link
                to="/#portfolio"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300"
              >
                Voir nos réalisations
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />

      <AdminViewSwitcher />
    </div>
  );
}
