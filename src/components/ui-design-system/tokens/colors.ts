// Color Design Tokens
// Centralized color system for Card Clash Legends Arena

export const colors = {
  // Base Colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // Gray Scale
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },

  // Primary Brand Colors (Dark Blue to Gold)
  primary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308', // Main brand yellow-gold
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },

  // Secondary (Deep Blue)
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8', // Main dark blue
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Rarity Colors
  rarity: {
    common: {
      light: '#64748b',
      main: '#475569',
      dark: '#334155',
      accent: '#cbd5e1',
    },
    uncommon: {
      light: '#22c55e',
      main: '#16a34a',
      dark: '#15803d',
      accent: '#bbf7d0',
    },
    rare: {
      light: '#3b82f6',
      main: '#2563eb',
      dark: '#1d4ed8',
      accent: '#dbeafe',
    },
    epic: {
      light: '#a855f7',
      main: '#9333ea',
      dark: '#7c3aed',
      accent: '#e9d5ff',
    },
    legend: {
      light: '#f59e0b',
      main: '#d97706',
      dark: '#b45309',
      accent: '#fde68a',
    },
    'ultra-legend': {
      light: '#ef4444',
      main: '#dc2626',
      dark: '#b91c1c',
      accent: '#fecaca',
    },
  },

  // Game Stats Colors
  stats: {
    health: '#dc2626', // Red
    attack: '#ea580c', // Orange
    defense: '#2563eb', // Blue
    experience: '#7c3aed', // Purple
    mana: '#0891b2', // Cyan
  },

  // Status Colors
  success: {
    light: '#22c55e',
    main: '#16a34a',
    dark: '#15803d',
    accent: '#bbf7d0',
  },
  warning: {
    light: '#f59e0b',
    main: '#d97706',
    dark: '#b45309',
    accent: '#fde68a',
  },
  error: {
    light: '#ef4444',
    main: '#dc2626',
    dark: '#b91c1c',
    accent: '#fecaca',
  },
  info: {
    light: '#3b82f6',
    main: '#2563eb',
    dark: '#1d4ed8',
    accent: '#dbeafe',
  },

  // Special Effect Colors
  magic: {
    arcane: '#8b5cf6',
    divine: '#fbbf24',
    shadow: '#6b7280',
    nature: '#10b981',
    fire: '#f97316',
    ice: '#06b6d4',
  },

  // Gradient Definitions
  gradients: {
    primary: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
    secondary: 'linear-gradient(135deg, #eab308 0%, #fbbf24 100%)',
    mystical: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #2563eb 100%)',
    premium: 'linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #d97706 100%)',
    legendary: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #dc2626 100%)',
    holographic: 'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #f59e0b)',
  },
} as const;

// CSS Custom Properties Generator
export const generateCSSVariables = (theme: 'light' | 'dark' = 'light') => {
  const variables: Record<string, string> = {};
  
  // Add base colors
  Object.entries(colors.gray).forEach(([key, value]) => {
    variables[`--gray-${key}`] = value;
  });

  Object.entries(colors.primary).forEach(([key, value]) => {
    variables[`--primary-${key}`] = value;
  });

  Object.entries(colors.secondary).forEach(([key, value]) => {
    variables[`--secondary-${key}`] = value;
  });

  // Add rarity colors
  Object.entries(colors.rarity).forEach(([rarity, colorSet]) => {
    Object.entries(colorSet).forEach(([tone, value]) => {
      variables[`--rarity-${rarity}-${tone}`] = value;
    });
  });

  // Add stat colors
  Object.entries(colors.stats).forEach(([stat, value]) => {
    variables[`--stat-${stat}`] = value;
  });

  return variables;
};

export type ColorToken = keyof typeof colors;
export type RarityColor = keyof typeof colors.rarity;
export type StatColor = keyof typeof colors.stats;