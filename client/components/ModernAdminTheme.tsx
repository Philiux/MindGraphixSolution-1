import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Configuration du thème moderne
export interface ModernTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  border: {
    radius: string;
    color: string;
  };
}

// Thèmes prédéfinis
export const modernThemes: Record<string, ModernTheme> = {
  emerald: {
    name: "Emerald Forest",
    colors: {
      primary: "#10B981",
      secondary: "#059669",
      accent: "#34D399",
      background: "#064E3B",
      surface: "#065F46",
      text: "#ECFDF5",
      textSecondary: "#A7F3D0",
      success: "#34D399",
      warning: "#FBBF24",
      error: "#F87171",
      info: "#60A5FA",
    },
    gradients: {
      primary: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      secondary: "linear-gradient(135deg, #059669 0%, #34D399 100%)",
      accent: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
      surface: "linear-gradient(135deg, #065F46 0%, #047857 100%)",
    },
    shadows: {
      sm: "0 2px 8px rgba(16, 185, 129, 0.15)",
      md: "0 4px 16px rgba(16, 185, 129, 0.2)",
      lg: "0 8px 32px rgba(16, 185, 129, 0.25)",
      xl: "0 16px 64px rgba(16, 185, 129, 0.3)",
    },
    border: {
      radius: "14px",
      color: "rgba(16, 185, 129, 0.2)",
    },
  },
  sunset: {
    name: "Sunset Vibes",
    colors: {
      primary: "#F97316",
      secondary: "#EA580C",
      accent: "#FB923C",
      background: "#431407",
      surface: "#9A3412",
      text: "#FFF7ED",
      textSecondary: "#FDBA74",
      success: "#22C55E",
      warning: "#EAB308",
      error: "#EF4444",
      info: "#3B82F6",
    },
    gradients: {
      primary: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
      secondary: "linear-gradient(135deg, #EA580C 0%, #FB923C 100%)",
      accent: "linear-gradient(135deg, #FB923C 0%, #F97316 100%)",
      surface: "linear-gradient(135deg, #9A3412 0%, #C2410C 100%)",
    },
    shadows: {
      sm: "0 2px 8px rgba(249, 115, 22, 0.15)",
      md: "0 4px 16px rgba(249, 115, 22, 0.2)",
      lg: "0 8px 32px rgba(249, 115, 22, 0.25)",
      xl: "0 16px 64px rgba(249, 115, 22, 0.3)",
    },
    border: {
      radius: "20px",
      color: "rgba(249, 115, 22, 0.2)",
    },
  },
  royal: {
    name: "Royal Purple",
    colors: {
      primary: "#7C3AED",
      secondary: "#5B21B6",
      accent: "#A855F7",
      background: "#2E1065",
      surface: "#4C1D95",
      text: "#F3E8FF",
      textSecondary: "#C4B5FD",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
    gradients: {
      primary: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
      secondary: "linear-gradient(135deg, #5B21B6 0%, #A855F7 100%)",
      accent: "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)",
      surface: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)",
    },
    shadows: {
      sm: "0 2px 8px rgba(124, 58, 237, 0.15)",
      md: "0 4px 16px rgba(124, 58, 237, 0.2)",
      lg: "0 8px 32px rgba(124, 58, 237, 0.25)",
      xl: "0 16px 64px rgba(124, 58, 237, 0.3)",
    },
    border: {
      radius: "16px",
      color: "rgba(124, 58, 237, 0.2)",
    },
  },
  neon: {
    name: "Neon Cyber",
    colors: {
      primary: "#00D9FF",
      secondary: "#FF0080",
      accent: "#00FF88",
      background: "#0A0E1A",
      surface: "#1A1F2E",
      text: "#FFFFFF",
      textSecondary: "#B8BCC8",
      success: "#00FF88",
      warning: "#FFB800",
      error: "#FF4444",
      info: "#00D9FF",
    },
    gradients: {
      primary: "linear-gradient(135deg, #00D9FF 0%, #FF0080 100%)",
      secondary: "linear-gradient(135deg, #FF0080 0%, #00FF88 100%)",
      accent: "linear-gradient(135deg, #00FF88 0%, #00D9FF 100%)",
      surface: "linear-gradient(135deg, #1A1F2E 0%, #2A2F3E 100%)",
    },
    shadows: {
      sm: "0 2px 8px rgba(0, 217, 255, 0.15)",
      md: "0 4px 16px rgba(0, 217, 255, 0.2)",
      lg: "0 8px 32px rgba(0, 217, 255, 0.25)",
      xl: "0 16px 64px rgba(0, 217, 255, 0.3)",
    },
    border: {
      radius: "16px",
      color: "rgba(0, 217, 255, 0.2)",
    },
  },
  ocean: {
    name: "Ocean Deep",
    colors: {
      primary: "#0EA5E9",
      secondary: "#3B82F6",
      accent: "#06B6D4",
      background: "#0F172A",
      surface: "#1E293B",
      text: "#F8FAFC",
      textSecondary: "#CBD5E1",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
    gradients: {
      primary: "linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)",
      secondary: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
      accent: "linear-gradient(135deg, #06B6D4 0%, #0EA5E9 100%)",
      surface: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
    },
    shadows: {
      sm: "0 2px 8px rgba(14, 165, 233, 0.15)",
      md: "0 4px 16px rgba(14, 165, 233, 0.2)",
      lg: "0 8px 32px rgba(14, 165, 233, 0.25)",
      xl: "0 16px 64px rgba(14, 165, 233, 0.3)",
    },
    border: {
      radius: "12px",
      color: "rgba(14, 165, 233, 0.2)",
    },
  },
  cosmic: {
    name: "Cosmic Purple",
    colors: {
      primary: "#8B5CF6",
      secondary: "#A855F7",
      accent: "#EC4899",
      background: "#0F0C15",
      surface: "#1E1B3A",
      text: "#F8FAFC",
      textSecondary: "#C1C7D0",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
    gradients: {
      primary: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
      secondary: "linear-gradient(135deg, #A855F7 0%, #EC4899 100%)",
      accent: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
      surface: "linear-gradient(135deg, #1E1B3A 0%, #2D2B5A 100%)",
    },
    shadows: {
      sm: "0 2px 8px rgba(139, 92, 246, 0.15)",
      md: "0 4px 16px rgba(139, 92, 246, 0.2)",
      lg: "0 8px 32px rgba(139, 92, 246, 0.25)",
      xl: "0 16px 64px rgba(139, 92, 246, 0.3)",
    },
    border: {
      radius: "18px",
      color: "rgba(139, 92, 246, 0.2)",
    },
  },
  midnight: {
    name: "Midnight Black",
    colors: {
      primary: "#1F2937",
      secondary: "#374151",
      accent: "#6B7280",
      background: "#0F0F0F",
      surface: "#1A1A1A",
      text: "#F9FAFB",
      textSecondary: "#D1D5DB",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
    gradients: {
      primary: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
      secondary: "linear-gradient(135deg, #374151 0%, #6B7280 100%)",
      accent: "linear-gradient(135deg, #6B7280 0%, #1F2937 100%)",
      surface: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)",
    },
    shadows: {
      sm: "0 2px 8px rgba(31, 41, 55, 0.15)",
      md: "0 4px 16px rgba(31, 41, 55, 0.2)",
      lg: "0 8px 32px rgba(31, 41, 55, 0.25)",
      xl: "0 16px 64px rgba(31, 41, 55, 0.3)",
    },
    border: {
      radius: "10px",
      color: "rgba(31, 41, 55, 0.2)",
    },
  },
};

interface ModernAdminThemeProps {
  children: React.ReactNode;
  theme?: string;
  onThemeChange?: (theme: string) => void;
}

export const ModernAdminTheme: React.FC<ModernAdminThemeProps> = ({
  children,
  theme = "emerald",
  onThemeChange,
}) => {
  const [currentTheme, setCurrentTheme] = useState<string>(theme);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem("adminTheme") || theme;
    setCurrentTheme(savedTheme);

    // Écouter les changements de thème depuis le bot admin
    const handleThemeChange = (event: CustomEvent) => {
      const newTheme = event.detail;
      if (modernThemes[newTheme]) {
        setCurrentTheme(newTheme);
        if (onThemeChange) {
          onThemeChange(newTheme);
        }
      }
    };

    window.addEventListener("changeTheme", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener(
        "changeTheme",
        handleThemeChange as EventListener,
      );
    };
  }, [theme, onThemeChange]);

  const activeTheme = modernThemes[currentTheme] || modernThemes.emerald;

  // Appliquer le thème au CSS global
  useEffect(() => {
    if (!isClient) return;

    const root = document.documentElement;

    // Appliquer les variables CSS custom
    Object.entries(activeTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--admin-${key}`, value);
    });

    Object.entries(activeTheme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--admin-gradient-${key}`, value);
    });

    Object.entries(activeTheme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--admin-shadow-${key}`, value);
    });

    root.style.setProperty(`--admin-border-radius`, activeTheme.border.radius);
    root.style.setProperty(`--admin-border-color`, activeTheme.border.color);

    // Sauvegarder le thème
    localStorage.setItem("adminTheme", currentTheme);
  }, [activeTheme, currentTheme, isClient]);

  const switchTheme = (newTheme: string) => {
    setCurrentTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <div
      className="admin-theme-wrapper min-h-screen transition-all duration-500"
      style={{
        background: activeTheme.gradients.surface,
        color: activeTheme.colors.text,
      }}
    >
      {/* Effets de particules pour le thème cyber */}
      {currentTheme === "neon" && isClient && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
              animate={{
                x: [
                  Math.random() *
                    (typeof window !== "undefined" ? window.innerWidth : 1920),
                  Math.random() *
                    (typeof window !== "undefined" ? window.innerWidth : 1920),
                ],
                y: [
                  Math.random() *
                    (typeof window !== "undefined" ? window.innerHeight : 1080),
                  Math.random() *
                    (typeof window !== "undefined" ? window.innerHeight : 1080),
                ],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Contenu principal */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ModernAdminTheme;
