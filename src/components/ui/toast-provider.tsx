import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Info, X, Trophy, Star } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'achievement' | 'reward';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        dismissToast(id);
      }, toast.duration || 4000);
    }
  }, []);

  const dismissToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const getToastConfig = (type: ToastType) => {
    const configs = {
      success: {
        icon: <CheckCircle className="w-5 h-5" />,
        className: "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/50 text-white",
        progressColor: "bg-green-300"
      },
      error: {
        icon: <AlertCircle className="w-5 h-5" />,
        className: "bg-gradient-to-r from-red-500/90 to-rose-500/90 border-red-400/50 text-white",
        progressColor: "bg-red-300"
      },
      info: {
        icon: <Info className="w-5 h-5" />,
        className: "bg-gradient-to-r from-blue-500/90 to-cyan-500/90 border-blue-400/50 text-white",
        progressColor: "bg-blue-300"
      },
      achievement: {
        icon: <Trophy className="w-5 h-5" />,
        className: "bg-gradient-to-r from-amber-500/90 to-yellow-500/90 border-amber-400/50 text-white",
        progressColor: "bg-amber-300"
      },
      reward: {
        icon: <Star className="w-5 h-5" />,
        className: "bg-gradient-to-r from-purple-500/90 to-pink-500/90 border-purple-400/50 text-white",
        progressColor: "bg-purple-300"
      }
    };
    return configs[type];
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = getToastConfig(toast.type);
            
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 300, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "relative max-w-sm w-full rounded-lg border shadow-lg backdrop-blur-md",
                  "pointer-events-auto",
                  config.className
                )}
              >
                <div className="flex items-start gap-3 p-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {toast.icon || config.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{toast.title}</h4>
                    {toast.message && (
                      <p className="text-sm opacity-90 mt-1">{toast.message}</p>
                    )}
                    
                    {/* Action Button */}
                    {toast.action && (
                      <button
                        onClick={toast.action.onClick}
                        className="mt-2 text-sm font-medium underline hover:no-underline transition-all"
                      >
                        {toast.action.label}
                      </button>
                    )}
                  </div>
                  
                  {/* Dismiss Button */}
                  <button
                    onClick={() => dismissToast(toast.id)}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Progress Bar */}
                {toast.duration && toast.duration > 0 && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 rounded-b-lg"
                    style={{ backgroundColor: config.progressColor.replace('bg-', '') }}
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: toast.duration / 1000, ease: "linear" }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Convenience functions
export const toast = {
  success: (title: string, message?: string, options?: Partial<Toast>) => {
    // This will be implemented when the hook is available
  },
  error: (title: string, message?: string, options?: Partial<Toast>) => {
    // This will be implemented when the hook is available
  },
  info: (title: string, message?: string, options?: Partial<Toast>) => {
    // This will be implemented when the hook is available
  },
  achievement: (title: string, message?: string, options?: Partial<Toast>) => {
    // This will be implemented when the hook is available
  },
  reward: (title: string, message?: string, options?: Partial<Toast>) => {
    // This will be implemented when the hook is available
  }
};