import React from "react";
import { Link } from "react-router-dom";
import { EnhancedHeader } from "../components/EnhancedHeader";
import { Footer } from "../components/Footer";
import { AuthModal } from "../components/AuthModal";
import { AdminViewSwitcher } from "../components/AdminViewSwitcher";
import { useState } from "react";
import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  Lightbulb,
  Code,
  Rocket,
} from "lucide-react";
import { AboutPageSEO } from "../components/SEOHead";

export default function About() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Nous repoussons constamment les limites de la créativité pour proposer des solutions uniques et innovantes.",
    },
    {
      icon: Heart,
      title: "Passion",
      description:
        "Chaque projet est abordé avec passion et dévouement pour garantir des résultats exceptionnels.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "Nous croyons en la force du travail d'équipe et de la collaboration étroite avec nos clients.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "La qualité et l'excellence sont au cœur de tout ce que nous faisons, sans compromis.",
    },
  ];

  const stats = [
    { number: "50+", label: "Projets Réalisés", icon: Rocket },
    { number: "3+", label: "Années d'Expérience", icon: Award },
    { number: "100%", label: "Satisfaction Client", icon: Heart },
    { number: "24/7", label: "Support Disponible", icon: Users },
  ];

  const timeline = [
    {
      year: "2022",
      title: "Création de l'entreprise",
      description:
        "Fondation de Mind Graphix Solution avec une vision claire : démocratiser le design de qualité.",
    },
    {
      year: "2023",
      title: "Expansion des services",
      description:
        "Ajout du développement web et mobile à notre portefeuille de compétences.",
    },
    {
      year: "2024",
      title: "Croissance et reconnaissance",
      description:
        "Plus de 50 projets réalisés et une clientèle fidèle qui nous fait confiance.",
    },
    {
      year: "2025",
      title: "Innovation continue",
      description:
        "Lancement de nouveaux services et technologies pour rester à la pointe de l'innovation.",
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

      <AboutPageSEO />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              À Propos de{" "}
              <span className="bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent">
                Mind Graphix
              </span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Nous sommes une équipe passionnée de créatifs et de développeurs
              dédiée à transformer vos idées en solutions digitales
              exceptionnelles qui marquent les esprits.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Notre Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Démocratiser l'accès au design de qualité et aux technologies
                modernes pour permettre à chaque entreprise de briller dans le
                monde digital.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Notre Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Devenir le partenaire de référence en Afrique de l'Ouest pour la
                création et le développement de solutions digitales innovantes
                et impactantes.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Nos Valeurs
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Créativité, excellence, collaboration et innovation guident
                chacune de nos décisions et interactions avec nos clients et
                partenaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Details */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">
              Nos Valeurs Fondamentales
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Ces valeurs sont le fondement de notre culture d'entreprise et de
              notre relation avec nos clients
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Nos Chiffres Clés</h2>
            <p className="text-white/90 text-lg">
              Des résultats qui témoignent de notre engagement et de notre
              expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center group">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-accent" />
                </div>
                <div className="text-4xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">
              Notre Histoire
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Un parcours jalonné d'innovations et de succès partagés avec nos
              clients
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent"></div>

              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className="relative flex items-start mb-12 last:mb-0"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {item.year}
                  </div>

                  {/* Content */}
                  <div className="ml-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex-1 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-primary mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-primary mb-6">
              Prêt à nous rejoindre dans cette aventure ?
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Que vous ayez un projet en tête ou que vous souhaitiez simplement
              en savoir plus sur nos services, nous serions ravis d'échanger
              avec vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#contact"
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Démarrer un projet
              </Link>
              <Link
                to="/#team"
                className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300"
              >
                Rencontrer l'équipe
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
    </div>
  );
}
