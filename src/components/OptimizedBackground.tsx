import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface OptimizedBackgroundProps {
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
}

export const OptimizedBackground: React.FC<OptimizedBackgroundProps> = ({
  children,
  variant = 'menu',
  intensity = 'low' // Default to low for better performance
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const lastFrameTime = useRef(0);
  const FPS_LIMIT = 30; // Limit to 30 FPS for better performance

  // Memoized particle configuration to prevent recalculation
  const particleConfig = useMemo(() => {
    const configs = {
      menu: {
        count: intensity === 'low' ? 10 : intensity === 'medium' ? 20 : 30,
        colors: ['#3b82f6', '#8b5cf6'],
        speed: 0.3,
        size: { min: 1, max: 2 }
      },
      battle: {
        count: intensity === 'low' ? 15 : intensity === 'medium' ? 25 : 35,
        colors: ['#ef4444', '#f97316'],
        speed: 0.5,
        size: { min: 1, max: 3 }
      },
      collection: {
        count: intensity === 'low' ? 8 : intensity === 'medium' ? 15 : 25,
        colors: ['#10b981', '#059669'],
        speed: 0.2,
        size: { min: 1, max: 2 }
      },
      mystical: {
        count: intensity === 'low' ? 12 : intensity === 'medium' ? 20 : 30,
        colors: ['#a855f7', '#c084fc'],
        speed: 0.4,
        size: { min: 1, max: 3 }
      }
    };
    return configs[variant];
  }, [variant, intensity]);

  // Initialize particles with memoization
  const initializeParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: Particle[] = [];
    for (let i = 0; i < particleConfig.count; i++) {
      particles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (particleConfig.size.max - particleConfig.size.min) + particleConfig.size.min,
        speedX: (Math.random() - 0.5) * particleConfig.speed,
        speedY: (Math.random() - 0.5) * particleConfig.speed,
        color: particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)],
        opacity: Math.random() * 0.4 + 0.1
      });
    }
    particlesRef.current = particles;
  }, [particleConfig]);

  // Optimized animation loop with FPS limiting
  const animate = useCallback((currentTime: number) => {
    if (currentTime - lastFrameTime.current < 1000 / FPS_LIMIT) {
      if (isVisible) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
      return;
    }
    lastFrameTime.current = currentTime;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !isVisible) return;

    // Clear canvas efficiently
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around screen edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Draw particle (simplified rendering)
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (isVisible) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isVisible]);

  // Intersection Observer to pause animation when not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = canvasRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Handle window resize with debouncing
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeParticles();
  }, [initializeParticles]);

  // Enhanced background gradient memoization with LoR-inspired premium colors
  const backgroundGradient = useMemo(() => {
    const gradients = {
      menu: 'from-slate-950 via-blue-950 via-purple-950 to-slate-950',
      battle: 'from-red-950 via-orange-950 via-yellow-950 to-red-950',
      collection: 'from-emerald-950 via-teal-950 via-cyan-950 to-emerald-950',
      mystical: 'from-violet-950 via-purple-950 via-indigo-950 to-violet-950'
    };
    return gradients[variant];
  }, [variant]);

  // Enhanced overlay gradient for mystical fog effect
  const overlayGradient = useMemo(() => {
    const overlays = {
      menu: 'radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)',
      battle: 'radial-gradient(ellipse at 40% 30%, rgba(239, 68, 68, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 60% 70%, rgba(249, 115, 22, 0.12) 0%, transparent 50%)',
      collection: 'radial-gradient(ellipse at 20% 40%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 60%, rgba(5, 150, 105, 0.12) 0%, transparent 50%)',
      mystical: 'radial-gradient(ellipse at 35% 25%, rgba(168, 85, 247, 0.18) 0%, transparent 50%), radial-gradient(ellipse at 65% 75%, rgba(192, 132, 252, 0.15) 0%, transparent 50%)'
    };
    return overlays[variant];
  }, [variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    initializeParticles();
    animationFrameRef.current = requestAnimationFrame(animate);

    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener('resize', debouncedResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', debouncedResize);
    };
  }, [animate, handleResize, initializeParticles]);

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${backgroundGradient}`}>
      {/* Optimized Background Canvas for magical particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ background: 'transparent' }}
      />

      {/* Enhanced Mystical Fog Overlay with layered effects */}
      <div className="fixed inset-0 pointer-events-none z-1">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: overlayGradient
          }}
        />
        {/* Animated fog layer */}
        <div 
          className="absolute inset-0 opacity-20 animate-pulse"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, 
              transparent 0deg, 
              ${variant === 'menu' ? 'rgba(59, 130, 246, 0.1)' : 
                variant === 'battle' ? 'rgba(239, 68, 68, 0.1)' : 
                variant === 'collection' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(168, 85, 247, 0.1)'} 90deg, 
              transparent 180deg, 
              ${variant === 'menu' ? 'rgba(139, 92, 246, 0.08)' : 
                variant === 'battle' ? 'rgba(249, 115, 22, 0.08)' : 
                variant === 'collection' ? 'rgba(5, 150, 105, 0.08)' : 'rgba(192, 132, 252, 0.08)'} 270deg, 
              transparent 360deg)`
          }}
        />
        {/* Subtle shimmer effect for premium feel */}
        <div className="absolute inset-0 opacity-5 animate-shimmer"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.3) 50%, transparent 70%)',
            backgroundSize: '200% 200%'
          }}
        />
      </div>

      {/* Premium glow effects for depth */}
      <div className="fixed inset-0 pointer-events-none z-2">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-900/10 to-transparent opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-900/10 to-transparent opacity-60" />
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-indigo-900/5 to-transparent opacity-40" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-violet-900/5 to-transparent opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}