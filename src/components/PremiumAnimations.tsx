import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ParticleSystemProps {
  type: 'magic' | 'energy' | 'sparkles' | 'combat';
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  className?: string;
}

export function ParticleSystem({ type, intensity = 'medium', color, className }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }> = [];

    const particleCount = {
      low: 10,
      medium: 25,
      high: 50
    }[intensity];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random() * 100,
        maxLife: 100,
        size: Math.random() * 3 + 1
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Reset particle if it dies or goes off screen
        if (particle.life <= 0 || particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = particle.maxLife;
        }

        // Draw particle
        const alpha = particle.life / particle.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        
        if (type === 'magic') {
          ctx.fillStyle = color || '#8B5CF6';
          ctx.shadowBlur = 10;
          ctx.shadowColor = color || '#8B5CF6';
        } else if (type === 'energy') {
          ctx.fillStyle = color || '#3B82F6';
          ctx.shadowBlur = 8;
          ctx.shadowColor = color || '#3B82F6';
        } else if (type === 'sparkles') {
          ctx.fillStyle = color || '#F59E0B';
          ctx.shadowBlur = 6;
          ctx.shadowColor = color || '#F59E0B';
        } else if (type === 'combat') {
          ctx.fillStyle = color || '#EF4444';
          ctx.shadowBlur = 12;
          ctx.shadowColor = color || '#EF4444';
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [type, intensity, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ zIndex: 1 }}
    />
  );
}

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function AnimatedButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className,
  disabled = false 
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (disabled) return;
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Ripple effect
    const button = buttonRef.current;
    if (button) {
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = rect.width / 2 - size / 2;
      const y = rect.height / 2 - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple-effect');

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    onClick?.();
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80',
    secondary: 'bg-gradient-to-r from-secondary to-accent hover:from-secondary/80 hover:to-accent/80',
    premium: 'bg-gradient-to-r from-accent via-primary to-secondary hover:shadow-2xl hover:shadow-primary/50'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'relative overflow-hidden rounded-lg font-semibold text-white',
        'transform transition-all duration-200 ease-out',
        'hover:scale-105 hover:-translate-y-1',
        'active:scale-95 active:translate-y-0',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  intensity?: 'subtle' | 'normal' | 'strong';
  className?: string;
}

export function FloatingElement({ children, intensity = 'normal', className }: FloatingElementProps) {
  const intensityValues = {
    subtle: '2px',
    normal: '6px',
    strong: '12px'
  };

  return (
    <div
      className={cn('animate-float', className)}
      style={{
        '--float-distance': intensityValues[intensity],
        animation: `float 3s ease-in-out infinite`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

// CSS for ripple effect
const rippleStyles = `
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(var(--float-distance, -6px));
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = rippleStyles;
  document.head.appendChild(styleSheet);
}