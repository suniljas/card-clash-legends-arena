import { analytics } from '@/config/firebase';
import { logEvent } from 'firebase/analytics';

export interface CrashReport {
  error: Error;
  errorInfo?: any;
  userId?: string;
  gameState?: any;
  userAgent: string;
  url: string;
  timestamp: number;
  buildVersion: string;
}

class CrashReportingService {
  private userId?: string;
  private gameState?: any;

  setUserId(userId: string) {
    this.userId = userId;
  }

  setGameState(state: any) {
    this.gameState = state;
  }

  reportError(error: Error, errorInfo?: any) {
    const report: CrashReport = {
      error,
      errorInfo,
      userId: this.userId,
      gameState: this.gameState,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
      buildVersion: import.meta.env.VITE_APP_VERSION || '1.0.0'
    };

    try {
      // Log to Firebase Analytics as custom event
      if (analytics) {
        logEvent(analytics, 'app_crash', {
          error_message: error.message,
          error_stack: error.stack?.substring(0, 500), // Limit stack trace length
          user_id: this.userId,
          timestamp: report.timestamp,
          url: report.url
        });
      }

      // Log to console in development
      if (import.meta.env.DEV) {
        console.error('Crash Report:', report);
      }

      // In production, you could also send to a dedicated crash reporting service
      // like Sentry, Bugsnag, or Firebase Crashlytics
      this.sendToCrashService(report);

    } catch (reportingError) {
      console.error('Failed to report crash:', reportingError);
    }
  }

  reportCrash(crashData: any) {
    console.log('Crash reported:', crashData);
  }

  logError(error: Error | string, context?: any) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    console.error('[CrashReporting]', errorMessage, context);
    
    // In a real implementation, this would send to error tracking service
    this.reportCrash({
      message: errorMessage,
      stack: typeof error === 'object' ? error.stack : undefined,
      context,
      timestamp: new Date().toISOString()
    });
  }

  private async sendToCrashService(report: CrashReport) {
    // This is where you'd integrate with your preferred crash reporting service
    // For now, we'll just log it
    if (import.meta.env.PROD) {
      try {
        // Example: Send to your backend crash endpoint
        // await fetch('/api/crash-reports', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(report)
        // });
        
        console.log('Crash reported to service:', {
          message: report.error.message,
          timestamp: report.timestamp,
          userId: report.userId
        });
      } catch (error) {
        console.error('Failed to send crash report to service:', error);
      }
    }
  }

  // Capture performance issues
  reportPerformanceIssue(metric: string, value: number, threshold: number) {
    if (value > threshold) {
      try {
        if (analytics) {
          logEvent(analytics, 'performance_issue', {
            metric,
            value,
            threshold,
            user_id: this.userId,
            timestamp: Date.now()
          });
        }
      } catch (error) {
        console.warn('Failed to report performance issue:', error);
      }
    }
  }

  // Report custom non-fatal errors
  reportNonFatalError(message: string, context?: any) {
    try {
      if (analytics) {
        logEvent(analytics, 'non_fatal_error', {
          message,
          context: JSON.stringify(context),
          user_id: this.userId,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.warn('Failed to report non-fatal error:', error);
    }
  }
}

export const crashReportingService = new CrashReportingService();