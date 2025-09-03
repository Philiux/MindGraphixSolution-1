import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, MessageSquare, Briefcase } from 'lucide-react';
import { Button } from './ui/button';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectCategory: string;
}

interface NotificationData {
  id: string;
  timestamp: Date;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectTitle: string;
  projectCategory: string;
  budget: string;
  timeline: string;
  message: string;
  status: 'new' | 'read' | 'responded';
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  projectCategory,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    timeline: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Créer une notification pour les admins
    const notification: NotificationData = {
      id: `quote_${Date.now()}`,
      timestamp: new Date(),
      clientName: formData.name,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      projectTitle,
      projectCategory,
      budget: formData.budget,
      timeline: formData.timeline,
      message: formData.message,
      status: 'new',
    };

    // Sauvegarder dans localStorage pour les admins
    const existingNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    existingNotifications.unshift(notification);
    localStorage.setItem('adminNotifications', JSON.stringify(existingNotifications));

    // Déclencher un événement pour notifier les composants admin
    window.dispatchEvent(new CustomEvent('newQuoteRequest', { detail: notification }));

    setIsLoading(false);
    setIsSubmitted(true);

    // Fermer automatiquement après 3 secondes
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        budget: '',
        timeline: '',
        message: '',
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Demande Envoyée !</h3>
          <p className="text-gray-600 mb-4">
            Merci pour votre intérêt ! Notre équipe vous contactera dans les plus brefs délais.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Fermeture automatique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={24} />
            </div>
            <h2 className="text-2xl font-bold">Demande de Devis</h2>
            <p className="text-white/80 mt-2">
              Projet: <span className="font-semibold">{projectTitle}</span>
            </p>
            <p className="text-white/60 text-sm">
              Catégorie: {projectCategory}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Votre nom complet"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="+226 XX XX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget estimé
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Sélectionner un budget</option>
                  <option value="500-1000">500€ - 1,000€</option>
                  <option value="1000-2500">1,000€ - 2,500€</option>
                  <option value="2500-5000">2,500€ - 5,000€</option>
                  <option value="5000-10000">5,000€ - 10,000€</option>
                  <option value="10000+">Plus de 10,000€</option>
                  <option value="a-discuter">À discuter</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Délai souhaité
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Sélectionner un délai</option>
                <option value="urgent">Urgent (moins de 2 semaines)</option>
                <option value="1-month">1 mois</option>
                <option value="2-3-months">2-3 mois</option>
                <option value="3-6-months">3-6 mois</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description du projet *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  rows={4}
                  placeholder="Décrivez votre projet en détail : objectifs, fonctionnalités souhaitées, public cible..."
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Notre engagement :</strong> Nous vous contacterons dans les 24h ouvrées pour 
                discuter de votre projet et vous proposer un devis personnalisé.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Envoi en cours...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Send size={20} />
                  <span>Envoyer la demande</span>
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
