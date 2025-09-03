import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, ScrollReveal } from "../components/AnimationProvider";
import { HomePageSEO } from "../components/SEOHead";
import { EnhancedHeader } from "../components/EnhancedHeader";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Services } from "../components/Services";
import { Portfolio } from "../components/Portfolio";
import { Team } from "../components/Team";
import { Footer } from "../components/Footer";
import { AuthModal } from "../components/AuthModal";
import { ConsolidatedSettingsButton } from "../components/ConsolidatedSettingsButton";
import { AdminReadyNotification } from "../components/AdminReadyNotification";
import { AdminValidation } from "../components/AdminValidation";

import { ImageManager } from "../components/ImageManager";
import { ContactForm } from "../components/ContactForm";
import { ErrorBoundary } from "../components/ErrorBoundary";
import FuturisticAIBot from "../components/FuturisticAIBot";
import { AllFeaturesNotification } from "../components/AllFeaturesNotification";
import QuickStartGuide from "../components/QuickStartGuide";
import { AnimatedBackground } from "../components/ModernVisualEffects";
import { InteractiveParticles } from "../components/InteractiveParticles";
import { NotificationProvider } from "../components/ModernNotifications";
import { DesignPerformanceIndicator } from "../components/DesignPerformanceIndicator";
import { useAuth } from "../contexts/AuthContext";
import { AdminToolsPanel } from "../components/AdminDesignTools";
import { UserInfoBanner } from "../components/UserInfoBanner";

export default function Index() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAIBot, setShowAIBot] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin, isMindAdmin, isLoggedIn } = useAuth();

  // Vérifier si l'utilisateur est un administrateur
  const isAdminUser = isAdmin || isSuperAdmin || isMindAdmin;

  // Raccourcis clavier globaux et gestionnaires d'événements
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A pour ouvrir les paramètres admin
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        // Déclencher l'ouverture du bouton consolidé
        const event = new CustomEvent("openAdminSettings");
        window.dispatchEvent(event);
      }
    };

    // Gestionnaires d'événements pour le guide de démarrage
    const handleOpenRegisterModal = () => {
      setShowRegisterModal(true);
    };

    const handleOpenAIBot = () => {
      setShowAIBot(true);
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("openRegisterModal", handleOpenRegisterModal);
    window.addEventListener("openAIBot", handleOpenAIBot);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("openRegisterModal", handleOpenRegisterModal);
      window.removeEventListener("openAIBot", handleOpenAIBot);
    };
  }, []);

  // Gérer le scroll vers les sections quand on arrive avec une ancre
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        // Nettoyer le hash en supprimant les paramètres de requête
        const cleanHash = location.hash.split("?")[0];
        const element = document.querySelector(cleanHash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // Petit d��lai pour s'assurer que le DOM est rendu
    }
  }, [location.hash]);

  return (
    <NotificationProvider>
      <motion.div
        className="min-h-screen relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatedBackground />
        <HomePageSEO />
        <EnhancedHeader
          onLoginClick={() => setShowLoginModal(true)}
          onRegisterClick={() => setShowRegisterModal(true)}
        />

        <main>
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <Team />

          <section
            id="contact"
            className="py-20 bg-gradient-to-br from-primary to-secondary text-white"
          >
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 relative inline-block">
                  Contactez-nous
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-accent rounded-full"></div>
                </h2>
                <p className="text-white/90 text-lg max-w-3xl mx-auto">
                  Prêt à donner vie à votre projet ? Parlons-en !
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Travaillons ensemble
                  </h3>
                  <p className="text-white/90 mb-8 leading-relaxed">
                    Que vous ayez un projet précis en tête ou que vous
                    souhaitiez simplement discuter des possibilités, nous sommes
                    à votre écoute.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold">📍</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Adresse</h4>
                        <p className="text-white/80">
                          Bobo-Dioulasso, Sect N°4
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold">📞</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Téléphone</h4>
                        <a
                          href="tel:+22654191605"
                          className="text-white/80 hover:text-accent transition-colors"
                        >
                          +226 54191605
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold">✉️</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <a
                          href="mailto:contact@mindgraphix.com"
                          className="text-white/80 hover:text-accent transition-colors"
                        >
                          contact@mindgraphix.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <ContactForm
                  onLoginClick={() => setShowLoginModal(true)}
                  onRegisterClick={() => setShowRegisterModal(true)}
                />
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {/* Auth Modals */}
        <AuthModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          defaultMode="login"
        />

        <AuthModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          defaultMode="register"
        />

        {/* AI Bot futuriste */}
        <FuturisticAIBot
          isOpen={showAIBot}
          onToggle={() => {
            console.log("Chat toggle clicked, current state:", showAIBot);
            setShowAIBot((prev) => !prev);
          }}
          onServiceRequest={(service) => {
            console.log("Service demandé:", service);
            // Rediriger vers le formulaire de devis avec le service pré-sélectionné
            if (service === "quote" || service.includes("devis")) {
              navigate("/demande-devis");
            } else if (service.includes("web")) {
              navigate("/demande-devis?category=web-development");
            } else if (service.includes("design")) {
              navigate("/demande-devis?category=ui-ux-design");
            } else if (service.includes("mobile")) {
              navigate("/demande-devis?category=mobile-app");
            } else {
              navigate("/demande-devis");
            }
            setShowAIBot(false);
          }}
        />

        {/* Système d'administration Mind Graphix */}
        <AdminValidation />
        <ConsolidatedSettingsButton />
        <AdminReadyNotification />
        <AllFeaturesNotification />

        {/* Chat en direct pour les clients */}
        <ErrorBoundary>
          <div></div>
        </ErrorBoundary>

        {/* Guide de démarrage */}
        <QuickStartGuide />

        {/* Outils réservés aux administrateurs */}
        {isAdminUser && (
          <>
            {/* Indicateur de performance design */}
            <DesignPerformanceIndicator />
          </>
        )}

        {/* Particules interactives - disponibles pour tous */}
        <InteractiveParticles />

        {/* Banner informatif pour les visiteurs non connectés uniquement */}
        {!isAdminUser && !isLoggedIn && <UserInfoBanner />}
      </motion.div>
    </NotificationProvider>
  );
}
