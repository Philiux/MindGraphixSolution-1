import React, { useState, useEffect } from "react";
import {
  Palette,
  Type,
  Brush,
  Save,
  RefreshCw,
  Eye,
  Download,
  Upload,
  Sparkles,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";

interface StyleConfig {
  fontFamily: string;
  primaryGradient: string;
  secondaryGradient: string;
  accentGradient: string;
  backgroundGradient: string;
  textShadow: string;
  boxShadow: string;
  borderRadius: string;
  glowIntensity: string;
}

const defaultConfig: StyleConfig = {
  fontFamily: "Open Sans",
  primaryGradient: "linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)",
  secondaryGradient: "linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)",
  accentGradient: "linear-gradient(135deg, #ffff00 0%, #ff4500 100%)",
  backgroundGradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  textShadow: "0 0 10px currentColor",
  boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
  borderRadius: "0.75rem",
  glowIntensity: "0.3",
};

const fontOptions = [
  { name: "Open Sans", value: "Open Sans" },
  { name: "Orbitron", value: "Orbitron" },
  { name: "Exo 2", value: "Exo 2" },
  { name: "Rajdhani", value: "Rajdhani" },
  { name: "Space Mono", value: "Space Mono" },
  { name: "Audiowide", value: "Audiowide" },
  { name: "Black Ops One", value: "Black Ops One" },
  { name: "Zen Dots", value: "Zen Dots" },
];

export const AdvancedStyleManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<StyleConfig>(defaultConfig);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Charger la configuration sauvegardée
    const savedConfig = localStorage.getItem("advancedStyleConfig");
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration:", error);
      }
    }
  }, []);

  const saveConfig = () => {
    localStorage.setItem("advancedStyleConfig", JSON.stringify(config));
    applyStyles();
  };

  const applyStyles = () => {
    const root = document.documentElement;

    // Appliquer la police
    document.body.style.fontFamily = `'${config.fontFamily}', sans-serif`;

    // Appliquer les dégradés CSS
    root.style.setProperty("--gradient-primary", config.primaryGradient);
    root.style.setProperty("--gradient-secondary", config.secondaryGradient);
    root.style.setProperty("--gradient-accent", config.accentGradient);
    root.style.setProperty("--gradient-background", config.backgroundGradient);

    // Autres styles
    root.style.setProperty("--text-shadow", config.textShadow);
    root.style.setProperty("--box-shadow", config.boxShadow);
    root.style.setProperty("--border-radius", config.borderRadius);
    root.style.setProperty("--glow-intensity", config.glowIntensity);

    // Appliquer l'arrière-plan
    document.body.style.background = config.backgroundGradient;
  };

  const resetToDefault = () => {
    setConfig(defaultConfig);
    localStorage.removeItem("advancedStyleConfig");
    applyStyles();
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "style-config.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          setConfig(importedConfig);
          applyStyles();
        } catch (error) {
          alert("Erreur lors de l'importation du fichier de configuration");
        }
      };
      reader.readAsText(file);
    }
  };

  const updateConfig = (key: keyof StyleConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    if (previewMode) {
      const newConfig = { ...config, [key]: value };
      // Appliquer temporairement
      if (key === "fontFamily") {
        document.body.style.fontFamily = `'${value}', sans-serif`;
      }
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
      >
        <Sparkles size={16} />
        <span>Gestionnaire de Styles Avancé</span>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles size={24} />
              <h2 className="text-xl font-bold">
                Gestionnaire de Styles Avancé
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-white/80 text-sm mt-2">
            Personnalisez l'apparence complète de l'interface
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Actions rapides */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center space-x-2 ${
                previewMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Eye size={16} />
              <span>{previewMode ? "Mode Aperçu ON" : "Mode Aperçu OFF"}</span>
            </Button>
            <Button
              onClick={saveConfig}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Save size={16} />
              <span>Sauvegarder & Appliquer</span>
            </Button>
            <Button
              onClick={resetToDefault}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
            >
              <RefreshCw size={16} />
              <span>Réinitialiser</span>
            </Button>
            <Button
              onClick={exportConfig}
              className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700"
            >
              <Download size={16} />
              <span>Exporter</span>
            </Button>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importConfig}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
              >
                <Upload size={16} />
                <span>Importer</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section Police */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Type size={20} />
                <span>Police de caractères</span>
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Famille de police
                </label>
                <select
                  value={config.fontFamily}
                  onChange={(e) => updateConfig("fontFamily", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section Dégradés */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Palette size={20} />
                <span>Dégradés</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dégradé Primaire
                </label>
                <input
                  type="text"
                  value={config.primaryGradient}
                  onChange={(e) =>
                    updateConfig("primaryGradient", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                  placeholder="linear-gradient(...)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dégradé Secondaire
                </label>
                <input
                  type="text"
                  value={config.secondaryGradient}
                  onChange={(e) =>
                    updateConfig("secondaryGradient", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                  placeholder="linear-gradient(...)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dégradé Accent
                </label>
                <input
                  type="text"
                  value={config.accentGradient}
                  onChange={(e) =>
                    updateConfig("accentGradient", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                  placeholder="linear-gradient(...)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arrière-plan
                </label>
                <input
                  type="text"
                  value={config.backgroundGradient}
                  onChange={(e) =>
                    updateConfig("backgroundGradient", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                  placeholder="linear-gradient(...)"
                />
              </div>
            </div>

            {/* Section Effets */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Brush size={20} />
                <span>Effets visuels</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ombre de texte
                </label>
                <input
                  type="text"
                  value={config.textShadow}
                  onChange={(e) => updateConfig("textShadow", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                  placeholder="0 0 10px currentColor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ombre de boîte
                </label>
                <input
                  type="text"
                  value={config.boxShadow}
                  onChange={(e) => updateConfig("boxShadow", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                  placeholder="0 0 20px rgba(0, 255, 255, 0.3)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rayon de bordure
                </label>
                <input
                  type="text"
                  value={config.borderRadius}
                  onChange={(e) => updateConfig("borderRadius", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                  placeholder="0.75rem"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intensité de lueur (0-1)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.glowIntensity}
                  onChange={(e) =>
                    updateConfig("glowIntensity", e.target.value)
                  }
                  className="w-full"
                />
                <span className="text-sm text-gray-500">
                  {config.glowIntensity}
                </span>
              </div>
            </div>

            {/* Section Presets */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Settings size={20} />
                <span>Presets</span>
              </h3>

              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() =>
                    setConfig({
                      ...defaultConfig,
                      fontFamily: "Orbitron",
                      primaryGradient:
                        "linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)",
                      backgroundGradient:
                        "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                    })
                  }
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  Style Futuriste
                </Button>

                <Button
                  onClick={() =>
                    setConfig({
                      ...defaultConfig,
                      fontFamily: "Open Sans",
                      primaryGradient:
                        "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      backgroundGradient:
                        "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                    })
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Style Moderne
                </Button>

                <Button
                  onClick={() =>
                    setConfig({
                      ...defaultConfig,
                      fontFamily: "Rajdhani",
                      primaryGradient:
                        "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                      backgroundGradient:
                        "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
                    })
                  }
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Style Énergique
                </Button>
              </div>
            </div>
          </div>

          {/* Prévisualisation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Prévisualisation</h4>
            <div
              className="p-4 rounded-lg text-white text-center"
              style={{
                background: config.primaryGradient,
                fontFamily: `'${config.fontFamily}', sans-serif`,
                textShadow: config.textShadow,
                boxShadow: config.boxShadow,
                borderRadius: config.borderRadius,
              }}
            >
              <h5 className="text-lg font-bold">Exemple de titre</h5>
              <p>Texte d'exemple avec la police {config.fontFamily}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
