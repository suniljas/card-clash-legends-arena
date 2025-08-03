import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

// Focus management hook for modal and navigation
export function useFocusManagement() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, []);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, []);

  return { trapFocus, saveFocus, restoreFocus };
}

// Keyboard navigation hook for grid layouts
export function useKeyboardNavigation(
  items: any[],
  columns: number,
  onSelect?: (index: number) => void
) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!items.length) return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + columns, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - columns, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect?.(selectedIndex);
        break;
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setSelectedIndex(items.length - 1);
        break;
    }
  }, [items.length, columns, onSelect, selectedIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  // Focus the selected item
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const selectedElement = container.children[selectedIndex] as HTMLElement;
      selectedElement?.focus();
    }
  }, [selectedIndex]);

  return { selectedIndex, setSelectedIndex, containerRef };
}

// High contrast mode detection and styles
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = React.useState(false);

  useEffect(() => {
    const checkHighContrast = () => {
      const mediaQuery = window.matchMedia('(prefers-contrast: high)');
      setIsHighContrast(mediaQuery.matches);
    };

    checkHighContrast();
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    mediaQuery.addEventListener('change', checkHighContrast);

    return () => mediaQuery.removeEventListener('change', checkHighContrast);
  }, []);

  const getHighContrastStyles = useCallback((baseStyles: string) => {
    if (!isHighContrast) return baseStyles;
    
    return cn(
      baseStyles,
      'border-2 border-white',
      'bg-black text-white',
      'focus:outline-white focus:outline-2',
      'hover:bg-gray-800'
    );
  }, [isHighContrast]);

  return { isHighContrast, getHighContrastStyles };
}

// Screen reader announcements
export function useScreenReader() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return { announce };
}

// Accessible button component with enhanced states
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function AccessibleButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  children,
  className,
  disabled,
  ...props
}: AccessibleButtonProps) {
  const { isHighContrast, getHighContrastStyles } = useHighContrast();

  const baseClasses = cn(
    'relative inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'touch-target', // Minimum 44px touch target
    {
      // Size variants
      'px-3 py-2 text-sm min-h-[44px]': size === 'sm',
      'px-4 py-3 text-base min-h-[44px]': size === 'md',
      'px-6 py-4 text-lg min-h-[48px]': size === 'lg',
      
      // Style variants
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
      'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500': variant === 'secondary',
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
      'bg-transparent text-gray-300 hover:bg-gray-800 focus:ring-gray-500': variant === 'ghost',
    }
  );

  const finalClasses = getHighContrastStyles(cn(baseClasses, className));

  return (
    <button
      className={finalClasses}
      disabled={disabled || isLoading}
      aria-describedby={isLoading ? 'loading-status' : undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="sr-only" id="loading-status">
            {loadingText}
          </span>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Skip navigation component
export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className={cn(
        'sr-only focus:not-sr-only',
        'absolute top-4 left-4 z-50',
        'bg-blue-600 text-white px-4 py-2 rounded',
        'focus:outline-none focus:ring-2 focus:ring-blue-500'
      )}
    >
      Skip to main content
    </a>
  );
}

// Accessible modal component
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children
}: AccessibleModalProps) {
  const { trapFocus, saveFocus, restoreFocus } = useFocusManagement();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      saveFocus();
      const modal = modalRef.current;
      if (modal) {
        const cleanup = trapFocus(modal);
        return cleanup;
      }
    } else {
      restoreFocus();
    }
  }, [isOpen, trapFocus, saveFocus, restoreFocus]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className={cn(
          'relative bg-white dark:bg-gray-800 rounded-lg shadow-xl',
          'max-w-md w-full mx-4 p-6',
          'focus:outline-none'
        )}
        tabIndex={-1}
      >
        <h2 id="modal-title" className="text-lg font-semibold mb-4">
          {title}
        </h2>
        {description && (
          <p id="modal-description" className="text-gray-600 dark:text-gray-300 mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}