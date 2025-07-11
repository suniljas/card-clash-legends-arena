import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Clock, MemoryStick } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  batteryLevel?: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show performance monitor in development or if debug query param is present
    const isDev = import.meta.env.DEV;
    const isDebug = new URLSearchParams(window.location.search).has('debug');
    setIsVisible(isDev || isDebug);

    if (!isVisible) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Memory usage (if available)
        const memory = (performance as any).memory;
        const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1048576) : 0;
        
        // Load time
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : 0;
        
        // Battery level (if available)
        if ('getBattery' in navigator) {
          (navigator as any).getBattery().then((battery: any) => {
            setMetrics(prev => ({
              ...prev,
              fps,
              memoryUsage,
              loadTime,
              batteryLevel: Math.round(battery.level * 100)
            }));
          });
        } else {
          setMetrics(prev => ({
            ...prev,
            fps,
            memoryUsage,
            loadTime
          }));
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };

    measurePerformance();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'bg-green-500';
    if (fps >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMemoryColor = (memory: number) => {
    if (memory < 50) return 'bg-green-500';
    if (memory < 100) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 opacity-80 hover:opacity-100 transition-opacity">
      <Card className="p-3 bg-black/90 text-white border-gray-700">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>FPS:</span>
            <Badge className={`px-1 py-0 text-xs ${getFPSColor(metrics.fps)}`}>
              {metrics.fps}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <MemoryStick className="w-3 h-3" />
            <span>RAM:</span>
            <Badge className={`px-1 py-0 text-xs ${getMemoryColor(metrics.memoryUsage)}`}>
              {metrics.memoryUsage}MB
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Load:</span>
            <Badge variant="outline" className="px-1 py-0 text-xs">
              {metrics.loadTime}ms
            </Badge>
          </div>
          
          {metrics.batteryLevel && (
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Bat:</span>
              <Badge variant="outline" className="px-1 py-0 text-xs">
                {metrics.batteryLevel}%
              </Badge>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}