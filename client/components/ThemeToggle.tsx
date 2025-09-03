import React, { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Palette, Settings } from "lucide-react";
import { motion } from "framer-motion";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined,
);

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      let dark = false;

      if (theme === "system") {
        dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      } else {
        dark = theme === "dark";
      }

      setIsDark(dark);

      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    updateTheme();
    localStorage.setItem("theme", theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateTheme);
      return () => mediaQuery.removeEventListener("change", updateTheme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeToggle: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { theme, setTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: "light" as Theme, name: "Clair", icon: Sun, desc: "Thème lumineux" },
    { id: "dark" as Theme, name: "Sombre", icon: Moon, desc: "Thème sombre" },
    {
      id: "system" as Theme,
      name: "Système",
      icon: Monitor,
      desc: "Suit le système",
    },
  ];

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors duration-200 ${
          isDark
            ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {theme === "light" && <Sun size={20} />}
        {theme === "dark" && <Moon size={20} />}
        {theme === "system" && <Monitor size={20} />}
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <Palette size={16} className="text-primary" />
              <span
                className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}
              >
                Apparence
              </span>
            </div>

            <div className="space-y-1">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.id;

                return (
                  <motion.button
                    key={themeOption.id}
                    onClick={() => {
                      setTheme(themeOption.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      isSelected
                        ? isDark
                          ? "bg-primary/20 text-primary"
                          : "bg-primary/10 text-primary"
                        : isDark
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={16} />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{themeOption.name}</div>
                      <div
                        className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {themeOption.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Composant de basculement simple
export const SimpleThemeToggle: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { isDark, setTheme } = useTheme();

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`p-2 rounded-full transition-colors duration-300 ${
        isDark
          ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
          : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
      } ${className}`}
      whileHover={{ scale: 1.1, rotate: 180 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  );
};

// Hook pour styles conditionnels basés sur le thème
export const useThemeStyles = () => {
  const { isDark } = useTheme();

  return {
    isDark,
    bg: isDark ? "bg-gray-900" : "bg-white",
    bgSecondary: isDark ? "bg-gray-800" : "bg-gray-50",
    text: isDark ? "text-gray-100" : "text-gray-900",
    textSecondary: isDark ? "text-gray-300" : "text-gray-600",
    border: isDark ? "border-gray-700" : "border-gray-200",
    card: isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    hover: isDark ? "hover:bg-gray-700" : "hover:bg-gray-100",
  };
};
