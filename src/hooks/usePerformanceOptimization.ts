import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  isLowPerformanceDevice: boolean;
}

export function usePerformanceOptimization() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    isLowPerformanceDevice: false
  });

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Performance monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Detect low performance device
        const isLowPerformance = fps < 30 || 
          (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
          ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4);

        setMetrics(prev => ({
          ...prev,
          fps,
          isLowPerformanceDevice: isLowPerformance,
          renderTime: currentTime - lastTime
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Memory monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const optimizeForDevice = useCallback(() => {
    if (metrics.isLowPerformanceDevice) {
      // Disable heavy animations
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      document.documentElement.style.setProperty('--transition-duration', '0.1s');
      
      // Reduce particles and effects
      return {
        enableParticles: false,
        enableComplexAnimations: false,
        maxParticles: 5,
        reducedEffects: true
      };
    }

    return {
      enableParticles: true,
      enableComplexAnimations: !isReducedMotion,
      maxParticles: 50,
      reducedEffects: isReducedMotion
    };
  }, [metrics.isLowPerformanceDevice, isReducedMotion]);

  const preloadImages = useCallback((imageUrls: string[]) => {
    const promises = imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    });

    return Promise.allSettled(promises);
  }, []);

  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  return {
    metrics,
    isReducedMotion,
    optimizeForDevice,
    preloadImages,
    debounce
  };
}