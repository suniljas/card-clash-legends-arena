// Enhanced Card Component
// Foundation component with premium styling and animation support

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 relative overflow-hidden group',
  {
    variants: {
      variant: {
        default: 'border-border bg-card/50 backdrop-blur-sm',
        elevated: 'border-border/50 bg-card shadow-lg hover:shadow-xl',
        premium: [
          'border-gradient-to-r border-primary/30 bg-gradient-to-br from-card to-card/80',
          'shadow-lg hover:shadow-xl hover:shadow-primary/20',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100',
        ],
        glass: [
          'border-white/20 bg-white/10 backdrop-blur-md',
          'shadow-2xl hover:shadow-3xl',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent',
        ],
        
        // Game-specific variants
        legendary: [
          'border-gradient-to-r from-orange-500/50 to-yellow-500/50',
          'bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20',
          'shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30',
          'before:absolute before:inset-0 before:bg-gradient-legendary before:opacity-5 before:transition-opacity hover:before:opacity-10',
          'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:translate-x-[-100%] after:transition-transform after:duration-1000 hover:after:translate-x-[100%]',
        ],
        epic: [
          'border-gradient-to-r from-purple-500/50 to-indigo-500/50',
          'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20',
          'shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/5 before:to-indigo-500/5 before:opacity-0 before:transition-opacity hover:before:opacity-100',
        ],
        rare: [
          'border-gradient-to-r from-blue-500/50 to-cyan-500/50',
          'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
          'shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30',
        ],
        holographic: [
          'border-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50',
          'bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 dark:from-cyan-950/20 dark:via-purple-950/20 dark:to-pink-950/20',
          'shadow-xl shadow-purple-500/25',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-500/10 before:via-purple-500/10 before:to-pink-500/10 before:animate-holographic-shine',
        ],
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      interactive: {
        true: [
          'cursor-pointer',
          'hover:scale-[1.02] hover:-translate-y-1',
          'active:scale-[0.98] active:translate-y-0',
          'transition-transform duration-200',
        ],
        false: '',
      },
      glow: {
        true: 'shadow-glow animate-pulse-glow',
        false: '',
      },
      tilt: {
        true: 'transform-gpu preserve-3d hover:animate-card-tilt',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
      glow: false,
      tilt: false,
    },
  }
);

// Animation variants for framer-motion
const cardAnimations = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
  hover: {
    y: -4,
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
  
  // Game-specific animations
  reveal: {
    rotateY: [180, 0],
    scale: [0.8, 1.1, 1],
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      times: [0, 0.6, 1],
    },
  },
  float: {
    y: [-2, 2, -2],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  shimmer: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export interface CardProps
  extends Omit<HTMLMotionProps<'div'>, 'size'>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  interactive?: boolean;
  glow?: boolean;
  tilt?: boolean;
  reveal?: boolean;
  float?: boolean;
  shimmer?: boolean;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legend' | 'ultra-legend';
  onCardClick?: () => void;
  onCardHover?: () => void;
  haptic?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant,
    size,
    interactive = false,
    glow = false,
    tilt = false,
    reveal = false,
    float = false,
    shimmer = false,
    rarity,
    onCardClick,
    onCardHover,
    haptic = false,
    children,
    ...props
  }, ref) => {
    
    // Determine variant based on rarity if provided
    const effectiveVariant = rarity 
      ? (['legendary', 'epic', 'rare'].includes(rarity) ? rarity : variant)
      : variant;

    const handleClick = () => {
      if (haptic && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onCardClick?.();
    };

    const handleHover = () => {
      onCardHover?.();
    };

    // Combine animation states
    let animationState = {};
    if (reveal) animationState = { ...animationState, ...cardAnimations.reveal };
    if (float) animationState = { ...animationState, animate: cardAnimations.float };
    if (shimmer) animationState = { ...animationState, animate: cardAnimations.shimmer };

    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ 
          variant: effectiveVariant, 
          size, 
          interactive, 
          glow, 
          tilt, 
          className 
        }))}
        initial={cardAnimations.initial}
        animate={cardAnimations.animate}
        exit={cardAnimations.exit}
        whileHover={interactive ? cardAnimations.hover : undefined}
        whileTap={interactive ? cardAnimations.tap : undefined}
        onClick={interactive ? handleClick : undefined}
        onHoverStart={interactive ? handleHover : undefined}
        {...animationState}
        {...props}
      >
        {/* Rarity indicator */}
        {rarity && (
          <div className={cn(
            'absolute top-2 right-2 w-2 h-2 rounded-full',
            {
              'bg-gray-400': rarity === 'common',
              'bg-green-500': rarity === 'uncommon',
              'bg-blue-500': rarity === 'rare',
              'bg-purple-500': rarity === 'epic',
              'bg-orange-500': rarity === 'legend',
              'bg-red-500': rarity === 'ultra-legend',
            }
          )} />
        )}
        
        {/* Holographic overlay */}
        {(variant === 'holographic' || shimmer) && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Card content components
const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight font-fantasy',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  cardVariants 
};
export type { CardProps };