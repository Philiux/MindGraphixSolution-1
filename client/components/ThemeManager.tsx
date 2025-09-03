import React, { useState, useEffect } from "react";
import {
  Palette,
  Save,
  RefreshCw,
  Eye,
  Download,
  Upload,
  Wand2,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  destructive: string;
}

const presetThemes = {
  default: {
    name: "Défaut",
    colors: {
      primary: "hsl(256, 77%, 48%)",
      secondary: "hsl(237, 57%, 42%)",
      accent: "hsl(45, 100%, 55%)",
      background: "hsl(0, 0%, 100%)",
      foreground: "hsl(222.2, 84%, 4.9%)",
      muted: "hsl(210, 40%, 96.1%)",
      destructive: "hsl(0, 84.2%, 60.2%)",
    },
  },
  dark: {
    name: "Sombre",
    colors: {
      primary: "hsl(256, 77%, 58%)",
      secondary: "hsl(237, 57%, 52%)",
      accent: "hsl(45, 100%, 65%)",
      background: "hsl(222.2, 84%, 4.9%)",
      foreground: "hsl(210, 40%, 98%)",
      muted: "hsl(217.2, 32.6%, 17.5%)",
      destructive: "hsl(0, 62.8%, 30.6%)",
    },
  },
  ocean: {
    name: "Océan",
    colors: {
      primary: "hsl(200, 80%, 45%)",
      secondary: "hsl(190, 70%, 55%)",
      accent: "hsl(35, 90%, 60%)",
      background: "hsl(0, 0%, 100%)",
      foreground: "hsl(210, 40%, 15%)",
      muted: "hsl(200, 30%, 95%)",
      destructive: "hsl(0, 84.2%, 60.2%)",
    },
  },
  forest: {
    name: "Forêt",
    colors: {
      primary: "hsl(120, 50%, 35%)",
      secondary: "hsl(100, 40%, 45%)",
      accent: "hsl(60, 80%, 50%)",
      background: "hsl(0, 0%, 100%)",
      foreground: "hsl(120, 20%, 15%)",
      muted: "hsl(120, 20%, 95%)",
      destructive: "hsl(0, 84.2%, 60.2%)",
    },
  },
  sunset: {
    name: "Coucher de soleil",
    colors: {
      primary: "hsl(20, 80%, 55%)",
      secondary: "hsl(340, 70%, 60%)",
      accent: "hsl(50, 90%, 65%)",
      background: "hsl(0, 0%, 100%)",
      foreground: "hsl(20, 30%, 15%)",
      muted: "hsl(20, 20%, 95%)",
      destructive: "hsl(0, 84.2%, 60.2%)",
    },
  },
};

