import React, { useEffect } from "react";
import {
  getContrastClasses,
  initThemeObserver,
  type ContrastMode,
} from "@/utils/contrastUtils";

export interface ContrastWrapperProps {
  children: React.ReactNode;
  element?: "text" | "button" | "card" | "input" | "nav" | "link";
  mode?: ContrastMode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function ContrastWrapper({
  children,
  element = "text",
  mode = "auto",
  className = "",
  as: Component = "div",
}: ContrastWrapperProps) {
  const contrastClasses = getContrastClasses(element, mode, className);

  useEffect(() => {
    // Initialiser l'observer pour les changements de thème
    initThemeObserver();
  }, []);

  return (
    <Component className={contrastClasses} data-contrast={element}>
      {children}
    </Component>
  );
}

export default ContrastWrapper;
