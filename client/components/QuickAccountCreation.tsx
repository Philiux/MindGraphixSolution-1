import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Phone,
  UserPlus,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface QuickAccountCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated?: () => void;
  prefilledData?: {
    purpose: string; // "devis", "contact", "chat", etc.
    context: string;
  };
}

export const QuickAccountCreation: React.FC<QuickAccountCreationProps> = ({
  isOpen,
  onClose,
  onAccountCreated,
  prefilledData
}) => {
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    return formData.name.trim() && formData.email.trim() && formData.phone.trim();
  };

  const validateStep2 = () => {
    return formData.password.length >= 6 && formData.password === formData.confirmPassword;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      // Créer le compte
      const success = await loginUser(formData.email, formData.password, formData.name);
      
      if (success) {
        // Enregistrer les informations supplémentaires
        const userProfile = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date().toISOString(),
          createdFor: prefilledData?.purpose || 'general',
          context: prefilledData?.context || 'website'
        };
        
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        // Ajouter une notification pour les admins
        const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        adminNotifications.unshift({
          id: Date.now().toString(),
          type: 'new_user',
          title: 'Nouvel utilisateur inscrit',
          message: `${formData.name} vient de créer un compte pour ${prefilledData?.purpose || 'utiliser nos services'}`,
          timestamp: new Date().toISOString(),
          read: false,
          data: userProfile
        });
        localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
        
        onAccountCreated?.();
        onClose();
      } else {
        alert('Erreur lors de la création du compte. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur création compte:', error);
      alert('Erreur lors de la création du compte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <UserPlus size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Création de Compte</h3>
                <p className="text-white/80 text-sm">
                  {prefilledData?.purpose === 'devis' && 'Pour recevoir votre devis'}
                  {prefilledData?.purpose === 'contact' && 'Pour nous contacter'}
                  {prefilledData?.purpose === 'chat' && 'Pour utiliser le chat'}
                  {!prefilledData?.purpose && 'Accès à tous nos services'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'
              }`}>
                {currentStep > 1 ? <CheckCircle size={16} /> : '1'}
              </div>
              <span className="text-sm font-medium">Informations</span>
            </div>
            <div className={`flex-1 h-1 mx-4 rounded ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'
              }`}>
                {currentStep > 2 ? <CheckCircle size={16} /> : '2'}
              </div>
              <span className="text-sm font-medium">Sécurité</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Zap className="w-12 h-12 text-accent mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-900">Création Express</h4>
                <p className="text-gray-600 text-sm">
                  Un compte vous permet de suivre vos demandes et recevoir des notifications
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+226 XX XX XX XX"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={handleNextStep}
                disabled={!validateStep1()}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3"
              >
                Continuer
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-900">Sécurisez votre compte</h4>
                <p className="text-gray-600 text-sm">
                  Choisissez un mot de passe sécurisé pour protéger vos données
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Minimum 6 caractères"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Confirmez votre mot de passe"
                    required
                  />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h5 className="font-medium text-blue-800 mb-2">Avantages de votre compte :</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✓ Suivi de vos demandes en temps réel</li>
                  <li>✓ Chat direct avec notre équipe</li>
                  <li>✓ Notifications automatiques</li>
                  <li>✓ Historique de vos projets</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={!validateStep2() || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-white"
                >
                  {isSubmitting ? 'Création...' : 'Créer le compte'}
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-xs text-gray-500">
            En créant un compte, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>
    </div>
  );
};
