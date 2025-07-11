import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Zap } from 'lucide-react';

interface NetworkStatusIndicatorProps {
  latency?: number | null;
  className?: string;
}

export function NetworkStatusIndicator({ latency, className }: NetworkStatusIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setConnectionQuality('offline');
    } else if (latency !== null && latency !== undefined) {
      setConnectionQuality(latency > 200 ? 'poor' : 'good');
    } else {
      setConnectionQuality('good');
    }
  }, [isOnline, latency]);

  const getStatusConfig = () => {
    switch (connectionQuality) {
      case 'offline':
        return {
          icon: WifiOff,
          text: 'Offline',
          variant: 'destructive' as const,
          className: 'connection-poor'
        };
      case 'poor':
        return {
          icon: Wifi,
          text: `${latency}ms`,
          variant: 'outline' as const,
          className: 'connection-poor'
        };
      default:
        return {
          icon: Zap,
          text: latency ? `${latency}ms` : 'Online',
          variant: 'outline' as const,
          className: 'connection-good'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      <IconComponent className="w-3 h-3 mr-1" />
      {config.text}
    </Badge>
  );
}