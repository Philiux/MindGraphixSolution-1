import { cn } from "@/lib/utils";

export type ContrastMode = "auto" | "white" | "black";

/**
 * Utilitaire pour générer les classes de contraste appropriées
 * selon le mode de contraste spécifié
 */
export function getContrastClasses(
  element: "text" | "button" | "card" | "input" | "nav" | "link",
  mode: ContrastMode = "auto",
  customClasses?: string,
): string {
  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const effectiveMode =
    mode === "auto" ? (isDarkMode ? "black" : "white") : mode;

  const contrastClasses = {
    text: {
      white: "text-contrast-white",
      black: "text-contrast-black",
    },
    button: {
      white: "btn-contrast-white",
      black: "btn-contrast-black",
    },
    card: {
      white: "card-contrast-white",
      black: "card-contrast-black",
    },
    input: {
      white: "input-contrast-white",
      black: "input-contrast-black",
    },
    nav: {
      white: "nav-contrast-white",
      black: "nav-contrast-black",
    },
    link: {
      white: "link-contrast-white",
      black: "link-contrast-black",
    },
  };

  return cn(contrastClasses[element][effectiveMode], customClasses);
}

/**
 * Fonction pour détecter le thème actuel
 */
export function getThemeMode(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Fonction pour basculer automatiquement les classes de contraste
 * sur tous les éléments avec l'attribut data-contrast
 */
export function updateContrastClasses(): void {
  if (typeof window === "undefined") return;

  const elements = document.querySelectorAll("[data-contrast]");
  const isDark = document.documentElement.classList.contains("dark");

  elements.forEach((element) => {
    const contrastType = element.getAttribute("data-contrast");
    if (!contrastType) return;

    const currentMode = isDark ? "black" : "white";
    const oppositeMode = isDark ? "white" : "black";

    // Retirer les anciennes classes
    element.classList.remove(
      `${contrastType}-contrast-${oppositeMode}`,
      `contrast-enhanced-${oppositeMode}`,
    );

    // Ajouter les nouvelles classes
    element.classList.add(
      `${contrastType}-contrast-${currentMode}`,
      `contrast-enhanced-${currentMode}`,
    );
  });
}

/**
 * Utilitaire pour obtenir les classes de fond avec contraste
 */
export function getBackgroundContrastClasses(
  mode: ContrastMode = "auto",
): string {
  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const effectiveMode =
    mode === "auto" ? (isDarkMode ? "black" : "white") : mode;

  return effectiveMode === "white"
    ? "contrast-enhanced-white"
    : "contrast-enhanced-black";
}

/**
 * Initialise l'observer pour les changements de thème
 */
export function initThemeObserver(): void {
  if (typeof window === "undefined") return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class" &&
        mutation.target === document.documentElement
      ) {
        updateContrastClasses();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

// Types pour une meilleure expérience de développement
export type ContrastElement =
  | "text"
  | "button"
  | "card"
  | "input"
  | "nav"
  | "link";
export type ThemeMode = "light" | "dark";
