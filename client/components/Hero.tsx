import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Sparkles, Zap, Palette } from "lucide-react";
import { Button } from "./ui/button";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";
import {
  HeroVisualEffects,
  AnimatedText,
  EnhancedButton,
  MorphingBlob,
} from "./VisualEffects";
import {
  ModernHeroEffects,
  PulsatingButton,
  GradientText,
} from "./ModernVisualEffects";

export const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const FloatingIcon = ({
    icon: Icon,
    className,
    delay,
  }: {
    icon: any;
    className: string;
    delay: string;
  }) => (
    <div
      className={`absolute ${className} animate-float opacity-20 hidden lg:block`}
      style={{ animationDelay: delay }}
    >
      <Icon size={40} className="text-white" />
    </div>
  );

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Enhanced Visual Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-10"></div>
        <ModernHeroEffects />
      </div>

      {/* Morphing Blobs */}
      <MorphingBlob className="top-20 left-20 w-64 h-64" />
      <MorphingBlob className="bottom-20 right-20 w-48 h-48" />

      {/* Enhanced Floating icons */}
      <FloatingIcon icon={Sparkles} className="top-32 right-32" delay="0s" />
      <FloatingIcon icon={Zap} className="bottom-40 left-32" delay="1s" />
      <FloatingIcon icon={Palette} className="top-48 left-1/4" delay="2s" />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 mr-2 text-accent" />
              Créativité & Innovation Digitale
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-inter tracking-tight">
              <GradientText className="drop-shadow-2xl">
                Solutions Créatives pour Votre Présence Digitale
              </GradientText>
            </h1>

            <EditableText
              contentKey="hero.subtitle"
              defaultValue="Nous combinons design captivant et développement robuste pour créer des expériences digitales mémorables qui propulsent votre entreprise vers le succès."
              as="p"
              className={`text-xl text-white mb-8 max-w-2xl leading-relaxed transition-all duration-1000 delay-300 font-inter font-medium drop-shadow-lg ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              multiline
            />

            <div
              className={`flex flex-col sm:flex-row gap-6 mb-12 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <PulsatingButton
                onClick={() => scrollToSection("#portfolio")}
                className="text-lg font-inter font-bold shadow-2xl"
              >
                ✨ Voir nos réalisations
              </PulsatingButton>
              <button
                onClick={() => scrollToSection("#contact")}
                className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-lg transform hover:scale-105 transition-all duration-300 text-lg rounded-full font-bold hover:border-accent hover:text-accent"
              >
                💬 Discutons de votre projet
              </button>
            </div>

            {/* Stats avec effets modernes */}
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="text-center p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="text-3xl font-bold mb-2">
                  <GradientText>50+</GradientText>
                </div>
                <div className="text-white/70 text-sm font-medium">
                  Projets Réalisés
                </div>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="text-3xl font-bold mb-2">
                  <GradientText>3+</GradientText>
                </div>
                <div className="text-white/70 text-sm font-medium">
                  Années d'Expérience
                </div>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="text-3xl font-bold mb-2">
                  <GradientText>100%</GradientText>
                </div>
                <div className="text-white/70 text-sm font-medium">
                  Satisfaction Client
                </div>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="text-3xl font-bold mb-2">
                  <GradientText>24/7</GradientText>
                </div>
                <div className="text-white/70 text-sm font-medium">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection("#about")}
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce-gentle transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <ChevronDown size={32} />
      </button>

      {/* Modern gradient border bottom */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};
