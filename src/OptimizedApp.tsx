import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { usePerformanceMonitor, usePerformanceOptimization } from '@/hooks/usePerformanceMonitor';
import { useOptimizedGameStore, useMemoryManager } from '@/store/optimizedGameStore';
import { MainMenu } from '@/components/OptimizedMainMenu';
import { Game } from '@/components/Game';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './App.css';

function App() {
  const { cleanup, clearOldCache } = useMemoryManager();
  const { enableLowMemoryMode } = usePerformanceOptimization();
  
  // Performance monitoring with auto-optimization
  const { getCurrentMetrics } = usePerformanceMonitor({
    enableAutoOptimization: true,
    memoryThreshold: 200, // 200MB threshold
    fpsThreshold: 25,
    onMetricsUpdate: (metrics) => {
      // Log performance metrics
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance Metrics:', metrics);
      }
      
      // Auto-enable low memory mode if memory usage is high
      if (metrics.memoryUsage > 150) {
        enableLowMemoryMode();
      }
    }
  });

  // Periodic cleanup
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      clearOldCache();
      
      // Force garbage collection every 5 minutes if available
      if (window.gc && getCurrentMetrics().memoryUsage > 100) {
        window.gc();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      clearInterval(cleanupInterval);
      cleanup();
    };
  }, [cleanup, clearOldCache, getCurrentMetrics]);

  // Cleanup on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanup();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanup();
    };
  }, [cleanup]);

  // Memoize the main app content
  const appContent = useMemo(() => (
    <div className="App">
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="*" element={<Game />} />
          </Routes>
        </ErrorBoundary>
      </Router>
      <Toaster />
    </div>
  ), []);

  return appContent;
}

export default App;