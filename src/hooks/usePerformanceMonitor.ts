import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
}

interface PerformanceOptions {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  memoryThreshold?: number; // MB
  fpsThreshold?: number;
  enableAutoOptimization?: boolean;
}

export function usePerformanceMonitor(options: PerformanceOptions = {}) {
  const {
    onMetricsUpdate,
    memoryThreshold = 100, // 100MB
    fpsThreshold = 30,
    enableAutoOptimization = true
  } = options;

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);
  const memoryHistory = useRef<number[]>([]);
  const animationFrame = useRef<number>();

  // Performance monitoring loop
  const monitor = useCallback(() => {
    const now = performance.now();
    frameCount.current++;

    // Calculate FPS every second
    if (now - lastTime.current >= 1000) {
      const fps = frameCount.current;
      fpsHistory.current.push(fps);
      
      // Keep only last 10 measurements
      if (fpsHistory.current.length > 10) {
        fpsHistory.current.shift();
      }

      frameCount.current = 0;
      lastTime.current = now;

      // Get memory usage if available
      let memoryUsage = 0;
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
        memoryHistory.current.push(memoryUsage);
        
        if (memoryHistory.current.length > 10) {
          memoryHistory.current.shift();
        }
      }

      const avgFps = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
      const avgMemory = memoryHistory.current.reduce((a, b) => a + b, 0) / memoryHistory.current.length;

      const metrics: PerformanceMetrics = {
        fps: Math.round(avgFps),
        memoryUsage: Math.round(avgMemory),
        renderTime: now - lastTime.current
      };

      onMetricsUpdate?.(metrics);

      // Auto-optimization
      if (enableAutoOptimization) {
        if (avgFps < fpsThreshold) {
          console.warn(`Low FPS detected: ${avgFps}. Consider reducing visual effects.`);
          // Dispatch custom event for components to react
          window.dispatchEvent(new CustomEvent('lowPerformance', { 
            detail: { type: 'fps', value: avgFps } 
          }));
        }

        if (avgMemory > memoryThreshold) {
          console.warn(`High memory usage detected: ${avgMemory}MB. Triggering cleanup.`);
          window.dispatchEvent(new CustomEvent('lowPerformance', { 
            detail: { type: 'memory', value: avgMemory } 
          }));
        }
      }
    }

    animationFrame.current = requestAnimationFrame(monitor);
  }, [onMetricsUpdate, memoryThreshold, fpsThreshold, enableAutoOptimization]);

  useEffect(() => {
    animationFrame.current = requestAnimationFrame(monitor);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [monitor]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    
    // Clear history
    fpsHistory.current = [];
    memoryHistory.current = [];
    frameCount.current = 0;
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }, []);

  return {
    cleanup,
    getCurrentMetrics: () => ({
      fps: fpsHistory.current[fpsHistory.current.length - 1] || 0,
      memoryUsage: memoryHistory.current[memoryHistory.current.length - 1] || 0,
      renderTime: 0
    })
  };
}

// Memory management utilities
export const MemoryUtils = {
  // Get current memory usage
  getMemoryUsage: (): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  },

  // Force garbage collection (if available)
  forceGC: (): void => {
    if (window.gc) {
      window.gc();
    }
  },

  // Clear all timers and intervals
  clearTimers: (): void => {
    // Clear high timer IDs that might be lingering
    for (let i = 1; i < 1000; i++) {
      clearTimeout(i);
      clearInterval(i);
    }
  },

  // Image optimization
  optimizeImage: (canvas: HTMLCanvasElement, quality: number = 0.8): string => {
    return canvas.toDataURL('image/jpeg', quality);
  },

  // Memory leak detection
  detectLeaks: (): void => {
    const report: any = {};
    
    // Count DOM nodes
    report.domNodes = document.getElementsByTagName('*').length;
    
    // Count event listeners (rough estimate)
    report.eventListeners = Object.keys(window).filter(key => 
      key.startsWith('on') || key.includes('Event')
    ).length;

    // Check for common memory leak patterns
    const possibleLeaks: string[] = [];
    
    if (report.domNodes > 1000) {
      possibleLeaks.push('High DOM node count');
    }
    
    if (report.eventListeners > 50) {
      possibleLeaks.push('High event listener count');
    }

    console.log('Memory Leak Detection Report:', { report, possibleLeaks });
  }
};

// Performance optimization hook
export function usePerformanceOptimization() {
  useEffect(() => {
    // Listen for low performance events
    const handleLowPerformance = (event: CustomEvent) => {
      const { type, value } = event.detail;
      
      if (type === 'fps') {
        // Reduce animation quality
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        console.log('Performance optimization: Reduced animation duration');
      }
      
      if (type === 'memory') {
        // Trigger memory cleanup
        MemoryUtils.forceGC();
        MemoryUtils.clearTimers();
        console.log('Performance optimization: Triggered memory cleanup');
      }
    };

    window.addEventListener('lowPerformance', handleLowPerformance as EventListener);

    return () => {
      window.removeEventListener('lowPerformance', handleLowPerformance as EventListener);
    };
  }, []);

  return {
    enableLowMemoryMode: () => {
      document.documentElement.classList.add('low-memory-mode');
    },
    disableLowMemoryMode: () => {
      document.documentElement.classList.remove('low-memory-mode');
    }
  };
}
