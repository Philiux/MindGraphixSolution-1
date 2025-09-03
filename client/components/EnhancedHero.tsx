import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Sparkles,
  Zap,
  Palette,
  ArrowRight,
  Star,
  Play,
  Shield,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";

export const EnhancedHero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Rotation automatique des features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: Palette,
      title: "Design Sur Mesure",
      description: "Identités visuelles uniques et percutantes",
      color: "from-pink-500 to-purple-600",
    },
    {
      icon: Zap,
      title: "Développement Rapide",
      description: "Solutions web performantes et sécurisées",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Award,
      title: "Qualité Premium",
      description: "Excellence garantie dans chaque projet",
      color: "from-emerald-500 to-green-600",
    },
    {
      icon: Shield,
      title: "Support 24/7",
      description: "Accompagnement continu et maintenance",
      color: "from-orange-500 to-red-600",
    },
  ];

  const stats = [
    { value: "50+", label: "Projets Réalisés", icon: "🎯" },
    { value: "3+", label: "Années d'Expérience", icon: "⚡" },
    { value: "100%", label: "Satisfaction Client", icon: "❤️" },
    { value: "24/7", label: "Support Premium", icon: "🛡️" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary"
    >
      {/* Background avec overlay dynamique */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

        {/* Particules animées */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Colonne gauche - Contenu textuel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full text-white border border-white/20"
            >
              <Sparkles className="w-5 h-5 mr-3 text-accent" />
              <span className="font-semibold">
                Mind Graphix Solution - Burkina Faso
              </span>
            </motion.div>

            {/* Titre principal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Solutions
                <span className="block bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent">
                  Créatives
                </span>
                <span className="block text-4xl md:text-5xl">
                  pour Votre Succès Digital
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-white/90 leading-relaxed max-w-2xl"
            >
              Nous transformons vos idées en expériences digitales
              exceptionnelles. Design graphique, développement web, UI/UX et
              solutions sur mesure pour propulser votre entreprise vers le
              succès.
            </motion.p>

            {/* Boutons d'action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={() => scrollToSection("#portfolio")}
                size="lg"
                className="group bg-gradient-to-r from-accent to-orange-400 text-black font-bold px-8 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Voir nos réalisations
              </Button>

              <Button
                onClick={() => scrollToSection("#contact")}
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg backdrop-blur-sm font-bold group"
              >
                Démarrer un projet
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Statistiques */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white mb-1 group-hover:text-accent transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Colonne droite - Features interactives */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Container des features */}
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Nos Expertises
                </h3>
                <p className="text-white/80">
                  Solutions complètes pour votre présence digitale
                </p>
              </div>

              {/* Feature active */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${features[currentFeature].color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    {React.createElement(features[currentFeature].icon, {
                      className: "w-10 h-10 text-white",
                    })}
                  </div>

                  <h4 className="text-xl font-bold text-white mb-3">
                    {features[currentFeature].title}
                  </h4>

                  <p className="text-white/80 leading-relaxed">
                    {features[currentFeature].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Indicateurs */}
              <div className="flex justify-center space-x-2 mt-8">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentFeature
                        ? "bg-accent shadow-lg"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* Services en grille */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { name: "Design Graphique", icon: "🎨", price: "98K FCFA" },
                  { name: "Développement Web", icon: "💻", price: "525K FCFA" },
                  { name: "UI/UX Design", icon: "📱", price: "394K FCFA" },
                  { name: "E-commerce", icon: "🛒", price: "787K FCFA" },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-accent/50 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <div className="text-white font-semibold text-sm mb-1 group-hover:text-accent transition-colors">
                      {service.name}
                    </div>
                    <div className="text-white/60 text-xs">
                      dès {service.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Éléments décoratifs */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator amélioré */}
      <motion.button
        onClick={() => scrollToSection("#about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white group"
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            Découvrir plus
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center group-hover:border-accent transition-colors"
          >
            <ChevronDown size={16} />
          </motion.div>
        </div>
      </motion.button>

      {/* Gradient de transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};