interface ThemeManagerProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export const ThemeManager: React.FC<ThemeManagerProps> = ({
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}) => {
  const { isAdmin, isSuperAdmin, getContent, updateContent } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;
  const [currentTheme, setCurrentTheme] = useState<ThemeColors>(
    presetThemes.default.colors,
  );
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const savedTheme = getContent("theme.colors", null);
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  if (!isAdmin && !isSuperAdmin) return null;

  const applyTheme = (colors: ThemeColors) => {
    const root = document.documentElement;

    // Convertir HSL en valeurs CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      // Extraire les valeurs HSL de la chaîne "hsl(h, s%, l%)"
      const hslMatch = value.match(/hsl\(([^)]+)\)/);
      if (hslMatch) {
        const hslValues = hslMatch[1];
        root.style.setProperty(`--${key}`, hslValues);
      }
    });

    // Gradients spéciaux
    root.style.setProperty(
      "--gradient-primary",
      `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    );
    root.style.setProperty(
      "--gradient-accent",
      `linear-gradient(135deg, ${colors.accent} 0%, hsl(from ${colors.accent} h s calc(l - 10%)) 100%)`,
    );
  };

  const previewTheme = (colors: ThemeColors) => {
    setCurrentTheme(colors);
    applyTheme(colors);
    setIsPreview(true);
  };

  const saveTheme = () => {
    updateContent("theme.colors", currentTheme);
    setIsPreview(false);
    alert("Thème sauvegardé avec succès !");
  };

  const resetTheme = () => {
    const defaultColors = presetThemes.default.colors;
    setCurrentTheme(defaultColors);
    applyTheme(defaultColors);
    updateContent("theme.colors", null);
    setIsPreview(false);
  };

  const updateColor = (key: keyof ThemeColors, value: string) => {
    const newTheme = { ...currentTheme, [key]: value };
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
    setIsPreview(true);
  };

  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const hslToHex = (hsl: string): string => {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return "#000000";

    const h = parseInt(match[1]) / 360;
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const exportTheme = () => {
    const themeData = {
      name: "Custom Theme",
      colors: currentTheme,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "theme.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target?.result as string);
          if (themeData.colors) {
            previewTheme(themeData.colors);
          }
        } catch (error) {
          alert("Erreur lors de l'importation du thème");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      {/* Theme Manager Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Palette size={24} />
                  <h2 className="text-2xl font-bold">Gestionnaire de Thème</h2>
                  {isPreview && (
                    <span className="px-2 py-1 bg-yellow-500 text-black rounded-full text-xs font-bold animate-pulse">
                      APERÇU
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-pink-800 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Couleurs personnalisées */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Couleurs Personnalisées
                  </h3>

                  <div className="space-y-4">
                    {Object.entries(currentTheme).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-4">
                        <div className="w-24 text-sm font-medium capitalize">
                          {key === "destructive"
                            ? "Erreur"
                            : key === "foreground"
                              ? "Texte"
                              : key === "background"
                                ? "Fond"
                                : key === "muted"
                                  ? "Atténué"
                                  : key}
                        </div>
                        <input
                          type="color"
                          value={hslToHex(value)}
                          onChange={(e) =>
                            updateColor(
                              key as keyof ThemeColors,
                              hexToHsl(e.target.value),
                            )
                          }
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            updateColor(
                              key as keyof ThemeColors,
                              e.target.value,
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                          placeholder="hsl(0, 0%, 0%)"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 space-y-3">
                    <div className="flex space-x-3">
                      <Button
                        onClick={saveTheme}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                        disabled={!isPreview}
                      >
                        <Save size={16} className="mr-2" />
                        Sauvegarder
                      </Button>

                      <Button
                        onClick={resetTheme}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Réinitialiser
                      </Button>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={exportTheme}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download size={16} className="mr-2" />
                        Exporter
                      </Button>

                      <label className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Upload size={16} className="mr-2" />
                          Importer
                        </Button>
                        <input
                          type="file"
                          accept=".json"
                          onChange={importTheme}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Thèmes prédéfinis */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Thèmes Prédéfinis
                  </h3>

                  <div className="space-y-4">
                    {Object.entries(presetThemes).map(([key, theme]) => (
                      <div
                        key={key}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                        onClick={() => previewTheme(theme.colors)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{theme.name}</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              previewTheme(theme.colors);
                            }}
                          >
                            <Eye size={14} className="mr-1" />
                            Aperçu
                          </Button>
                        </div>

                        <div className="flex space-x-2">
                          {[
                            "primary",
                            "secondary",
                            "accent",
                            "background",
                            "foreground",
                          ].map((colorKey) => {
                            const color =
                              theme.colors[colorKey as keyof ThemeColors];
                            return (
                              <div
                                key={colorKey}
                                className="w-8 h-8 rounded border border-gray-300"
                                style={{ backgroundColor: color }}
                                title={colorKey}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Générateur automatique */}
                  <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                      <Wand2 size={16} className="mr-2" />
                      Générateur Automatique
                    </h4>
                    <p className="text-purple-700 text-sm mb-4">
                      Générez un thème harmonieux basé sur une couleur
                      principale.
                    </p>
                    <div className="flex space-x-3">
                      <input
                        type="color"
                        className="w-12 h-10 border border-gray-300 rounded"
                        onChange={(e) => {
                          // Génération automatique d'un thème harmonieux
                          const baseColor = e.target.value;
                          const generatedTheme: ThemeColors = {
                            primary: hexToHsl(baseColor),
                            secondary: hexToHsl(baseColor + "20"), // Approximation
                            accent: hexToHsl("#ffd700"), // Or
                            background: "hsl(0, 0%, 100%)",
                            foreground: "hsl(222.2, 84%, 4.9%)",
                            muted: "hsl(210, 40%, 96.1%)",
                            destructive: "hsl(0, 84.2%, 60.2%)",
                          };
                          previewTheme(generatedTheme);
                        }}
                      />
                      <Button
                        variant="outline"
                        className="flex-1 text-purple-700 border-purple-300"
                        onClick={() => {
                          // Génération aléatoire
                          const randomHue = Math.floor(Math.random() * 360);
                          const generatedTheme: ThemeColors = {
                            primary: `hsl(${randomHue}, 70%, 50%)`,
                            secondary: `hsl(${(randomHue + 30) % 360}, 65%, 55%)`,
                            accent: `hsl(${(randomHue + 180) % 360}, 80%, 60%)`,
                            background: "hsl(0, 0%, 100%)",
                            foreground: "hsl(222.2, 84%, 4.9%)",
                            muted: "hsl(210, 40%, 96.1%)",
                            destructive: "hsl(0, 84.2%, 60.2%)",
                          };
                          previewTheme(generatedTheme);
                        }}
                      >
                        <Wand2 size={14} className="mr-2" />
                        Générer Aléatoirement
                      </Button>
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
