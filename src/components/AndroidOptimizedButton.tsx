import { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AndroidOptimizedButtonProps extends ButtonProps {
  hapticFeedback?: boolean;
}

export const AndroidOptimizedButton = forwardRef<
  HTMLButtonElement,
  AndroidOptimizedButtonProps
>(({ className, hapticFeedback = true, children, onClick, ...props }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add haptic feedback for Android
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10); // Very short vibration
    }
    
    onClick?.(e);
  };

  return (
    <Button
      ref={ref}
      className={cn(
        "touch-target transition-smooth active:scale-95 select-none",
        "shadow-lg hover:shadow-xl active:shadow-md",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
});

AndroidOptimizedButton.displayName = "AndroidOptimizedButton";