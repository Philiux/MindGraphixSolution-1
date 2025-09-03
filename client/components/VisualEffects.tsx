import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Composant de particules flottantes
export const FloatingParticles: React.FC<{ count?: number }> = ({
  count = 50,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
    }>
  >([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
    }));

    setParticles(newParticles);
  }, [count]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-primary/30 to-secondary/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
          }}
          animate={{
            y: [particle.y, particle.y - 100],
            x: [particle.x, particle.x + Math.sin(particle.y / 100) * 50],
            opacity: [particle.opacity, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Arrière-plan animé avec dégradé
export const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
          `,
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

// Effet de grille animée
export const AnimatedGrid: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
        animate={{
          x: [0, 50],
          y: [0, 50],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

// Cercles flottants
export const FloatingCircles: React.FC = () => {
  const circles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 200 + 100,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 20,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className="absolute rounded-full"
          style={{
            width: circle.size,
            height: circle.size,
            left: `${circle.x}%`,
            top: `${circle.y}%`,
            background: `
              radial-gradient(
                circle at center,
                rgba(139, 92, 246, 0.05) 0%,
                rgba(236, 72, 153, 0.05) 50%,
                transparent 70%
              )
            `,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: circle.duration,
            repeat: Infinity,
            delay: circle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Effet de vagues
export const WaveEffect: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-full opacity-20"
        style={{
          background: `
            linear-gradient(
              90deg,
              transparent,
              rgba(139, 92, 246, 0.2),
              rgba(236, 72, 153, 0.2),
              transparent
            )
          `,
          clipPath: "polygon(0 50%, 100% 70%, 100% 100%, 0% 100%)",
        }}
        animate={{
          x: [-100, 100],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

// Composant principal combinant tous les effets
export const HeroVisualEffects: React.FC = () => {
  return (
    <>
      <AnimatedBackground />
      <AnimatedGrid />
      <FloatingCircles />
      <FloatingParticles count={30} />
      <WaveEffect />
    </>
  );
};

// Hook pour les effets de scroll parallaxe
export const useParallax = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return offset;
};

// Composant de section avec parallaxe
export const ParallaxSection: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.5, className = "" }) => {
  const offset = useParallax(speed);

  return (
    <motion.div
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </motion.div>
  );
};

// Effet de focus morphique
export const MorphingBlob: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{
        background: `
          radial-gradient(
            circle,
            rgba(139, 92, 246, 0.3) 0%,
            rgba(236, 72, 153, 0.2) 50%,
            transparent 70%
          )
        `,
      }}
      animate={{
        scale: [1, 1.3, 1.1, 1],
        borderRadius: ["50%", "40%", "60%", "50%"],
        x: [0, 20, -10, 0],
        y: [0, -15, 10, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// Effet de texte animé
export const AnimatedText: React.FC<{
  text: string;
  className?: string;
  delay?: number;
}> = ({ text, className = "", delay = 0 }) => {
  const words = text.split(" ");

  return (
    <motion.div className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.1,
            ease: "easeOut",
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Bouton avec effet de survol avancé
export const EnhancedButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}> = ({ children, onClick, className = "", variant = "primary" }) => {
  const baseStyles =
    "relative overflow-hidden px-8 py-4 rounded-full font-semibold transition-all duration-300";

  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white",
    secondary: "bg-gradient-to-r from-secondary to-accent text-white",
    outline: "border-2 border-primary text-primary hover:text-white",
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 0.3 }}
        style={{ borderRadius: "inherit" }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
