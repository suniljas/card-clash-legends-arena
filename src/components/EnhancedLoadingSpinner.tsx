import { cn } from '@/lib/utils';

interface EnhancedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  variant?: 'default' | 'card' | 'overlay';
  progress?: number; // 0-100 for progress indication
}

export function EnhancedLoadingSpinner({ 
  size = 'md', 
  className, 
  text,
  variant = 'default',
  progress
}: EnhancedLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerClasses = {
    default: 'flex flex-col items-center justify-center gap-3',
    card: 'flex flex-col items-center justify-center gap-3 p-8 rounded-lg bg-card border',
    overlay: 'fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm'
  };

  return (
    <div className={cn(containerClasses[variant], className)}>
      {/* Spinner */}
      <div className="relative">
        <div className={cn(
          'animate-spin rounded-full border-2 border-border border-t-primary',
          sizeClasses[size]
        )} />
        
        {/* Progress ring overlay */}
        {progress !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className={cn(sizeClasses[size])} 
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${progress * 0.628} 62.8`} // 62.8 = 2π * 10
                transform="rotate(-90 12 12)"
                className="transition-all duration-300"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Loading text */}
      {text && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground animate-pulse">
            {text}
          </p>
          {progress !== undefined && (
            <p className="text-xs text-muted-foreground/70 mt-1">
              {Math.round(progress)}%
            </p>
          )}
        </div>
      )}

      {/* Loading dots animation */}
      {!text && (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}