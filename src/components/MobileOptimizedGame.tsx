import { useState, useEffect } from 'react';
import { Game } from './Game';
import { NetworkStatusIndicator } from './NetworkStatusIndicator';
import { cn } from '@/lib/utils';

interface MobileOptimizedGameProps {
  children: React.ReactNode;
}

export function MobileOptimizedGame({ children }: MobileOptimizedGameProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    // Check if app is installed (PWA)
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isAppInstalled);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Initial check
    handleOrientationChange();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    <div className={cn(
      'min-h-screen w-full bg-background',
      'mobile-smooth-scroll gpu-accelerated',
      orientation === 'landscape' && 'landscape-mode',
      !isOnline && 'offline-mode'
    )}>
      {/* Network Status */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-destructive/90 text-destructive-foreground p-2 text-center text-sm">
          ⚠️ You're offline. Some features may be limited.
        </div>
      )}

      {/* Main Game Content */}
      <div className={cn(
        'relative z-10',
        !isOnline && 'mt-10'
      )}>
        {children}
      </div>

      {/* Network Status Indicator */}
      <NetworkStatusIndicator />

      {/* Install Prompt for PWA */}
      {!isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 z-40 bg-card/90 backdrop-blur-sm border rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>Install Card Clash for the best experience!</span>
          </div>
        </div>
      )}
    </div>
  );
}