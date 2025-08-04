// Shadow Design Tokens
// Centralized shadow system for Card Clash Legends Arena

export const shadows = {
  // Base shadow scales
  elevation: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    lg: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    xl: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '2xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '3xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // Inner shadows
  inner: {
    sm: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    lg: 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
  },

  // Game-specific shadows
  game: {
    // Card shadows
    card: {
      resting: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      hover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      active: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      selected: '0 0 0 2px rgba(59, 130, 246, 0.5), 0 10px 15px -3px rgba(59, 130, 246, 0.1)',
    },

    // Rarity-specific glows
    rarity: {
      common: '0 0 10px rgba(100, 116, 139, 0.3)',
      uncommon: '0 0 15px rgba(34, 197, 94, 0.4)',
      rare: '0 0 20px rgba(59, 130, 246, 0.5)',
      epic: '0 0 25px rgba(168, 85, 247, 0.6)',
      legend: '0 0 30px rgba(245, 158, 11, 0.7)',
      'ultra-legend': '0 0 35px rgba(239, 68, 68, 0.8)',
    },

    // Magical effects
    magic: {
      arcane: '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.3)',
      divine: '0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3)',
      shadow: '0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.4)',
      nature: '0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)',
      fire: '0 0 20px rgba(249, 115, 22, 0.6), 0 0 40px rgba(249, 115, 22, 0.3)',
      ice: '0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.3)',
    },

    // UI element shadows
    button: {
      resting: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      hover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      active: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },

    // Modal and overlay shadows
    modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overlay: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

    // Health bar and progress shadows
    healthBar: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    progressBar: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },

  // Contextual shadows
  contextual: {
    // Success states
    success: '0 0 15px rgba(34, 197, 94, 0.3)',
    // Warning states
    warning: '0 0 15px rgba(245, 158, 11, 0.3)',
    // Error states
    error: '0 0 15px rgba(239, 68, 68, 0.3)',
    // Info states
    info: '0 0 15px rgba(59, 130, 246, 0.3)',
  },

  // Premium effects
  premium: {
    // Holographic effect
    holographic: `
      0 0 20px rgba(6, 182, 212, 0.4),
      0 0 40px rgba(59, 130, 246, 0.3),
      0 0 60px rgba(139, 92, 246, 0.2),
      0 0 80px rgba(236, 72, 153, 0.1)
    `,
    
    // Foil effect
    foil: `
      0 0 10px rgba(251, 191, 36, 0.5),
      0 0 20px rgba(245, 158, 11, 0.3),
      0 0 30px rgba(217, 119, 6, 0.2)
    `,

    // Legendary aura
    legendary: `
      0 0 15px rgba(239, 68, 68, 0.4),
      0 0 30px rgba(245, 158, 11, 0.3),
      0 0 45px rgba(251, 191, 36, 0.2)
    `,

    // Divine glow
    divine: `
      0 0 20px rgba(255, 255, 255, 0.5),
      0 0 40px rgba(251, 191, 36, 0.3),
      0 0 60px rgba(245, 158, 11, 0.2)
    `,
  },

  // Animated shadows (for keyframes)
  animated: {
    pulse: {
      '0%, 100%': '0 0 20px rgba(59, 130, 246, 0.3)',
      '50%': '0 0 40px rgba(59, 130, 246, 0.6)',
    },
    glow: {
      '0%, 100%': '0 0 10px currentColor',
      '50%': '0 0 30px currentColor, 0 0 40px currentColor',
    },
  },
} as const;

// CSS Custom Properties Generator
export const generateShadowVariables = () => {
  const variables: Record<string, string> = {};

  // Base elevation shadows
  Object.entries(shadows.elevation).forEach(([key, value]) => {
    variables[`--shadow-${key}`] = value;
  });

  // Inner shadows
  Object.entries(shadows.inner).forEach(([key, value]) => {
    variables[`--shadow-inner-${key}`] = value;
  });

  // Game shadows
  Object.entries(shadows.game).forEach(([category, values]) => {
    if (typeof values === 'object' && values !== null) {
      Object.entries(values).forEach(([key, value]) => {
        variables[`--shadow-${category}-${key}`] = value as string;
      });
    }
  });

  // Contextual shadows
  Object.entries(shadows.contextual).forEach(([key, value]) => {
    variables[`--shadow-${key}`] = value;
  });

  // Premium shadows
  Object.entries(shadows.premium).forEach(([key, value]) => {
    variables[`--shadow-${key}`] = value;
  });

  return variables;
};

// Utility functions
export const getShadow = (category: keyof typeof shadows, key?: string) => {
  const shadowCategory = shadows[category];
  if (key && typeof shadowCategory === 'object' && shadowCategory !== null) {
    return (shadowCategory as any)[key];
  }
  return shadowCategory;
};

export const combineShadeows = (...shadowValues: string[]) => {
  return shadowValues.filter(Boolean).join(', ');
};

export const createRarityShadow = (rarity: keyof typeof shadows.game.rarity, intensity: number = 1) => {
  const baseShadow = shadows.game.rarity[rarity];
  if (intensity === 1) return baseShadow;
  
  // Adjust shadow intensity by modifying alpha values
  return baseShadow.replace(/rgba\(([^)]+),\s*([0-9.]+)\)/g, (match, rgb, alpha) => {
    const newAlpha = Math.min(1, parseFloat(alpha) * intensity);
    return `rgba(${rgb}, ${newAlpha})`;
  });
};

export type ShadowElevation = keyof typeof shadows.elevation;
export type ShadowRarity = keyof typeof shadows.game.rarity;
export type ShadowMagic = keyof typeof shadows.game.magic;