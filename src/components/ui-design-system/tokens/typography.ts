// Typography Design Tokens
// Centralized typography system for Card Clash Legends Arena

export const typography = {
  // Font Families
  fonts: {
    primary: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    display: ['Playfair Display', 'Georgia', 'serif'],
    fantasy: ['Cinzel', 'Times New Roman', 'serif'],
    mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
  },

  // Font Weights
  weights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Font Sizes (rem values)
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem',    // 128px
  },

  // Line Heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text Styles (Preset combinations)
  styles: {
    // Headings
    h1: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-5xl)',
      fontWeight: 'var(--font-bold)',
      lineHeight: 'var(--leading-tight)',
      letterSpacing: 'var(--tracking-tight)',
    },
    h2: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-4xl)',
      fontWeight: 'var(--font-semibold)',
      lineHeight: 'var(--leading-tight)',
      letterSpacing: 'var(--tracking-tight)',
    },
    h3: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-3xl)',
      fontWeight: 'var(--font-semibold)',
      lineHeight: 'var(--leading-snug)',
    },
    h4: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--font-semibold)',
      lineHeight: 'var(--leading-snug)',
    },
    h5: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--font-medium)',
      lineHeight: 'var(--leading-snug)',
    },
    h6: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--font-medium)',
      lineHeight: 'var(--leading-normal)',
    },

    // Body Text
    body: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--font-normal)',
      lineHeight: 'var(--leading-normal)',
    },
    bodyLarge: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--font-normal)',
      lineHeight: 'var(--leading-relaxed)',
    },
    bodySmall: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-normal)',
      lineHeight: 'var(--leading-normal)',
    },

    // UI Text
    button: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-medium)',
      lineHeight: 'var(--leading-none)',
      letterSpacing: 'var(--tracking-wide)',
    },
    caption: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--font-normal)',
      lineHeight: 'var(--leading-normal)',
      letterSpacing: 'var(--tracking-wide)',
    },
    label: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-medium)',
      lineHeight: 'var(--leading-none)',
    },

    // Game-Specific Styles
    cardTitle: {
      fontFamily: 'var(--font-fantasy)',
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--font-semibold)',
      lineHeight: 'var(--leading-tight)',
      letterSpacing: 'var(--tracking-wide)',
    },
    cardDescription: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-normal)',
      lineHeight: 'var(--leading-snug)',
    },
    statValue: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--font-bold)',
      lineHeight: 'var(--leading-none)',
    },
    rarity: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--font-semibold)',
      lineHeight: 'var(--leading-none)',
      letterSpacing: 'var(--tracking-widest)',
      textTransform: 'uppercase' as const,
    },

    // Special Effects
    glow: {
      textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
    },
    embossed: {
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
    },
    outline: {
      textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
    },
  },

  // Responsive Typography Scale
  responsive: {
    mobile: {
      h1: 'var(--text-3xl)',
      h2: 'var(--text-2xl)',
      h3: 'var(--text-xl)',
      h4: 'var(--text-lg)',
      body: 'var(--text-sm)',
    },
    tablet: {
      h1: 'var(--text-4xl)',
      h2: 'var(--text-3xl)',
      h3: 'var(--text-2xl)',
      h4: 'var(--text-xl)',
      body: 'var(--text-base)',
    },
    desktop: {
      h1: 'var(--text-5xl)',
      h2: 'var(--text-4xl)',
      h3: 'var(--text-3xl)',
      h4: 'var(--text-2xl)',
      body: 'var(--text-base)',
    },
  },
} as const;

// CSS Custom Properties Generator
export const generateTypographyVariables = () => {
  const variables: Record<string, string> = {};

  // Font families
  Object.entries(typography.fonts).forEach(([key, value]) => {
    variables[`--font-${key}`] = Array.isArray(value) ? value.join(', ') : value;
  });

  // Font weights
  Object.entries(typography.weights).forEach(([key, value]) => {
    variables[`--font-${key}`] = value.toString();
  });

  // Font sizes
  Object.entries(typography.sizes).forEach(([key, value]) => {
    variables[`--text-${key}`] = value;
  });

  // Line heights
  Object.entries(typography.lineHeights).forEach(([key, value]) => {
    variables[`--leading-${key}`] = value.toString();
  });

  // Letter spacing
  Object.entries(typography.letterSpacing).forEach(([key, value]) => {
    variables[`--tracking-${key}`] = value;
  });

  return variables;
};

// Utility function to apply text styles
export const applyTextStyle = (styleName: keyof typeof typography.styles) => {
  return typography.styles[styleName];
};

export type TypographyStyle = keyof typeof typography.styles;
export type FontFamily = keyof typeof typography.fonts;
export type FontWeight = keyof typeof typography.weights;
export type FontSize = keyof typeof typography.sizes;