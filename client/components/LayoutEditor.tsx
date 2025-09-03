import React, { useState, useEffect } from "react";
import {
  Layout,
  Move,
  RotateCcw,
  Eye,
  Save,
  Settings,
  Grid,
  Smartphone,
  Monitor,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface LayoutSettings {
  containerMaxWidth: string;
  sectionPadding: string;
  gridGaps: string;
  borderRadius: string;
  shadows: string;
  animations: boolean;
}

export const LayoutEditor: React.FC = () => {
  const { isSuperAdmin, getContent, updateContent } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLayoutMode, setIsLayoutMode] = useState(false);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [settings, setSettings] = useState<LayoutSettings>({
    containerMaxWidth: "1200px",
    sectionPadding: "80px",
    gridGaps: "32px",
    borderRadius: "16px",
    shadows: "medium",
    animations: true,
  });

  // Déclarer la fonction avant de l'utiliser
  const applyLayoutSettings = (layoutSettings: LayoutSettings) => {
    const root = document.documentElement;

    // Appliquer les variables CSS
    root.style.setProperty(
      "--container-max-width",
      layoutSettings.containerMaxWidth,
    );
    root.style.setProperty("--section-padding", layoutSettings.sectionPadding);
    root.style.setProperty("--grid-gap", layoutSettings.gridGaps);
    root.style.setProperty("--border-radius", layoutSettings.borderRadius);

    // Appliquer les ombres
    const shadowValues = {
      none: "none",
      small: "0 1px 3px rgba(0,0,0,0.1)",
      medium: "0 4px 15px rgba(0,0,0,0.1)",
      large: "0 10px 40px rgba(0,0,0,0.15)",
      xlarge: "0 20px 60px rgba(0,0,0,0.2)",
    };
    root.style.setProperty(
      "--shadow",
      shadowValues[layoutSettings.shadows as keyof typeof shadowValues],
    );

    // Animations
    if (!layoutSettings.animations) {
      root.style.setProperty("--animation-duration", "0s");
    } else {
      root.style.setProperty("--animation-duration", "0.3s");
    }
  };

  useEffect(() => {
    const savedSettings = getContent("layout.settings", null);
    if (savedSettings) {
      setSettings(savedSettings);
      applyLayoutSettings(savedSettings);
    }
  }, []);

  if (!isSuperAdmin) return null;

  const toggleLayoutMode = () => {
    setIsLayoutMode(!isLayoutMode);

    if (!isLayoutMode) {
      // Activer le mode édition de mise en page
      document.body.classList.add("layout-edit-mode");

      // Ajouter des bordures aux éléments éditables
      const style = document.createElement("style");
      style.id = "layout-editor-styles";
      style.textContent = `
        .layout-edit-mode .container {
          outline: 2px dashed #3b82f6 !important;
          outline-offset: 4px;
          position: relative;
        }
        
        .layout-edit-mode .container:hover {
          outline-color: #ef4444 !important;
        }
        
        .layout-edit-mode .container::before {
          content: 'Container';
          position: absolute;
          top: -24px;
          left: 0;
          background: #3b82f6;
          color: white;
          padding: 2px 8px;
          font-size: 12px;
          border-radius: 4px;
          z-index: 1000;
        }
        
        .layout-edit-mode section {
          outline: 1px dashed #10b981 !important;
          outline-offset: 2px;
          position: relative;
        }
        
        .layout-edit-mode section::before {
          content: 'Section';
          position: absolute;
          top: -20px;
          right: 0;
          background: #10b981;
          color: white;
          padding: 2px 6px;
          font-size: 10px;
          border-radius: 3px;
          z-index: 999;
        }
        
        .layout-edit-mode .grid {
          outline: 1px dotted #f59e0b !important;
          outline-offset: 1px;
        }
      `;
      if (document.head) {
        document.head.appendChild(style);
      }
    } else {
      // Désactiver le mode édition
      if (document.body) {
        document.body.classList.remove("layout-edit-mode");
      }
      const style = document.getElementById("layout-editor-styles");
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }
  };

  const changeDeviceView = (device: "desktop" | "tablet" | "mobile") => {
    setDeviceView(device);
    const mainContent = document.querySelector("main") || document.body;

    // Retirer les classes précédentes
    mainContent.classList.remove(
      "preview-mobile",
      "preview-tablet",
      "preview-desktop",
    );

    // Ajouter la nouvelle classe
    if (device === "mobile") {
      mainContent.classList.add("preview-mobile");
      mainContent.style.width = "375px";
      mainContent.style.margin = "0 auto";
    } else if (device === "tablet") {
      mainContent.classList.add("preview-tablet");
      mainContent.style.width = "768px";
      mainContent.style.margin = "0 auto";
    } else {
      mainContent.classList.add("preview-desktop");
      mainContent.style.width = "100%";
      mainContent.style.margin = "0";
    }
  };

  const saveSettings = () => {
    updateContent("layout.settings", settings);
    applyLayoutSettings(settings);
    alert("Paramètres de mise en page sauvegardés !");
  };

  const resetSettings = () => {
    const defaultSettings: LayoutSettings = {
      containerMaxWidth: "1200px",
      sectionPadding: "80px",
      gridGaps: "32px",
      borderRadius: "16px",
      shadows: "medium",
      animations: true,
    };
    setSettings(defaultSettings);
    applyLayoutSettings(defaultSettings);
    updateContent("layout.settings", null);
  };

  const updateSetting = (key: keyof LayoutSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applyLayoutSettings(newSettings);
  };

  return (
    <>
      {/* Layout Editor Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-36 right-4 z-50 w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        title="Éditeur de Mise en Page"
      >
        <Layout size={20} />
      </button>

      {/* Layout Editor Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Layout size={24} />
                  <h2 className="text-2xl font-bold">
                    Éditeur de Mise en Page
                  </h2>
                  {isLayoutMode && (
                    <span className="px-2 py-1 bg-yellow-500 text-black rounded-full text-xs font-bold animate-pulse">
                      MODE ÉDITION
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-cyan-800 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={toggleLayoutMode}
                    className={`${isLayoutMode ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                  >
                    <Move size={16} className="mr-2" />
                    {isLayoutMode ? "Désactiver édition" : "Mode édition"}
                  </Button>

                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => changeDeviceView("desktop")}
                      className={`px-3 py-2 ${deviceView === "desktop" ? "bg-cyan-500 text-white" : "bg-white text-gray-700"}`}
                      title="Vue Bureau"
                    >
                      <Monitor size={16} />
                    </button>
                    <button
                      onClick={() => changeDeviceView("tablet")}
                      className={`px-3 py-2 border-x border-gray-300 ${deviceView === "tablet" ? "bg-cyan-500 text-white" : "bg-white text-gray-700"}`}
                      title="Vue Tablette"
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => changeDeviceView("mobile")}
                      className={`px-3 py-2 ${deviceView === "mobile" ? "bg-cyan-500 text-white" : "bg-white text-gray-700"}`}
                      title="Vue Mobile"
                    >
                      <Smartphone size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={saveSettings}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Save size={16} className="mr-1" />
                    Sauvegarder
                  </Button>

                  <Button
                    onClick={resetSettings}
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-600"
                  >
                    <RotateCcw size={16} className="mr-1" />
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Paramètres de conteneur */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Settings size={20} className="mr-2" />
                    Paramètres de Conteneur
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Largeur maximale du conteneur
                      </label>
                      <select
                        value={settings.containerMaxWidth}
                        onChange={(e) =>
                          updateSetting("containerMaxWidth", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="1140px">1140px (Bootstrap)</option>
                        <option value="1200px">1200px (Standard)</option>
                        <option value="1280px">1280px (Large)</option>
                        <option value="1440px">1440px (Extra Large)</option>
                        <option value="100%">100% (Pleine largeur)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Espacement des sections
                      </label>
                      <input
                        type="range"
                        min="40"
                        max="120"
                        step="10"
                        value={parseInt(settings.sectionPadding)}
                        onChange={(e) =>
                          updateSetting("sectionPadding", `${e.target.value}px`)
                        }
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600 mt-1">
                        {settings.sectionPadding}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Espacement des grilles
                      </label>
                      <input
                        type="range"
                        min="16"
                        max="64"
                        step="8"
                        value={parseInt(settings.gridGaps)}
                        onChange={(e) =>
                          updateSetting("gridGaps", `${e.target.value}px`)
                        }
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600 mt-1">
                        {settings.gridGaps}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rayon des bordures
                      </label>
                      <select
                        value={settings.borderRadius}
                        onChange={(e) =>
                          updateSetting("borderRadius", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="0px">Aucun (0px)</option>
                        <option value="4px">Petit (4px)</option>
                        <option value="8px">Moyen (8px)</option>
                        <option value="16px">Large (16px)</option>
                        <option value="24px">Extra Large (24px)</option>
                        <option value="50%">Rond (50%)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Paramètres visuels */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Eye size={20} className="mr-2" />
                    Effets Visuels
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ombres
                      </label>
                      <select
                        value={settings.shadows}
                        onChange={(e) =>
                          updateSetting("shadows", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="none">Aucune</option>
                        <option value="small">Subtile</option>
                        <option value="medium">Moyenne</option>
                        <option value="large">Importante</option>
                        <option value="xlarge">Très importante</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.animations}
                          onChange={(e) =>
                            updateSetting("animations", e.target.checked)
                          }
                          className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Activer les animations
                        </span>
                      </label>
                    </div>

                    {/* Aperçu des paramètres */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Aperçu des styles
                      </h4>

                      <div className="space-y-3">
                        <div
                          className="bg-white p-4 border"
                          style={{
                            borderRadius: settings.borderRadius,
                            boxShadow:
                              settings.shadows !== "none"
                                ? "var(--shadow)"
                                : "none",
                          }}
                        >
                          <div className="h-4 bg-cyan-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>

                        <div
                          className="grid grid-cols-3"
                          style={{ gap: settings.gridGaps }}
                        >
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="bg-cyan-100 h-8"
                              style={{ borderRadius: settings.borderRadius }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                <h4 className="font-semibold text-cyan-800 mb-2">
                  Instructions
                </h4>
                <ul className="text-cyan-700 text-sm space-y-1">
                  <li>
                    • Activez le mode édition pour voir les contours des
                    éléments
                  </li>
                  <li>
                    • Utilisez les vues d'appareils pour tester la responsivité
                  </li>
                  <li>• Les modifications sont appliquées en temps réel</li>
                  <li>• N'oubliez pas de sauvegarder vos paramètres</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
