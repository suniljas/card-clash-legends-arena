import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const lorButtonVariants = cva(
  // Base LOR-style button with premium gaming aesthetics
  "relative inline-flex items-center justify-center whitespace-nowrap font-bold text-sm tracking-wide uppercase transition-all duration-300 overflow-hidden group disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary golden/bronze LOR style
        primary: [
          "bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600",
          "text-amber-900 shadow-lg shadow-amber-500/25",
          "border-2 border-amber-300",
          "hover:from-amber-300 hover:via-yellow-400 hover:to-amber-500",
          "hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105",
          "active:scale-95 active:shadow-md",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full before:transition-transform before:duration-700 hover:before:translate-x-full"
        ],
        // Secondary blue/mystical LOR style
        secondary: [
          "bg-gradient-to-b from-blue-500 via-cyan-600 to-blue-700",
          "text-white shadow-lg shadow-blue-500/25",
          "border-2 border-cyan-300",
          "hover:from-blue-400 hover:via-cyan-500 hover:to-blue-600",
          "hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105",
          "active:scale-95 active:shadow-md",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full before:transition-transform before:duration-700 hover:before:translate-x-full"
        ],
        // Destructive red/fire LOR style
        destructive: [
          "bg-gradient-to-b from-red-500 via-orange-600 to-red-700",
          "text-white shadow-lg shadow-red-500/25",
          "border-2 border-orange-300",
          "hover:from-red-400 hover:via-orange-500 hover:to-red-600",
          "hover:shadow-xl hover:shadow-red-500/40 hover:scale-105",
          "active:scale-95 active:shadow-md",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full before:transition-transform before:duration-700 hover:before:translate-x-full"
        ],
        // Dark/shadow LOR style for ghost variant
        ghost: [
          "bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900",
          "text-slate-200 border-2 border-slate-600",
          "hover:from-slate-600 hover:via-slate-700 hover:to-slate-800",
          "hover:text-white hover:border-slate-500 hover:scale-105",
          "active:scale-95",
          "shadow-md shadow-slate-900/25 hover:shadow-lg hover:shadow-slate-900/40"
        ],
        // Outline variant with LOR styling
        outline: [
          "bg-transparent border-2 border-amber-400",
          "text-amber-400 hover:bg-amber-400 hover:text-amber-900",
          "hover:shadow-lg hover:shadow-amber-500/25 hover:scale-105",
          "active:scale-95",
          "transition-all duration-300"
        ],
        // Premium legendary variant
        legendary: [
          "bg-gradient-to-b from-purple-400 via-pink-500 to-purple-600",
          "text-white shadow-lg shadow-purple-500/25",
          "border-2 border-pink-300",
          "hover:from-purple-300 hover:via-pink-400 hover:to-purple-500",
          "hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105",
          "active:scale-95 active:shadow-md",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:-translate-x-full before:transition-transform before:duration-700 hover:before:translate-x-full",
          "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-pink-300/20 after:to-transparent after:animate-pulse"
        ]
      },
      size: {
        sm: "h-8 px-3 py-1 text-xs rounded-md",
        default: "h-10 px-4 py-2 text-sm rounded-lg",
        lg: "h-12 px-6 py-3 text-base rounded-lg",
        xl: "h-14 px-8 py-4 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-lg"
      },
      corners: {
        default: "",
        sharp: "rounded-none",
        rounded: "rounded-xl",
        pill: "rounded-full"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      corners: "default"
    },
  }
);

export interface LORButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof lorButtonVariants> {
  asChild?: boolean;
  glowing?: boolean;
}

const LORButton = forwardRef<HTMLButtonElement, LORButtonProps>(
  ({ className, variant, size, corners, glowing = false, children, onClick, ...props }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Add haptic feedback for mobile
      if ('vibrate' in navigator && variant !== 'ghost') {
        navigator.vibrate(30);
      }
      
      onClick?.(event);
    };

    return (
      <button
        className={cn(
          lorButtonVariants({ variant, size, corners }),
          glowing && "animate-pulse",
          className
        )}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        
        {/* Corner decorative elements for premium feel */}
        {variant === 'legendary' && (
          <>
            <div className="absolute top-0 left-0 w-2 h-2 bg-pink-300 rounded-full opacity-60" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-pink-300 rounded-full opacity-60" />
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-pink-300 rounded-full opacity-60" />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-pink-300 rounded-full opacity-60" />
          </>
        )}
      </button>
    );
  }
);

LORButton.displayName = "LORButton";

export { LORButton, lorButtonVariants };