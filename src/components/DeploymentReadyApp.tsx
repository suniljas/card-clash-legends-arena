import { useState, useEffect } from 'react';
import { Game } from './Game';
import { MobileOptimizedGame } from './MobileOptimizedGame';
import { ErrorBoundary } from './ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

export function DeploymentReadyApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [appVersion] = useState('1.0.0');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate app initialization
    const initializeApp = async () => {
      try {
        // Pre-load critical assets
        await preloadAssets();
        
        // Initialize analytics
        console.log('App initialized successfully');
        
        // Show welcome message for new installs
        const isFirstLaunch = !localStorage.getItem('app-launched');
        if (isFirstLaunch) {
          localStorage.setItem('app-launched', 'true');
          toast({
            title: "Welcome to Card Clash!",
            description: "Experience the legendary card battles!",
            duration: 3000,
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [toast]);

  const preloadAssets = async () => {
    // Preload critical images and sounds
    const criticalAssets = [
      '/sounds/card-play.mp3',
      '/sounds/victory.mp3',
      '/sounds/legendary-drop.mp3'
    ];

    await Promise.allSettled(
      criticalAssets.map(asset => {
        return new Promise((resolve) => {
          if (asset.endsWith('.mp3')) {
            const audio = new Audio(asset);
            audio.addEventListener('canplaythrough', resolve);
            audio.load();
          } else {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve; // Don't fail on missing images
            img.src = asset;
          }
        });
      })
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <h1 className="text-2xl font-bold text-primary">Card Clash</h1>
          <p className="text-muted-foreground">Loading your legendary adventure...</p>
          <div className="text-xs text-muted-foreground">v{appVersion}</div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <MobileOptimizedGame>
        <Game />
        <Toaster />
      </MobileOptimizedGame>
    </ErrorBoundary>
  );
}