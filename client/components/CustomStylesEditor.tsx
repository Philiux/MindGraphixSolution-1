import React, { useState, useEffect } from "react";
import { Palette, Code, Save, X, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface CustomStylesEditorProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export const CustomStylesEditor: React.FC<CustomStylesEditorProps> = ({
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}) => {
  const { isSuperAdmin, getContent, updateContent } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;
  const [customCSS, setCustomCSS] = useState("");
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    const savedCSS = getContent("custom.styles", "");
    setCustomCSS(savedCSS);
    if (savedCSS) {
      applyStyles(savedCSS);
      setIsApplied(true);
    }
  }, []);

  const applyStyles = (css: string) => {
    // Remove existing custom styles safely
    const existing = document.getElementById("custom-super-admin-styles");
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    if (css.trim()) {
      // Create new style element
      const styleElement = document.createElement("style");
      styleElement.id = "custom-super-admin-styles";
      styleElement.textContent = css;

      // Add to head safely
      if (document.head) {
        document.head.appendChild(styleElement);
      }
    }
  };

  const saveStyles = () => {
    updateContent("custom.styles", customCSS);
    applyStyles(customCSS);
    setIsApplied(true);
    alert("Styles CSS appliqués avec succès !");
  };

  const resetStyles = () => {
    if (confirm("Supprimer tous les styles personnalisés ?")) {
      setCustomCSS("");
      updateContent("custom.styles", "");
      applyStyles("");
      setIsApplied(false);
    }
  };

  const previewStyles = () => {
    applyStyles(customCSS);
    setIsApplied(true);
  };

  if (!isSuperAdmin) return null;

  return (
    <>
      {/* CSS Editor Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Code size={24} />
                  <h2 className="text-2xl font-bold">
                    Éditeur CSS Personnalisé
                  </h2>
                  {isApplied && (
                    <span className="px-2 py-1 bg-green-500 rounded-full text-xs font-bold">
                      ACTIF
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-purple-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  Styles CSS Globaux
                </h3>
                <p className="text-purple-700 text-sm">
                  Ajoutez du CSS personnalisé qui sera appliqué à tout le site.
                  Utilisez avec précaution car cela peut affecter l'apparence
                  globale.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code CSS
                  </label>
                  <textarea
                    value={customCSS}
                    onChange={(e) => setCustomCSS(e.target.value)}
                    className="w-full h-80 p-4 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={`/* Exemple de CSS personnalisé */
.hero-section {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}

.custom-button {
  border-radius: 50px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

/* Animations personnalisées */
@keyframes customBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

.animate-custom-bounce {
  animation: customBounce 2s infinite;
}`}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={previewStyles}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Palette size={16} className="mr-2" />
                    Aperçu
                  </Button>

                  <Button
                    onClick={saveStyles}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Save size={16} className="mr-2" />
                    Sauvegarder
                  </Button>

                  <Button
                    onClick={resetStyles}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Réinitialiser
                  </Button>
                </div>

                {/* CSS Examples */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">
                    Exemples de modifications courantes
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Changer la couleur principale:</span>
                      <code className="bg-white px-2 py-1 rounded text-xs">
                        :root {"{ --primary: #your-color; }"}
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Modifier la police:</span>
                      <code className="bg-white px-2 py-1 rounded text-xs">
                        body {'{ font-family: "Your Font"; }'}
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Ajouter des ombres:</span>
                      <code className="bg-white px-2 py-1 rounded text-xs">
                        .card {"{ box-shadow: 0 4px 20px rgba(0,0,0,0.1); }"}
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Animation au survol:</span>
                      <code className="bg-white px-2 py-1 rounded text-xs">
                        .element:hover {"{ transform: scale(1.05); }"}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
