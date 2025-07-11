import { Cloud, CloudOff, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CloudSaveIndicatorProps {
  isAuthenticated: boolean;
  isSyncing: boolean;
  className?: string;
}

export function CloudSaveIndicator({ isAuthenticated, isSyncing, className }: CloudSaveIndicatorProps) {
  if (!isAuthenticated) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <CloudOff className="h-4 w-4" />
        <span className="text-sm">Local Save</span>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className={cn("flex items-center gap-2 text-primary", className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Syncing...</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 text-green-600", className)}>
      <Cloud className="h-4 w-4" />
      <span className="text-sm">Cloud Saved</span>
    </div>
  );
}