// Enhanced Button Component
// Foundation component with comprehensive interaction states and animations

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  // Base styles with enhanced animations and interactions
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
  {
    variants: {
      variant: {
        default: [
          'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground',
          'hover:from-primary/90 hover:to-primary/80 hover:shadow-lg hover:scale-[1.02]',
          'active:scale-[0.98] active:shadow-md',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100',
        ],
        destructive: [
          'bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground',
          'hover:from-destructive/90 hover:to-destructive/80 hover:shadow-lg hover:scale-[1.02]',
          'active:scale-[0.98] active:shadow-md',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100',
        ],
        outline: [
          'border border-input bg-background/50 backdrop-blur-sm',
          'hover:bg-accent hover:text-accent-foreground hover:border-accent/50 hover:shadow-md hover:scale-[1.02]',
          'active:scale-[0.98]',
        ],
        secondary: [
          'bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground',
          'hover:from-secondary/90 hover:to-secondary/80 hover:shadow-md hover:scale-[1.02]',
          'active:scale-[0.98]',
        ],
        ghost: [
          'hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]',
          'active:scale-[0.98]',
        ],
        link: 'text-primary underline-offset-4 hover:underline hover:scale-[1.02] active:scale-[0.98]',
        
        // Game-specific variants
        legendary: [
          'bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-white font-semibold',
          'hover:from-orange-400 hover:via-yellow-400 hover:to-orange-400 hover:shadow-legendary hover:scale-[1.05]',
          'active:scale-[0.95]',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/30 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100',
          'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:translate-x-[-100%] after:transition-transform after:duration-700 hover:after:translate-x-[100%]',
        ],
        epic: [
          'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
          'hover:from-purple-500 hover:to-indigo-500 hover:shadow-epic hover:scale-[1.02]',
          'active:scale-[0.98]',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100',
        ],
        magical: [
          'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white',
          'hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 hover:shadow-magical hover:scale-[1.02]',
          'active:scale-[0.98]',
          'animate-shimmer bg-[length:200%_100%]',
        ],
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
      loading: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer',
      },
      glow: {
        true: 'shadow-glow',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      loading: false,
      glow: false,
    },
  }
);

// Animation variants for framer-motion
const buttonAnimations = {
  tap: { scale: 0.98 },
  hover: { scale: 1.02 },
  loading: {
    opacity: [1, 0.7, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'size'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glow?: boolean;
  ripple?: boolean;
  haptic?: boolean; // For mobile haptic feedback
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    loadingText,
    icon,
    rightIcon,
    glow = false,
    ripple = true,
    haptic = false,
    children,
    disabled,
    onClick,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : motion.button;
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Haptic feedback for mobile devices
      if (haptic && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      // Ripple effect
      if (ripple && !loading && !disabled) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const rippleElement = document.createElement('span');
        rippleElement.className = 'absolute rounded-full bg-white/30 pointer-events-none animate-ping';
        rippleElement.style.left = `${x}px`;
        rippleElement.style.top = `${y}px`;
        rippleElement.style.width = '20px';
        rippleElement.style.height = '20px';
        rippleElement.style.transform = 'translate(-50%, -50%)';
        
        button.appendChild(rippleElement);
        
        setTimeout(() => {
          button.removeChild(rippleElement);
        }, 600);
      }
      
      if (!loading && !disabled && onClick) {
        onClick(event);
      }
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, glow, className }))}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        whileTap={!disabled && !loading ? buttonAnimations.tap : undefined}
        whileHover={!disabled && !loading ? buttonAnimations.hover : undefined}
        animate={loading ? buttonAnimations.loading : undefined}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {!loading && icon && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span className="flex-1">
          {loading ? (loadingText || 'Loading...') : children}
        </span>
        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };