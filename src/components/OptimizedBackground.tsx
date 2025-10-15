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

  // Background gradient memoization
  const backgroundGradient = useMemo(() => {
    const gradients = {
      menu: 'from-slate-900 via-purple-900 to-slate-900',
      battle: 'from-red-950 via-orange-950 to-red-950',
      collection: 'from-emerald-950 via-green-950 to-emerald-950',
      mystical: 'from-violet-950 via-purple-950 to-indigo-950'
    };
    return gradients[variant];
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
      {/* Optimized Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ background: 'transparent' }}
      />

      {/* Simplified Overlay - No heavy animations */}
      <div className="fixed inset-0 pointer-events-none z-1 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 70%, ${
              variant === 'menu' ? '#3b82f650' : 
              variant === 'battle' ? '#ef444450' : 
              variant === 'collection' ? '#10b98150' : '#a855f750'
            } 0%, transparent 60%)`
          }}
        />
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