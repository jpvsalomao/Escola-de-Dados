"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 🎯 OPTIMIZATION: Use getBoundingClientRect to avoid layout thrashing
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // 🎯 OPTIMIZATION: Reduced particle count from 150 to 100 for better performance
    const particleCount = 100;
    const colors = [
      "#0D9488", // teal-600 (Design System v2.0)
      "#10b981", // emerald-500
      "#F97316", // orange-600 (coral accent)
      "#6366F1", // indigo-500
      "#8b5cf6", // purple-500
    ];

    // 🎯 OPTIMIZATION: Reuse particle array if already initialized
    if (particlesRef.current.length === 0) {
      // Pre-allocate array for better memory performance
      const particles: Particle[] = new Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        particles[i] = {
          x: Math.random() * rect.width,
          y: Math.random() * rect.height - rect.height,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
        };
      }

      particlesRef.current = particles;
    } else {
      // Reset existing particles to starting positions
      particlesRef.current.forEach((particle) => {
        particle.x = Math.random() * rect.width;
        particle.y = Math.random() * rect.height - rect.height;
        particle.vx = (Math.random() - 0.5) * 6;
        particle.vy = Math.random() * 3 + 2;
        particle.rotation = Math.random() * 360;
      });
    }

    let animationId: number;
    const gravity = 0.3;
    const friction = 0.99;

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;

      // Use particlesRef.current for better performance
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.vy += gravity;
        particle.vx *= friction;
        particle.vy *= friction;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        // Draw particle
        if (particle.y < canvas.height) {
          activeParticles++;
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          ctx.fillStyle = particle.color;
          ctx.fillRect(
            -particle.size / 2,
            -particle.size / 2,
            particle.size,
            particle.size
          );
          ctx.restore();
        }
      });

      if (activeParticles > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    }

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        width: "100vw",
        height: "100vh",
        // 🎯 OPTIMIZATION: CSS performance hints
        willChange: "transform",
        contain: "layout style paint",
      }}
    />
  );
}
