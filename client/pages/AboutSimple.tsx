import React from "react";
import { EnhancedHeader } from "../components/EnhancedHeader";
import { Footer } from "../components/Footer";
import Logo from "../components/Logo";

export default function AboutSimple() {
  return (
    <div className="min-h-screen">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo prominent pour la page About */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <Logo size="xl" className="drop-shadow-2xl" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                  <span className="text-black font-bold text-sm">✓</span>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              À Propos de{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
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

      {/* Logo et Identité */}
      <section className="py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-600 mb-6">
              Notre Identité Visuelle
            </h2>
            <div className="flex justify-center items-center space-x-8">
              {/* Logo principal */}
              <div className="text-center">
                <Logo size="lg" className="mx-auto mb-4" />
                <p className="text-sm text-gray-600">Logo officiel</p>
              </div>

              {/* Version texte stylisée */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold">
                    <span>Mind</span>
                    <span className="text-yellow-400 mx-1">Graphix</span>
                    <span>Solution</span>
                  </div>
                  <div className="text-xs opacity-90 mt-1">
                    Créativité & Innovation Digitale
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Version texte</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-emerald-600 mb-6">
              Qui Sommes-Nous ?
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Mind Graphix Solution est une entreprise burkinabé spécialisée
              dans la création graphique et le développement web. Nous
              accompagnons nos clients dans la réalisation de leurs projets
              digitaux avec créativité et expertise.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-600 mb-4">
                Notre Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Démocratiser l'accès au design de qualité et aux technologies
                modernes pour permettre à chaque entreprise de briller dans le
                monde digital.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-black text-2xl">👁️</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-600 mb-4">
                Notre Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Devenir le partenaire de référence en Afrique de l'Ouest pour la
                création et le développement de solutions digitales innovantes
                et impactantes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-700 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">❤️</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-600 mb-4">
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

      {/* Contact rapide */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-emerald-600 mb-6">
              Prêt à collaborer ?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Contactez-nous pour discuter de votre projet et découvrir comment
              nous pouvons vous aider à atteindre vos objectifs.
            </p>
            <a
              href="mailto:contact@mindgraphix.com"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-block"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
