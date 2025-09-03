import React from "react";
import { motion } from "framer-motion";

export const ModernHeroEffects: React.FC = () => {
  return (
    <>
      {/* Gradient animé de fond */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-90"></div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Vagues animées */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <motion.div
          className="w-full h-20 bg-gradient-to-r from-accent/30 to-primary/30"
          style={{
            clipPath: "polygon(0 60%, 100% 40%, 100% 100%, 0% 100%)",
          }}
          animate={{
            transform: ["translateX(-50px)", "translateX(50px)"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 w-full h-16 bg-gradient-to-r from-secondary/20 to-accent/20"
          style={{
            clipPath: "polygon(0 80%, 100% 60%, 100% 100%, 0% 100%)",
          }}
          animate={{
            transform: ["translateX(30px)", "translateX(-30px)"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Orbes lumineux */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-accent to-primary rounded-full opacity-20 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-r from-secondary to-accent rounded-full opacity-30 blur-lg"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
    </>
  );
};

export const FloatingGlowCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`relative p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl ${className}`}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-xl"></div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export const PulsatingButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = "" }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full overflow-hidden ${className}`}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 15px 30px rgba(139, 92, 246, 0.4)",
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10">{children}</span>

      {/* Effet de brillance */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
    </motion.button>
  );
};

export const GradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <span
      className={`bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-bold ${className}`}
    >
      {children}
    </span>
  );
};

export const ModernCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glowEffect?: boolean;
}> = ({ children, className = "", glowEffect = true }) => {
  return (
    <motion.div
      className={`relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden ${className}`}
      whileHover={{
        scale: glowEffect ? 1.02 : 1,
        boxShadow: glowEffect
          ? "0 25px 50px rgba(139, 92, 246, 0.15)"
          : undefined,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {glowEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient de base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background"></div>

      {/* Motifs géométriques animés */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, hsl(var(--secondary)) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "50px 50px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Orbes de couleur flottants */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-secondary/15 to-accent/15 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
      />
    </div>
  );
};
