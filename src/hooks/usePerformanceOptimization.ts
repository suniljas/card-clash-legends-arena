import { useCallback, useEffect, useMemo, useState } from 'react';

interface PerformanceConfig {
  enableAnimations: boolean;
  maxParticles: number;
  cardQuality: 'low' | 'medium' | 'high';
  enableShadows: boolean;
  enableBlur: boolean;
}

export function usePerformanceOptimization() {
  const [config, setConfig] = useState<PerformanceConfig>(() => {
    // Default settings based on device capabilities
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const hasLowRAM = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    const isLowEnd = isMobile || hasLowRAM;

    return {
      enableAnimations: !isLowEnd,
      maxParticles: isLowEnd ? 10 : 50,
      cardQuality: isLowEnd ? 'medium' : 'high',
      enableShadows: !isLowEnd,
      enableBlur: !isLowEnd
    };
  });

  // Monitor performance and auto-adjust
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let lowFPSCount = 0;

    const checkPerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = (frameCount * 1000) / (currentTime - lastTime);
        
        if (fps < 30) {
          lowFPSCount++;
          
          // Auto-reduce quality after 3 seconds of low FPS
          if (lowFPSCount >= 3) {
            setConfig(prev => ({
              ...prev,
              enableAnimations: false,
              maxParticles: Math.max(5, prev.maxParticles - 10),
              cardQuality: prev.cardQuality === 'high' ? 'medium' : 'low',
              enableShadows: false,
              enableBlur: false
            }));
            lowFPSCount = 0;
          }
        } else {
          lowFPSCount = 0;
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(checkPerformance);
    };

    const animationId = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Memoized performance optimizations
  const shouldRenderParticles = useMemo(() => 
    config.enableAnimations && config.maxParticles > 0, 
    [config.enableAnimations, config.maxParticles]
  );

  const cardClassName = useMemo(() => {
    const baseClass = 'transition-transform';
    const qualityClass = config.cardQuality === 'high' ? 'crisp-edges' : '';
    const shadowClass = config.enableShadows ? 'drop-shadow-lg' : '';
    const animationClass = config.enableAnimations ? 'hover:scale-105' : '';
    
    return [baseClass, qualityClass, shadowClass, animationClass]
      .filter(Boolean)
      .join(' ');
  }, [config]);

  // Debounced image loading
  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  // Lazy loading with intersection observer
  const useLazyImage = useCallback((ref: React.RefObject<HTMLElement>, src: string) => {
    useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            loadImage(src).then(() => {
              if (element instanceof HTMLImageElement) {
                element.src = src;
              }
            });
            observer.unobserve(element);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }, [ref, src]);
  }, [loadImage]);

  return {
    config,
    setConfig,
    shouldRenderParticles,
    cardClassName,
    loadImage,
    useLazyImage
  };
}