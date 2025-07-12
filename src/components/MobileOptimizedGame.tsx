import { ReactNode, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MobileOptimizedGameProps {
  children: ReactNode;
}

export function MobileOptimizedGame({ children }: MobileOptimizedGameProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('high');
  const { toast } = useToast();

  useEffect(() => {
    // Monitor network status
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection Restored",
        description: "You're back online!",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connection Lost",
        description: "Some features may be limited",
        duration: 5000,
      });
    };

    // Monitor performance
    const checkPerformance = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          setPerformanceMode('low');
        } else if (connection.effectiveType === '3g') {
          setPerformanceMode('medium');
        } else {
          setPerformanceMode('high');
        }
      }
    };

    // Monitor memory usage
    const checkMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const totalMB = memory.totalJSHeapSize / 1024 / 1024;
        
        if (usedMB / totalMB > 0.8) {
          toast({
            title: "Performance Warning",
            description: "High memory usage detected",
            duration: 3000,
          });
        }
      }
    };

    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial checks
    checkPerformance();
    checkMemoryUsage();

    // Periodic performance monitoring
    const performanceInterval = setInterval(checkMemoryUsage, 30000);

    // Prevent zoom on double tap (mobile optimization)
    let lastTouchEnd = 0;
    const preventZoom = (event: TouchEvent) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', preventZoom, false);

    // Optimize for mobile battery life
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause animations and heavy operations when app is in background
        document.body.classList.add('app-background');
      } else {
        document.body.classList.remove('app-background');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('touchend', preventZoom);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(performanceInterval);
    };
  }, [toast]);

  // Apply performance-based optimizations
  useEffect(() => {
    const root = document.documentElement;
    
    if (performanceMode === 'low') {
      root.style.setProperty('--animation-duration', '0.1s');
      root.style.setProperty('--transition-duration', '0.1s');
      document.body.classList.add('performance-low');
    } else if (performanceMode === 'medium') {
      root.style.setProperty('--animation-duration', '0.2s');
      root.style.setProperty('--transition-duration', '0.2s');
      document.body.classList.add('performance-medium');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
      root.style.setProperty('--transition-duration', '0.3s');
      document.body.classList.remove('performance-low', 'performance-medium');
    }
  }, [performanceMode]);

  return (
    <div 
      className={`
        mobile-optimized-game
        ${!isOnline ? 'offline-mode' : ''}
        ${performanceMode === 'low' ? 'performance-low' : ''}
        ${performanceMode === 'medium' ? 'performance-medium' : ''}
      `}
      style={{
        // Mobile-specific optimizations
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        touchAction: 'manipulation',
      }}
    >
      {/* Performance indicator (hidden in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-2 right-2 z-50 bg-black/80 text-white px-2 py-1 rounded text-xs">
          {performanceMode} | {isOnline ? 'Online' : 'Offline'}
        </div>
      )}

      {children}
    </div>
  );
}