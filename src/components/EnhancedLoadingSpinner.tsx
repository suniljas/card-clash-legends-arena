import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const spinnerVariants = cva(
  "animate-spin rounded-full border-solid border-current border-r-transparent",
  {
    variants: {
      size: {
        sm: "w-4 h-4 border-2",
        default: "w-6 h-6 border-2", 
        lg: "w-8 h-8 border-2",
        xl: "w-12 h-12 border-3",
      },
      variant: {
        default: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted-foreground",
        card: "text-accent",
        destructive: "text-destructive",
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    }
  }
);

interface EnhancedLoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  text?: string;
  progress?: number;
  showProgress?: boolean;
}

export function EnhancedLoadingSpinner({ 
  className, 
  size, 
  variant, 
  text,
  progress,
  showProgress = false
}: EnhancedLoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Progress ring if progress is provided */}
      {showProgress && progress !== undefined ? (
        <div className="relative">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-muted-foreground/20"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
              className="text-primary transition-all duration-300 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
        </div>
      ) : (
        <div className={cn(spinnerVariants({ size, variant }), className)} />
      )}
      
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}