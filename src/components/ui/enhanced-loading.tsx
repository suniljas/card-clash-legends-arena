import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2, Sparkles, Zap, Star } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'cards' | 'battle' | 'premium' | 'dots';
  className?: string;
  text?: string;
  showText?: boolean;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  className,
  text,
  showText = true
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Default spinner
  if (variant === 'default') {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={cn(sizeClasses[size], "text-blue-500")}
        >
          <Loader2 className="w-full h-full" />
        </motion.div>
        {showText && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={cn(textSizeClasses[size], "text-slate-400 font-medium")}
          >
            {text || "Loading..."}
          </motion.p>
        )}
      </div>
    );
  }

  // Card-themed spinner
  if (variant === 'cards') {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className="relative">
          {/* Rotating cards */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={cn(
                "absolute bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg",
                size === 'sm' && "w-8 h-12",
                size === 'md' && "w-12 h-16",
                size === 'lg' && "w-16 h-20",
                size === 'xl' && "w-20 h-28"
              )}
              style={{
                transformOrigin: 'center bottom',
              }}
              animate={{
                rotate: [0, 120, 240, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded border border-blue-400/30">
                <Sparkles className="w-4 h-4 text-blue-400 absolute top-1 left-1" />
              </div>
            </motion.div>
          ))}
        </div>
        {showText && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={cn(textSizeClasses[size], "text-slate-400 font-medium mt-8")}
          >
            {text || "Loading cards..."}
          </motion.p>
        )}
      </div>
    );
  }

  // Battle-themed spinner
  if (variant === 'battle') {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className="relative">
          {/* Crossed swords animation */}
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={cn(sizeClasses[size])}
          >
            <Zap className="w-full h-full text-amber-500" />
          </motion.div>
          
          {/* Pulsing energy rings */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="absolute inset-0 border-2 border-amber-500/30 rounded-full"
              animate={{
                scale: [1, 2, 1],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            />
          ))}
        </div>
        {showText && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={cn(textSizeClasses[size], "text-slate-400 font-medium")}
          >
            {text || "Preparing battle..."}
          </motion.p>
        )}
      </div>
    );
  }

  // Premium spinner with particle effects
  if (variant === 'premium') {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className="relative">
          {/* Central star */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className={cn(sizeClasses[size], "text-yellow-500")}
          >
            <Star className="w-full h-full" />
          </motion.div>
          
          {/* Orbiting particles */}
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: `${size === 'sm' ? '16px' : size === 'md' ? '24px' : size === 'lg' ? '32px' : '48px'} 0px`,
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
        {showText && (
          <motion.p
            animate={{ 
              opacity: [0.5, 1, 0.5],
              backgroundPosition: ["0%", "100%", "0%"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn(
              textSizeClasses[size], 
              "font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent bg-[length:200%_100%]"
            )}
          >
            {text || "Loading premium content..."}
          </motion.p>
        )}
      </div>
    );
  }

  // Dots spinner
  if (variant === 'dots') {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className={cn(
                "rounded-full bg-gradient-to-r from-blue-500 to-purple-500",
                size === 'sm' && "w-2 h-2",
                size === 'md' && "w-3 h-3",
                size === 'lg' && "w-4 h-4",
                size === 'xl' && "w-6 h-6"
              )}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        {showText && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={cn(textSizeClasses[size], "text-slate-400 font-medium")}
          >
            {text || "Loading..."}
          </motion.p>
        )}
      </div>
    );
  }

  return null;
}

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  variant?: LoadingSpinnerProps['variant'];
  text?: string;
  className?: string;
  blur?: boolean;
}

export function LoadingOverlay({ 
  isLoading, 
  variant = 'premium', 
  text, 
  className,
  blur = true 
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/50",
        blur && "backdrop-blur-sm",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/90 backdrop-blur-md border border-slate-600 rounded-xl p-8 shadow-2xl"
      >
        <LoadingSpinner variant={variant} size="lg" text={text} />
      </motion.div>
    </motion.div>
  );
}