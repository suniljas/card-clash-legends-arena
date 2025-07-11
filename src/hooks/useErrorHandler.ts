import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorReport {
  message: string;
  stack?: string;
  url?: string;
  lineNumber?: number;
  columnNumber?: number;
  userAgent: string;
  timestamp: number;
  gameState?: any;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const reportError = (error: Error, errorInfo?: any) => {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      gameState: errorInfo?.gameState
    };

    // In production, send to crash reporting service
    if (import.meta.env.PROD) {
      // Example: Send to Firebase Crashlytics or similar
      console.error('Error Report:', report);
      
      // Could also send to analytics
      if ('gtag' in window) {
        (window as any).gtag('event', 'exception', {
          description: error.message,
          fatal: false
        });
      }
    } else {
      console.error('Development Error:', error, errorInfo);
    }

    // Show user-friendly toast
    toast({
      title: "Something went wrong",
      description: "The error has been reported. Please try again.",
      variant: "destructive"
    });
  };

  const handlePromiseRejection = (event: PromiseRejectionEvent) => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    reportError(error);
    event.preventDefault();
  };

  const handleError = (event: ErrorEvent) => {
    const error = new Error(event.message);
    error.stack = `at ${event.filename}:${event.lineno}:${event.colno}`;
    reportError(error);
  };

  useEffect(() => {
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  return { reportError };
}