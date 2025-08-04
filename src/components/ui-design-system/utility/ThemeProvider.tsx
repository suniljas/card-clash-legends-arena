// Enhanced Theme Provider
// Comprehensive theme management with dark mode, accessibility, and game-specific themes

import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'light' | 'dark' | 'system' | 'game-light' | 'game-dark';
type AccessibilityOptions = {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  screenReader: boolean;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  enableAccessibility?: boolean;
  enableGameThemes?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accessibility: AccessibilityOptions;
  updateAccessibility: (options: Partial<AccessibilityOptions>) => void;
  toggleTheme: () => void;
  isLoading: boolean;
  systemTheme: 'light' | 'dark';
  resolvedTheme: 'light' | 'dark' | 'game-light' | 'game-dark';
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    colorBlindMode: 'none',
    screenReader: false,
  },
  updateAccessibility: () => null,
  toggleTheme: () => null,
  isLoading: true,
  systemTheme: 'light',
  resolvedTheme: 'light',
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'card-clash-theme',
  enableSystem = true,
  enableAccessibility = true,
  enableGameThemes = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [accessibility, setAccessibility] = useState<AccessibilityOptions>({
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    colorBlindMode: 'none',
    screenReader: false,
  });

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load saved theme and accessibility settings
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    const savedAccessibility = localStorage.getItem(`${storageKey}-accessibility`);

    if (savedTheme) {
      setTheme(savedTheme);
    }

    if (savedAccessibility && enableAccessibility) {
      try {
        setAccessibility(JSON.parse(savedAccessibility));
      } catch (error) {
        console.warn('Failed to parse accessibility settings:', error);
      }
    }

    // Check for system accessibility preferences
    if (enableAccessibility) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const highContrast = window.matchMedia('(prefers-contrast: high)').matches;
      
      setAccessibility(prev => ({
        ...prev,
        reduceMotion: reducedMotion,
        highContrast: highContrast,
      }));
    }

    setIsLoading(false);
  }, [storageKey, enableAccessibility]);

  // Calculate resolved theme
  const resolvedTheme = (() => {
    if (theme === 'system') {
      return enableGameThemes ? `game-${systemTheme}` as 'game-light' | 'game-dark' : systemTheme;
    }
    return theme;
  })();

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'game-light', 'game-dark');
    
    // Add resolved theme class
    root.classList.add(resolvedTheme);

    // Apply accessibility settings
    if (accessibility.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (accessibility.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (accessibility.colorBlindMode !== 'none') {
      root.classList.add(`colorblind-${accessibility.colorBlindMode}`);
    } else {
      root.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = resolvedTheme.includes('dark') ? '#18181b' : '#ffffff';
      metaThemeColor.setAttribute('content', color);
    }
  }, [resolvedTheme, accessibility]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  const updateAccessibility = (options: Partial<AccessibilityOptions>) => {
    const newSettings = { ...accessibility, ...options };
    setAccessibility(newSettings);
    
    if (enableAccessibility) {
      localStorage.setItem(`${storageKey}-accessibility`, JSON.stringify(newSettings));
    }
  };

  const toggleTheme = () => {
    const themeOrder: Theme[] = enableGameThemes 
      ? ['light', 'dark', 'game-light', 'game-dark', 'system']
      : ['light', 'dark', 'system'];
    
    const currentIndex = themeOrder.indexOf(theme);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    handleSetTheme(nextTheme);
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
    accessibility,
    updateAccessibility,
    toggleTheme,
    isLoading,
    systemTheme,
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key={resolvedTheme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

// Enhanced theme toggle component
export function ThemeToggle() {
  const { theme, toggleTheme, resolvedTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-md border border-input bg-background/50 animate-pulse" />
    );
  }

  const getThemeIcon = () => {
    switch (resolvedTheme) {
      case 'light':
      case 'game-light':
        return '☀️';
      case 'dark':
      case 'game-dark':
        return '🌙';
      default:
        return '🎮';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'game-light':
        return 'Game Light';
      case 'game-dark':
        return 'Game Dark';
      case 'system':
        return 'System Theme';
      default:
        return 'Theme';
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={getThemeLabel()}
    >
      <motion.span
        key={resolvedTheme}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ duration: 0.2 }}
        className="text-lg"
      >
        {getThemeIcon()}
      </motion.span>
    </motion.button>
  );
}

// Accessibility settings component
export function AccessibilitySettings() {
  const { accessibility, updateAccessibility } = useTheme();

  return (
    <div className="space-y-4 p-4 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold">Accessibility Settings</h3>
      
      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={accessibility.reduceMotion}
            onChange={(e) => updateAccessibility({ reduceMotion: e.target.checked })}
            className="rounded border-input"
          />
          <span>Reduce motion</span>
        </label>
        
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={accessibility.highContrast}
            onChange={(e) => updateAccessibility({ highContrast: e.target.checked })}
            className="rounded border-input"
          />
          <span>High contrast</span>
        </label>
        
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={accessibility.largeText}
            onChange={(e) => updateAccessibility({ largeText: e.target.checked })}
            className="rounded border-input"
          />
          <span>Large text</span>
        </label>
        
        <div className="space-y-2">
          <label htmlFor="colorblind-mode" className="block text-sm font-medium">
            Color blind support:
          </label>
          <select
            id="colorblind-mode"
            value={accessibility.colorBlindMode}
            onChange={(e) => updateAccessibility({ 
              colorBlindMode: e.target.value as AccessibilityOptions['colorBlindMode'] 
            })}
            className="w-full rounded border border-input bg-background px-3 py-2"
          >
            <option value="none">None</option>
            <option value="protanopia">Protanopia (Red-blind)</option>
            <option value="deuteranopia">Deuteranopia (Green-blind)</option>
            <option value="tritanopia">Tritanopia (Blue-blind)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export type { Theme, AccessibilityOptions, ThemeProviderProps, ThemeProviderState };