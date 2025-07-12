import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const androidButtonVariants = cva(
  // Base styles optimized for Android
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline active:no-underline",
        premium: "btn-premium text-primary-foreground",
      },
      size: {
        default: "h-12 px-6 py-3 text-base", // Larger for touch
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg", // Extra large for primary actions
        icon: "h-12 w-12", // Minimum 48x48 touch target
        "icon-sm": "h-10 w-10",
        "icon-lg": "h-14 w-14",
      },
      ripple: {
        true: "before:absolute before:inset-0 before:bg-white before:opacity-0 before:scale-0 before:rounded-full before:transition-all before:duration-300 active:before:scale-100 active:before:opacity-20",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      ripple: true,
    },
  }
);

export interface AndroidButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof androidButtonVariants> {
  asChild?: boolean;
}

const AndroidOptimizedButton = forwardRef<HTMLButtonElement, AndroidButtonProps>(
  ({ className, variant, size, ripple = true, children, onClick, ...props }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Add haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50); // Light haptic feedback
      }
      
      // Call original onClick
      onClick?.(event);
    };

    return (
      <button
        className={cn(androidButtonVariants({ variant, size, ripple, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AndroidOptimizedButton.displayName = "AndroidOptimizedButton";

export { AndroidOptimizedButton, androidButtonVariants };