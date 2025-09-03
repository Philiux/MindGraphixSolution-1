import React, { useState } from "react";
import { Shield, Copy, Eye, EyeOff, Key, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

export const AdminDebugHelper: React.FC = () => {
  const [showCredentials, setShowCredentials] = useState(false);
  const [copied, setCopied] = useState("");
  const { loginAdmin, logout, isAdmin, isSuperAdmin, currentUser } = useAuth();

  // Identifiants de secours hardcodés
  const fallbackCredentials = [
    {
      email: "contact@mindgraphix.com",
      password: "AdminPass456",
      securityAnswer: "Graphix",
      secondSecurityAnswer: "Solution",
      name: "Administrateur Principal",
      description: "Identifiants de secours principal",
    },
    {
      email: "admin@mindgraphix.com",
      password: "SecurePass123",
      securityAnswer: "MindGraphix",
      name: "Administrateur Suprême",
      description: "Identifiants de secours suprême",
    },
  ];

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  const quickLogin = async (cred: any) => {
    try {
      const result = await loginAdmin(
        cred.email,
        cred.password,
        cred.securityAnswer,
        cred.secondSecurityAnswer || undefined,
      );

      if (result === true) {
        alert(`Connexion réussie en tant que ${cred.name} !`);
      } else if (result === "needs_second_question") {
        alert("Deuxième question de sécurité requise pour ce compte.");
      } else {
        alert("Échec de la connexion automatique.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      alert("Erreur technique lors de la connexion.");
    }
  };

  const clearAuthState = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("superAdminAuth");
    localStorage.removeItem("supremeAuth");
    localStorage.removeItem("supremeSession");
    localStorage.removeItem("currentUser");
    logout();
    alert("État d'authentification effacé. Rechargez la page.");
  };

  return (
    <div className="fixed bottom-24 right-4 z-40">
      {/* Bouton flottant */}
      <Button
        onClick={() => setShowCredentials(!showCredentials)}
        className="rounded-full p-3 bg-red-600 hover:bg-red-700 text-white shadow-lg"
        title="Assistant de débogage admin"
      >
        <Shield size={20} />
      </Button>

      {/* Panel de débogage */}
      {showCredentials && (
        <div className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-96 max-h-[70vh] overflow-y-auto z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Key size={18} />
              Assistant Admin
            </h3>
            <Button
              onClick={() => setShowCredentials(false)}
              variant="ghost"
              size="sm"
            >
              ×
            </Button>
          </div>

          {/* État actuel */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">État actuel :</h4>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${isAdmin ? "bg-green-500" : "bg-red-500"}`}
                />
                <span>Admin: {isAdmin ? "Oui" : "Non"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${isSuperAdmin ? "bg-green-500" : "bg-red-500"}`}
                />
                <span>Super Admin: {isSuperAdmin ? "Oui" : "Non"}</span>
              </div>
              <div className="text-gray-600">
                Utilisateur: {currentUser?.email || "Aucun"}
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="mb-6 space-y-2">
            <Button
              onClick={clearAuthState}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              Effacer l'état d'auth
            </Button>
          </div>

          {/* Identifiants de secours */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">
              Identifiants de secours :
            </h4>

            {fallbackCredentials.map((cred, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-sm text-gray-800">
                    {cred.name}
                  </h5>
                  <Button
                    onClick={() => quickLogin(cred)}
                    size="sm"
                    className="text-xs"
                  >
                    Connexion rapide
                  </Button>
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  {cred.description}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {cred.email}
                      </code>
                      <Button
                        onClick={() =>
                          copyToClipboard(cred.email, `email-${index}`)
                        }
                        size="sm"
                        variant="ghost"
                        className="p-1"
                      >
                        {copied === `email-${index}` ? (
                          <CheckCircle size={12} />
                        ) : (
                          <Copy size={12} />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mot de passe:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {cred.password}
                      </code>
                      <Button
                        onClick={() =>
                          copyToClipboard(cred.password, `password-${index}`)
                        }
                        size="sm"
                        variant="ghost"
                        className="p-1"
                      >
                        {copied === `password-${index}` ? (
                          <CheckCircle size={12} />
                        ) : (
                          <Copy size={12} />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sécurité:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {cred.securityAnswer}
                      </code>
                      <Button
                        onClick={() =>
                          copyToClipboard(
                            cred.securityAnswer,
                            `security-${index}`,
                          )
                        }
                        size="sm"
                        variant="ghost"
                        className="p-1"
                      >
                        {copied === `security-${index}` ? (
                          <CheckCircle size={12} />
                        ) : (
                          <Copy size={12} />
                        )}
                      </Button>
                    </div>
                  </div>

                  {cred.secondSecurityAnswer && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Sécurité 2:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {cred.secondSecurityAnswer}
                        </code>
                        <Button
                          onClick={() =>
                            copyToClipboard(
                              cred.secondSecurityAnswer,
                              `security2-${index}`,
                            )
                          }
                          size="sm"
                          variant="ghost"
                          className="p-1"
                        >
                          {copied === `security2-${index}` ? (
                            <CheckCircle size={12} />
                          ) : (
                            <Copy size={12} />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Instructions :</h4>
            <ol className="text-xs text-blue-700 space-y-1">
              <li>
                1. Utilisez "Connexion rapide" pour vous connecter
                automatiquement
              </li>
              <li>
                2. Ou copiez les identifiants et utilisez le bouton "Vue Admin"
              </li>
              <li>3. Si problème, effacez l'état d'auth et rechargez</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
