import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  connectionSpeed: 'fast' | 'slow' | 'offline';
}

interface PerformanceMonitorProps {
  className?: string;
  showDetails?: boolean;
  onPerformanceIssue?: (issue: string) => void;
}

export function PerformanceMonitor({ 
  className, 
  showDetails = false,
  onPerformanceIssue 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0,
    connectionSpeed: 'fast'
  });
  const [performanceScore, setPerformanceScore] = useState<'good' | 'fair' | 'poor'>('good');

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setMetrics(prev => ({ ...prev, fps }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrame = requestAnimationFrame(measureFPS);
    };

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        setMetrics(prev => ({ ...prev, memoryUsage: usedMB }));
      }
    };

    const measureLoadTime = () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      setMetrics(prev => ({ ...prev, loadTime }));
    };

    // Initial measurements
    measureMemory();
    measureLoadTime();
    measureFPS();

    // Periodic memory checks
    const memoryInterval = setInterval(measureMemory, 5000);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(memoryInterval);
    };
  }, []);

  useEffect(() => {
    // Calculate performance score
    let score = 100;
    
    if (metrics.fps < 30) score -= 30;
    else if (metrics.fps < 50) score -= 15;
    
    if (metrics.memoryUsage > 100) score -= 20;
    else if (metrics.memoryUsage > 50) score -= 10;
    
    if (metrics.loadTime > 3000) score -= 25;
    else if (metrics.loadTime > 1500) score -= 10;

    const newScore = score >= 80 ? 'good' : score >= 60 ? 'fair' : 'poor';
    setPerformanceScore(newScore);

    // Trigger performance issue callback
    if (newScore === 'poor' && onPerformanceIssue) {
      let issues = [];
      if (metrics.fps < 30) issues.push('Low frame rate');
      if (metrics.memoryUsage > 100) issues.push('High memory usage');
      if (metrics.loadTime > 3000) issues.push('Slow loading');
      
      onPerformanceIssue(issues.join(', '));
    }
  }, [metrics, onPerformanceIssue]);

  const getPerformanceIcon = () => {
    switch (performanceScore) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-common" />;
      case 'fair':
        return <Zap className="w-4 h-4 text-accent" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }
  };

  const getPerformanceVariant = () => {
    switch (performanceScore) {
      case 'good':
        return 'outline' as const;
      case 'fair':
        return 'secondary' as const;
      default:
        return 'destructive' as const;
    }
  };

  if (!showDetails) {
    return (
      <Badge 
        variant={getPerformanceVariant()}
        className={className}
      >
        {getPerformanceIcon()}
        <span className="ml-1 capitalize">{performanceScore}</span>
      </Badge>
    );
  }

  return (
    <Card className={`p-3 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {getPerformanceIcon()}
        <span className="text-sm font-medium">Performance</span>
        <Badge variant={getPerformanceVariant()} className="ml-auto">
          {performanceScore.toUpperCase()}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">FPS:</span>
          <span className={metrics.fps < 30 ? 'text-destructive' : 'text-foreground'}>
            {metrics.fps}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Memory:</span>
          <span className={metrics.memoryUsage > 100 ? 'text-destructive' : 'text-foreground'}>
            {metrics.memoryUsage}MB
          </span>
        </div>
        
        <div className="flex justify-between col-span-2">
          <span className="text-muted-foreground">Load Time:</span>
          <span className={metrics.loadTime > 3000 ? 'text-destructive' : 'text-foreground'}>
            {Math.round(metrics.loadTime)}ms
          </span>
        </div>
      </div>
    </Card>
  );
}