import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Signal, SignalHigh, SignalLow, SignalMedium, SignalZero } from 'lucide-react';

interface NetworkStatus {
  isOnline: boolean;
  connectionType?: string;
  downlink?: number;
  effectiveType?: string;
  latency?: number;
}

interface NetworkStatusIndicatorProps {
  latency?: number;
  showDetails?: boolean;
}

export function NetworkStatusIndicator({ latency, showDetails = false }: NetworkStatusIndicatorProps) {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    latency
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      setStatus({
        isOnline: navigator.onLine,
        connectionType: connection?.type,
        downlink: connection?.downlink,
        effectiveType: connection?.effectiveType,
        latency
      });
    };

    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => updateNetworkStatus();
    const handleConnectionChange = () => updateNetworkStatus();

    // Initial update
    updateNetworkStatus();

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [latency]);

  const getSignalIcon = () => {
    if (!status.isOnline) return WifiOff;
    
    if (status.latency !== undefined) {
      if (status.latency < 50) return SignalHigh;
      if (status.latency < 150) return SignalMedium;
      if (status.latency < 300) return SignalLow;
      return SignalZero;
    }
    
    if (status.effectiveType) {
      switch (status.effectiveType) {
        case '4g': return SignalHigh;
        case '3g': return SignalMedium;
        case '2g': return SignalLow;
        default: return Signal;
      }
    }
    
    return Wifi;
  };

  const getStatusColor = () => {
    if (!status.isOnline) return 'destructive';
    
    if (status.latency !== undefined) {
      if (status.latency < 100) return 'default';
      if (status.latency < 200) return 'secondary';
      return 'destructive';
    }
    
    return 'default';
  };

  const getStatusText = () => {
    if (!status.isOnline) return 'Offline';
    
    if (status.latency !== undefined) {
      return `${status.latency}ms`;
    }
    
    if (status.effectiveType) {
      return status.effectiveType.toUpperCase();
    }
    
    return 'Online';
  };

  const SignalIcon = getSignalIcon();

  if (!showDetails && status.isOnline && (!status.latency || status.latency < 200)) {
    return null; // Hide when connection is good
  }

  return (
    <Badge variant={getStatusColor()} className="flex items-center gap-1 text-xs">
      <SignalIcon className="w-3 h-3" />
      {showDetails && <span>{getStatusText()}</span>}
    </Badge>
  );
}