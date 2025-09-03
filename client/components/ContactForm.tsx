import React, { useState } from "react";
import { Lock, Send, User, Mail, MessageSquare, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { QuickAccountCreation } from "./QuickAccountCreation";
import { notificationService } from "../services/notificationService";

interface ContactFormProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onLoginClick,
  onRegisterClick,
}) => {
  const { isLoggedIn, currentUser } = useAuth();
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "normal",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickSignup, setShowQuickSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Vous devez être connecté pour envoyer une demande");
      return;
    }

    setIsSubmitting(true);
    try {
      // Créer la demande avec les info utilisateur
      const request = {
        id: Date.now().toString(),
        userId: currentUser?.email,
        userName: currentUser?.name || currentUser?.email,
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
        status: "pending",
        timestamp: new Date().toISOString(),
        responses: [],
      };

      // Sauvegarder dans localStorage (en attendant la DB)
      const existingRequests = JSON.parse(
        localStorage.getItem("userRequests") || "[]",
      );
      existingRequests.push(request);
      localStorage.setItem("userRequests", JSON.stringify(existingRequests));

      // Envoyer notification via le nouveau service
      notificationService.notifyContactForm({
        email: currentUser?.email,
        name: currentUser?.name,
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
      });

      alert(
        "Votre demande a été envoyée avec succès ! Vous recevrez une réponse sous peu.",
      );
      setFormData({ subject: "", message: "", priority: "normal" });
    } catch (error) {
      console.error("Erreur envoi demande:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      alert(`Erreur lors de l'envoi de la demande: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Connexion Requise
          </h3>
          <p className="text-white/80 mb-6 leading-relaxed">
            Pour envoyer une demande et bénéficier de notre suivi personnalisé,
            vous devez vous connecter ou créer un compte.
          </p>
          <div className="space-y-3">
            <Button
              onClick={onLoginClick}
              className="w-full bg-accent text-black font-semibold hover:bg-orange-400 transform hover:scale-105 transition-all duration-300"
            >
              <User size={20} className="mr-2" />
              Se Connecter
            </Button>
            <Button
              onClick={() => setShowQuickSignup(true)}
              variant="outline"
              className="w-full border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <UserPlus size={20} className="mr-2" />
              Créer un Compte Rapidement
            </Button>
          </div>
          <p className="text-white/60 text-sm mt-4">
            ✓ Suivi de vos demandes
            <br />
            ✓ Communication directe
            <br />✓ Notifications en temps réel
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <div className="mb-6">
          <div className="flex items-center text-white/90 mb-2">
            <User size={16} className="mr-2" />
            <span className="text-sm">Connecté en tant que:</span>
          </div>
          <p className="text-white font-semibold">
            {currentUser?.name || currentUser?.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Type de demande
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
            >
              <option value="normal" className="text-black">
                Demande générale
              </option>
              <option value="urgent" className="text-black">
                Demande urgente
              </option>
              <option value="quote" className="text-black">
                Demande de devis
              </option>
              <option value="support" className="text-black">
                Support technique
              </option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Sujet</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-accent transition-colors"
              placeholder="Sujet de votre demande"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Message</label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder="Décrivez votre projet ou votre demande en détail..."
            ></textarea>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-black font-semibold py-3 rounded-lg hover:bg-orange-400 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Envoi en cours...
              </div>
            ) : (
              <>
                <Send size={20} className="mr-2" />
                Envoyer la Demande
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg">
          <div className="flex items-center text-green-300 text-sm">
            <MessageSquare size={16} className="mr-2" />
            <span>
              Vous recevrez une notification dès que nous traiterons votre
              demande
            </span>
          </div>
        </div>
      </div>

      <QuickAccountCreation
        isOpen={showQuickSignup}
        onClose={() => setShowQuickSignup(false)}
        onAccountCreated={() => {
          setShowQuickSignup(false);
        }}
        prefilledData={{
          purpose: "contact",
          context: "Création de compte pour envoyer une demande de contact",
        }}
      />
    </>
  );
};
