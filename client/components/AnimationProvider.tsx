import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimationContextType {
  isAnimationsEnabled: boolean;
  toggleAnimations: () => void;
  pageTransition: any;
  cardAnimation: any;
  buttonAnimation: any;
  fadeInUp: any;
  slideInLeft: any;
  slideInRight: any;
  scaleIn: any;
  staggerContainer: any;
  staggerItem: any;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined,
);

export const useAnimations = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error("useAnimations must be used within an AnimationProvider");
  }
  return context;
};

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAnimationsEnabled, setIsAnimationsEnabled] = useState(true);

  useEffect(() => {
    const savedPreference = localStorage.getItem("animationsEnabled");
    if (savedPreference !== null) {
      setIsAnimationsEnabled(JSON.parse(savedPreference));
    }
  }, []);

  const toggleAnimations = () => {
    const newValue = !isAnimationsEnabled;
    setIsAnimationsEnabled(newValue);
    localStorage.setItem("animationsEnabled", JSON.stringify(newValue));
  };

  // Définitions des animations
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const cardAnimation = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    whileHover: { y: -5, scale: 1.02 },
    transition: { duration: 0.3, ease: "easeOut" },
  };

  const buttonAnimation = {
    whileHover: { scale: 1.05, y: -1 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2, ease: "easeInOut" },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  const slideInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  // Si les animations sont désactivées, retourner des objets vides
  const animations = isAnimationsEnabled
    ? {
        pageTransition,
        cardAnimation,
        buttonAnimation,
        fadeInUp,
        slideInLeft,
        slideInRight,
        scaleIn,
        staggerContainer,
        staggerItem,
      }
    : {
        pageTransition: {},
        cardAnimation: {},
        buttonAnimation: {},
        fadeInUp: {},
        slideInLeft: {},
        slideInRight: {},
        scaleIn: {},
        staggerContainer: {},
        staggerItem: {},
      };

  return (
    <AnimationContext.Provider
      value={{
        isAnimationsEnabled,
        toggleAnimations,
        ...animations,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

// Composants d'animation réutilisables
export const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  animation?: "fadeInUp" | "slideInLeft" | "slideInRight" | "scaleIn";
}> = ({ children, className = "", animation = "fadeInUp" }) => {
  const animations = useAnimations();

  return (
    <motion.div className={className} {...animations[animation]}>
      {children}
    </motion.div>
  );
};

export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const { cardAnimation } = useAnimations();

  return (
    <motion.div className={className} {...cardAnimation}>
      {children}
    </motion.div>
  );
};

export const AnimatedButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}> = ({ children, className = "", onClick, type = "button" }) => {
  const { buttonAnimation } = useAnimations();

  return (
    <motion.button
      type={type}
      className={className}
      onClick={onClick}
      {...buttonAnimation}
    >
      {children}
    </motion.button>
  );
};

export const StaggeredContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const { staggerContainer } = useAnimations();

  return (
    <motion.div className={className} {...staggerContainer}>
      {children}
    </motion.div>
  );
};

export const StaggeredItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const { staggerItem } = useAnimations();

  return (
    <motion.div className={className} {...staggerItem}>
      {children}
    </motion.div>
  );
};

// Hook pour les animations de scroll
export const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return [ref, isVisible] as const;
};

// Composant ScrollReveal
export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  animation?: "fadeInUp" | "slideInLeft" | "slideInRight" | "scaleIn";
}> = ({ children, className = "", animation = "fadeInUp" }) => {
  const [ref, isVisible] = useScrollAnimation();
  const animations = useAnimations();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={animations[animation].initial}
      animate={
        isVisible
          ? animations[animation].animate
          : animations[animation].initial
      }
      transition={animations[animation].transition}
    >
      {children}
    </motion.div>
  );
};
