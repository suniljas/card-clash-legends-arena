import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Clock, 
  MemoryStick, 
  Wifi, 
  Battery,
  Settings,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  batteryLevel?: number;
  networkLatency?: number;
  renderTime: number;
  jsHeapSize: number;
  domNodes: number;
}

interface PerformanceSettings {
  enableAnimations: boolean;
  particleQuality: 'low' | 'medium' | 'high';
  shadowQuality: 'off' | 'low' | 'high';
  textureQuality: 'low' | 'medium' | 'high';
  autoOptimize: boolean;
}

export function EnhancedPerformanceSystem() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    jsHeapSize: 0,
    domNodes: 0
  });

  const [settings, setSettings] = useState<PerformanceSettings>({
    enableAnimations: true,
    particleQuality: 'medium',
    shadowQuality: 'low',
    textureQuality: 'medium',
    autoOptimize: true
  });

  const [isVisible, setIsVisible] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(100);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationId = useRef<number>();

  // Performance monitoring
  useEffect(() => {
    const isDev = import.meta.env.DEV;
    const isDebug = new URLSearchParams(window.location.search).has('debug');
    const isPerformanceMode = new URLSearchParams(window.location.search).has('performance');
    
    setIsVisible(isDev || isDebug || isPerformanceMode);

    if (!isVisible) return;

    const measurePerformance = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        
        // Memory usage
        const memory = (performance as any).memory;
        const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1048576) : 0;
        const jsHeapSize = memory ? Math.round(memory.totalJSHeapSize / 1048576) : 0;
        
        // DOM nodes count
        const domNodes = document.querySelectorAll('*').length;
        
        // Load time
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : 0;
        
        // Render time (approximate)
        const renderTime = Math.round(currentTime - lastTime.current);
        
        // Battery level
        if ('getBattery' in navigator) {
          (navigator as any).getBattery().then((battery: any) => {
            setMetrics(prev => ({
              ...prev,
              fps,
              memoryUsage,
              loadTime,
              renderTime,
              jsHeapSize,
              domNodes,
              batteryLevel: Math.round(battery.level * 100)
            }));
          });
        } else {
          setMetrics(prev => ({
            ...prev,
            fps,
            memoryUsage,
            loadTime,
            renderTime,
            jsHeapSize,
            domNodes
          }));
        }
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationId.current = requestAnimationFrame(measurePerformance);
    };

    measurePerformance();

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [isVisible]);

  // Calculate performance score and recommendations
  useEffect(() => {
    let score = 100;
    const newRecommendations: string[] = [];

    // FPS scoring
    if (metrics.fps < 30) {
      score -= 30;
      newRecommendations.push('Low FPS detected. Consider reducing animation quality.');
    } else if (metrics.fps < 45) {
      score -= 15;
      newRecommendations.push('FPS could be improved. Try lowering particle effects.');
    }

    // Memory scoring
    if (metrics.memoryUsage > 150) {
      score -= 25;
      newRecommendations.push('High memory usage. Close other tabs or restart the game.');
    } else if (metrics.memoryUsage > 100) {
      score -= 10;
      newRecommendations.push('Memory usage is elevated. Monitor for memory leaks.');
    }

    // DOM nodes scoring
    if (metrics.domNodes > 5000) {
      score -= 15;
      newRecommendations.push('Too many DOM elements. Consider virtual scrolling.');
    }

    // Battery scoring
    if (metrics.batteryLevel && metrics.batteryLevel < 20) {
      score -= 10;
      newRecommendations.push('Low battery. Enable power saving mode.');
    }

    // Auto-optimize if enabled
    if (settings.autoOptimize && score < 70) {
      setSettings(prev => ({
        ...prev,
        enableAnimations: false,
        particleQuality: 'low',
        shadowQuality: 'off',
        textureQuality: 'low'
      }));
      newRecommendations.push('Auto-optimization applied to improve performance.');
    }

    setPerformanceScore(Math.max(0, score));
    setRecommendations(newRecommendations);
  }, [metrics, settings.autoOptimize]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMetricColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-500';
    if (value <= thresholds[1]) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card className="p-4 bg-black/90 text-white border-gray-700 backdrop-blur-sm">
        {/* Performance Score */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">Performance</span>
          </div>
          <div className={cn('text-xl font-bold', getScoreColor(performanceScore))}>
            {performanceScore}%
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Activity className="w-3 h-3" />
              <span className="text-xs">FPS</span>
            </div>
            <div className={cn('font-bold', getMetricColor(60 - metrics.fps, [15, 30]))}>
              {metrics.fps}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MemoryStick className="w-3 h-3" />
              <span className="text-xs">RAM</span>
            </div>
            <div className={cn('font-bold', getMetricColor(metrics.memoryUsage, [50, 100]))}>
              {metrics.memoryUsage}MB
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3 h-3" />
              <span className="text-xs">Load</span>
            </div>
            <div className={cn('font-bold', getMetricColor(metrics.loadTime, [2000, 5000]))}>
              {(metrics.loadTime / 1000).toFixed(1)}s
            </div>
          </div>

          {metrics.batteryLevel && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Battery className="w-3 h-3" />
                <span className="text-xs">Battery</span>
              </div>
              <div className={cn('font-bold', getMetricColor(100 - metrics.batteryLevel, [20, 50]))}>
                {metrics.batteryLevel}%
              </div>
            </div>
          )}
        </div>

        {/* Performance Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Overall Performance</span>
            <span className={getScoreColor(performanceScore)}>{performanceScore}%</span>
          </div>
          <Progress 
            value={performanceScore} 
            className="h-2"
          />
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <AlertTriangle className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-semibold">Recommendations</span>
            </div>
            <div className="space-y-1">
              {recommendations.slice(0, 2).map((rec, index) => (
                <div key={index} className="text-xs text-gray-300 bg-gray-800/50 p-2 rounded">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Settings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs">Auto-Optimize</span>
            <Button
              variant={settings.autoOptimize ? "default" : "outline"}
              size="sm"
              onClick={() => setSettings(prev => ({ ...prev, autoOptimize: !prev.autoOptimize }))}
              className="h-6 px-2 text-xs"
            >
              {settings.autoOptimize ? 'ON' : 'OFF'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs">Animations</span>
            <Button
              variant={settings.enableAnimations ? "default" : "outline"}
              size="sm"
              onClick={() => setSettings(prev => ({ ...prev, enableAnimations: !prev.enableAnimations }))}
              className="h-6 px-2 text-xs"
            >
              {settings.enableAnimations ? 'ON' : 'OFF'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs">Quality</span>
            <select
              value={settings.particleQuality}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                particleQuality: e.target.value as 'low' | 'medium' | 'high' 
              }))}
              className="h-6 px-2 text-xs bg-gray-800 border border-gray-600 rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Advanced Metrics Toggle */}
        <details className="mt-4">
          <summary className="text-xs cursor-pointer text-gray-400 hover:text-white">
            Advanced Metrics
          </summary>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>JS Heap:</span>
              <span>{metrics.jsHeapSize}MB</span>
            </div>
            <div className="flex justify-between">
              <span>DOM Nodes:</span>
              <span>{metrics.domNodes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Render Time:</span>
              <span>{metrics.renderTime}ms</span>
            </div>
            {metrics.networkLatency && (
              <div className="flex justify-between">
                <span>Network:</span>
                <span>{metrics.networkLatency}ms</span>
              </div>
            )}
          </div>
        </details>
      </Card>
    </div>
  );
}

// Export performance settings for use in other components
export function usePerformanceSettings() {
  const [settings, setSettings] = useState<PerformanceSettings>({
    enableAnimations: true,
    particleQuality: 'medium',
    shadowQuality: 'low',
    textureQuality: 'medium',
    autoOptimize: true
  });

  return { settings, setSettings };
}