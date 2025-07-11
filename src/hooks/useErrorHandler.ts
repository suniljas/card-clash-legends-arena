import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { crashReportingService } from '@/services/crashReporting';
import { analyticsService } from '@/services/analytics';

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
    // Use the new crash reporting service
    crashReportingService.reportError(error, errorInfo);

    // Track analytics event
    analyticsService.track('app_error', {
      error_message: error.message,
      error_stack: error.stack?.substring(0, 200),
      timestamp: Date.now()
    });

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