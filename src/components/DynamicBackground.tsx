import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DynamicBackgroundProps {
  children: React.ReactNode;
  variant?: 'menu' | 'battle' | 'collection' | 'mystical';
  intensity?: 'low' | 'medium' | 'high';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  children,
  variant = 'menu',
  intensity = 'medium'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);

  // Particle configuration based on variant and intensity
  const getParticleConfig = () => {
    const configs = {
      menu: {
        count: intensity === 'low' ? 20 : intensity === 'medium' ? 40 : 60,
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'],
        speed: 0.5,
        size: { min: 1, max: 3 }
      },
      battle: {
        count: intensity === 'low' ? 30 : intensity === 'medium' ? 60 : 100,
        colors: ['#ef4444', '#f97316', '#eab308', '#dc2626'],
        speed: 1.0,
        size: { min: 2, max: 5 }
      },
      collection: {
        count: intensity === 'low' ? 15 : intensity === 'medium' ? 30 : 50,
        colors: ['#10b981', '#059669', '#047857', '#065f46'],
        speed: 0.3,
        size: { min: 1, max: 2 }
      },
      mystical: {
        count: intensity === 'low' ? 25 : intensity === 'medium' ? 50 : 80,
        colors: ['#a855f7', '#c084fc', '#e879f9', '#f0abfc'],
        speed: 0.7,
        size: { min: 1, max: 4 }
      }
    };
    return configs[variant];
  };

  // Initialize particles
  const initializeParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = getParticleConfig();
    const particles: Particle[] = [];

    for (let i = 0; i < config.count; i++) {
      particles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (config.size.max - config.size.min) + config.size.min,
        speedX: (Math.random() - 0.5) * config.speed,
        speedY: (Math.random() - 0.5) * config.speed,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        opacity: Math.random() * 0.6 + 0.2,
        life: 0,
        maxLife: Math.random() * 1000 + 500
      });
    }

    particlesRef.current = particles;
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life++;

      // Wrap around screen edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Update opacity based on life
      const lifeRatio = particle.life / particle.maxLife;
      particle.opacity = 0.8 * (1 - lifeRatio);

      // Regenerate particle if it's expired
      if (particle.life >= particle.maxLife) {
        const config = getParticleConfig();
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.life = 0;
        particle.maxLife = Math.random() * 1000 + 500;
        particle.color = config.colors[Math.floor(Math.random() * config.colors.length)];
      }

      // Draw particle
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw connections between nearby particles
    if (intensity !== 'low') {
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.5;

      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
      ctx.restore();
    }

    if (isAnimating) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  // Handle window resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeParticles();
  };

  // Background gradient based on variant
  const getBackgroundGradient = () => {
    const gradients = {
      menu: 'from-slate-900 via-purple-900 to-slate-900',
      battle: 'from-red-950 via-orange-950 to-red-950',
      collection: 'from-emerald-950 via-green-950 to-emerald-950',
      mystical: 'from-violet-950 via-purple-950 to-indigo-950'
    };
    return gradients[variant];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles and start animation
    initializeParticles();
    animate();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, intensity]);

  useEffect(() => {
    setIsAnimating(true);
    return () => setIsAnimating(false);
  }, []);

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${getBackgroundGradient()}`}>
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ background: 'transparent' }}
      />

      {/* Subtle Overlay Patterns */}
      <div className="fixed inset-0 pointer-events-none z-1">
        {/* Moving Gradients */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 20% 80%, ${
              variant === 'menu' ? '#3b82f6' : 
              variant === 'battle' ? '#ef4444' : 
              variant === 'collection' ? '#10b981' : '#a855f7'
            }30 0%, transparent 50%)`
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 80% 20%, ${
              variant === 'menu' ? '#8b5cf6' : 
              variant === 'battle' ? '#f97316' : 
              variant === 'collection' ? '#059669' : '#c084fc'
            }30 0%, transparent 50%)`
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating Orbs */}
      <AnimatePresence>
        {Array.from({ length: intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8 }).map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className={`absolute rounded-full blur-xl opacity-30 pointer-events-none ${
              variant === 'menu' ? 'bg-blue-500' : 
              variant === 'battle' ? 'bg-red-500' : 
              variant === 'collection' ? 'bg-green-500' : 'bg-purple-500'
            }`}
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};