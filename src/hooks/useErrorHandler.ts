import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorState {
  error: Error | null;
  isLoading: boolean;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isLoading: false
  });
  const { toast } = useToast();

  const handleError = useCallback((error: Error | string, showToast = true) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    console.error('Error caught by useErrorHandler:', errorObj);
    
    setErrorState(prev => ({ ...prev, error: errorObj }));
    
    if (showToast) {
      toast({
        title: "Error",
        description: errorObj.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  }, [toast]);

  const clearError = useCallback(() => {
    setErrorState(prev => ({ ...prev, error: null }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setErrorState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      setLoading(true);
      clearError();
      const result = await operation();
      return result;
    } catch (error) {
      const message = errorMessage || (error instanceof Error ? error.message : 'Operation failed');
      handleError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError, clearError, setLoading]);

  return {
    error: errorState.error,
    isLoading: errorState.isLoading,
    handleError,
    clearError,
    setLoading,
    executeWithErrorHandling
  };
}