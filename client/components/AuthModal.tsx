import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FormValidator, ValidationRules } from "./FormValidator";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = "login",
}) => {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    securityAnswer: "",
    secondSecurityAnswer: "",
  });
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
  const [showSecondQuestion, setShowSecondQuestion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, loginAdmin, loginUser } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (mode === "register") {
      // Validation des données
      if (formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        setIsLoading(false);
        return;
      }

      if (!formData.email || !formData.name || !formData.password) {
        setError("Tous les champs sont requis");
        setIsLoading(false);
        return;
      }

      // Simulation du processus d'inscription
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUsers = JSON.parse(
          localStorage.getItem("registeredUsers") || "[]",
        );
        const userExists = existingUsers.find(
          (user: any) =>
            user.email.toLowerCase() === formData.email.toLowerCase(),
        );

        if (userExists) {
          setError("Un compte avec cet email existe déjà");
          setIsLoading(false);
          return;
        }

        // Créer le nouvel utilisateur
        const newUser = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          password: formData.password, // En production, hash le mot de passe
          phone: formData.phone || "",
          registrationDate: new Date().toISOString(),
          isActive: true,
          role: "user",
        };

        // Enregistrer l'utilisateur
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

        // Connecter automatiquement l'utilisateur
        const loginSuccess = await loginUser(
          formData.email,
          formData.password,
          formData.name,
        );

        if (loginSuccess) {
          alert("🎉 Inscription réussie ! Vous êtes maintenant connecté.");
          onClose();
          resetForm();
        } else {
          setError("Inscription réussie mais erreur de connexion automatique");
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        setError("Erreur lors de l'inscription. Veuillez réessayer.");
      }

      setIsLoading(false);
    } else {
      // Tentative de connexion
      if (
        (formData.email.toLowerCase() === "philippefaizsanon@gmail.com" ||
          formData.email.toLowerCase() === "mindgraphixsolution@gmail.com") &&
        !showSecurityQuestion
      ) {
        // Email admin détecté, demander téléphone + question sécurité
        setShowSecurityQuestion(true);
        setIsLoading(false);
        return;
      }

      if (showSecurityQuestion) {
        // Tentative de connexion admin avec téléphone + question sécurité
        try {
          const isAdminLogin = await loginAdmin(
            formData.email,
            formData.password,
            formData.securityAnswer,
            showSecondQuestion ? formData.secondSecurityAnswer : undefined,
          );

          if (isAdminLogin === "needs_second_question") {
            setShowSecondQuestion(true);
            setError("");
          } else if (isAdminLogin) {
            alert(
              "Connexion administrateur réussie ! Redirection vers le tableau de bord...",
            );
            onClose();
            resetForm();
            setTimeout(() => {
              navigate("/admin");
            }, 500);
          } else {
            setError(
              showSecondQuestion
                ? "Réponse à la seconde question incorrecte."
                : "Identifiants administrateur incorrects. Vérifiez vos informations.",
            );
          }
        } catch (error) {
          console.error("Erreur lors de la connexion admin:", error);
          setError(
            "Erreur technique lors de la connexion. Veuillez réessayer.",
          );
        }
        setIsLoading(false);
      } else {
        // Connexion utilisateur normal ou email/mot de passe admin incorrects
        if (
          formData.email.toLowerCase() === "philippefaizsanon@gmail.com" ||
          formData.email.toLowerCase() === "mindgraphixsolution@gmail.com"
        ) {
          setError("Mot de passe administrateur incorrect.");
        } else {
          // Connexion utilisateur normal
          const userLogin = await loginUser(formData.email, formData.password);
          if (userLogin) {
            alert("Connexion utilisateur réussie !");
            onClose();
            resetForm();
          } else {
            setError("Erreur lors de la connexion. Veuillez réessayer.");
          }
        }
        setIsLoading(false);
      }
    }
  };

  const getSecurityQuestion = (email: string): string => {
    // Charger les administrateurs pour trouver la question de sécurité
    const siteContent = JSON.parse(localStorage.getItem("siteContent") || "{}");
    const systemAdmins = siteContent["system.admins"] || [];

    // Questions par défaut
    const defaultQuestions: { [key: string]: string } = {
      "philippefaizsanon@gmail.com": "Quel est votre anime préféré ?",
      "mindgraphixsolution@gmail.com": "Qui est le plus bête dans l'équipe ?",
    };

    // Chercher d'abord dans les admins créés dynamiquement
    const dynamicAdmin = systemAdmins.find(
      (admin: any) => admin.email.toLowerCase() === email.toLowerCase(),
    );

    if (dynamicAdmin && dynamicAdmin.securityQuestion) {
      return dynamicAdmin.securityQuestion;
    }

    // Sinon utiliser les questions par défaut
    return (
      defaultQuestions[email.toLowerCase()] ||
      "Question de sécurité non définie"
    );
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      securityAnswer: "",
      secondSecurityAnswer: "",
    });
    setShowSecurityQuestion(false);
    setShowSecondQuestion(false);
    setError("");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {mode === "login" ? (
                showSecurityQuestion ? (
                  <ShieldCheck size={24} />
                ) : (
                  <Lock size={24} />
                )
              ) : (
                <User size={24} />
              )}
            </div>
            <h2 className="text-2xl font-bold">
              {mode === "login"
                ? showSecurityQuestion
                  ? "Authentification Admin"
                  : "Connexion"
                : "Créer un compte"}
            </h2>
            <p className="text-white/80 mt-2">
              {mode === "login"
                ? showSecurityQuestion
                  ? "Vérification des identifiants administrateur"
                  : "Connectez-vous à votre compte"
                : "Rejoignez Mind Graphix Solution"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Votre nom complet"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <FormValidator
                value={formData.email}
                rules={[ValidationRules.email]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
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

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {showSecurityQuestion && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question de sécurité: {getSecurityQuestion(formData.email)}
                  </label>
                  <div className="relative">
                    <ShieldCheck
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.securityAnswer}
                      onChange={(e) =>
                        handleInputChange("securityAnswer", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Votre réponse..."
                      required
                    />
                  </div>
                </div>

                {showSecondQuestion && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question bonus: Qu'est-ce que tu aimes ?
                    </label>
                    <div className="relative">
                      <ShieldCheck
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={formData.secondSecurityAnswer}
                        onChange={(e) =>
                          handleInputChange(
                            "secondSecurityAnswer",
                            e.target.value,
                          )
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Votre réponse..."
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {mode === "login" && !showSecurityQuestion && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-gray-600">Se souvenir de moi</span>
                </label>
                <button
                  type="button"
                  className="text-primary hover:text-secondary font-medium"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>
                    {mode === "login"
                      ? showSecurityQuestion
                        ? "Authentification..."
                        : "Connexion..."
                      : "Inscription..."}
                  </span>
                </div>
              ) : mode === "login" ? (
                showSecurityQuestion ? (
                  "Connexion Admin"
                ) : (
                  "Se connecter"
                )
              ) : (
                "Créer mon compte"
              )}
            </Button>
          </form>

          {/* Switch mode */}
          {!showSecurityQuestion && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {mode === "login"
                  ? "Pas encore de compte ?"
                  : "Déjà un compte ?"}
                <button
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    resetForm();
                  }}
                  className="ml-2 text-primary hover:text-secondary font-semibold"
                >
                  {mode === "login" ? "S'inscrire" : "Se connecter"}
                </button>
              </p>
            </div>
          )}

          {showSecurityQuestion && (
            <div className="mt-6 text-center space-y-2">
              <button
                onClick={resetForm}
                className="text-primary hover:text-secondary font-semibold"
              >
                ← Retour à la connexion normale
              </button>
            </div>
          )}

          {/* Social auth */}
          {!showSecurityQuestion && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    setIsLoading(true);
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    const success = await loginUser(
                      "google.user@gmail.com",
                      "google_auth",
                      "Utilisateur Google",
                    );
                    if (success) {
                      alert("Connexion avec Google réussie !");
                      onClose();
                      resetForm();
                    } else {
                      setError("Erreur lors de la connexion avec Google");
                    }
                    setIsLoading(false);
                  }}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 py-3 hover:bg-gray-50"
                >
                  <span className="text-lg">🌐</span>
                  <span>Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    setIsLoading(true);
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    const success = await loginUser(
                      "facebook.user@facebook.com",
                      "facebook_auth",
                      "Utilisateur Facebook",
                    );
                    if (success) {
                      alert("Connexion avec Facebook réussie !");
                      onClose();
                      resetForm();
                    } else {
                      setError("Erreur lors de la connexion avec Facebook");
                    }
                    setIsLoading(false);
                  }}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 py-3 hover:bg-gray-50"
                >
                  <span className="text-lg">📘</span>
                  <span>Facebook</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
