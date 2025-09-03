import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const InteractiveParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const [isActive, setIsActive] = useState(true);

  const colors = [
    "hsl(260, 100%, 65%)", // primary
    "hsl(240, 100%, 70%)", // secondary
    "hsl(280, 100%, 75%)", // accent
  ];

  const createParticle = (x: number, y: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;

    return {
      id: Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: Math.random() * 60 + 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 3 + 1,
    };
  };

  const updateParticles = () => {
    particlesRef.current = particlesRef.current
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1 / particle.maxLife,
        vy: particle.vy + 0.02, // gravity
      }))
      .filter((particle) => particle.life > 0);
  };

  const drawParticles = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = particle.color;

      // Dessiner la particule
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Effet de trail
      ctx.globalAlpha = particle.life * 0.3;
      ctx.beginPath();
      ctx.arc(
        particle.x - particle.vx * 2,
        particle.y - particle.vy * 2,
        particle.size * 0.5,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      ctx.restore();
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || !isActive) return;

    updateParticles();
    drawParticles(ctx, canvas);

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current = { x, y, isMoving: true };

    // Créer des particules au passage de la souris
    if (Math.random() < 0.3) {
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push(
          createParticle(
            x + (Math.random() - 0.5) * 20,
            y + (Math.random() - 0.5) * 20,
          ),
        );
      }
    }

    // Arrêter le timer de "pas de mouvement"
    clearTimeout(mouseRef.current.isMoving as any);
    setTimeout(() => {
      mouseRef.current.isMoving = false;
    }, 100);
  };

  const handleClick = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Explosion de particules au clic
    for (let i = 0; i < 12; i++) {
      particlesRef.current.push(createParticle(x, y));
    }
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    if (isActive) {
      animate();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Contrôles */}
      <motion.button
        onClick={() => setIsActive(!isActive)}
        className="fixed top-20 right-20 z-50 p-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={
          isActive ? "Désactiver les particules" : "Activer les particules"
        }
      >
        {isActive ? (
          <span className="text-sm">✨</span>
        ) : (
          <span className="text-sm opacity-50">💫</span>
        )}
      </motion.button>

      {/* Instructions */}
    </>
  );
};
