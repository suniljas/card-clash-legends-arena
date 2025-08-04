// Spacing Design Tokens
// Centralized spacing system for Card Clash Legends Arena

export const spacing = {
  // Base spacing scale (rem values)
  scale: {
    0: '0rem',
    px: '0.0625rem',   // 1px
    0.5: '0.125rem',   // 2px
    1: '0.25rem',      // 4px
    1.5: '0.375rem',   // 6px
    2: '0.5rem',       // 8px
    2.5: '0.625rem',   // 10px
    3: '0.75rem',      // 12px
    3.5: '0.875rem',   // 14px
    4: '1rem',         // 16px
    5: '1.25rem',      // 20px
    6: '1.5rem',       // 24px
    7: '1.75rem',      // 28px
    8: '2rem',         // 32px
    9: '2.25rem',      // 36px
    10: '2.5rem',      // 40px
    11: '2.75rem',     // 44px
    12: '3rem',        // 48px
    14: '3.5rem',      // 56px
    16: '4rem',        // 64px
    20: '5rem',        // 80px
    24: '6rem',        // 96px
    28: '7rem',        // 112px
    32: '8rem',        // 128px
    36: '9rem',        // 144px
    40: '10rem',       // 160px
    44: '11rem',       // 176px
    48: '12rem',       // 192px
    52: '13rem',       // 208px
    56: '14rem',       // 224px
    60: '15rem',       // 240px
    64: '16rem',       // 256px
    72: '18rem',       // 288px
    80: '20rem',       // 320px
    96: '24rem',       // 384px
  },

  // Semantic spacing (mapped to scale)
  semantic: {
    // Padding
    padding: {
      none: '0rem',
      xs: '0.25rem',     // 4px
      sm: '0.5rem',      // 8px
      md: '1rem',        // 16px
      lg: '1.5rem',      // 24px
      xl: '2rem',        // 32px
      '2xl': '3rem',     // 48px
      '3xl': '4rem',     // 64px
    },

    // Margins
    margin: {
      none: '0rem',
      xs: '0.25rem',     // 4px
      sm: '0.5rem',      // 8px
      md: '1rem',        // 16px
      lg: '1.5rem',      // 24px
      xl: '2rem',        // 32px
      '2xl': '3rem',     // 48px
      '3xl': '4rem',     // 64px
    },

    // Gaps (for flexbox/grid)
    gap: {
      none: '0rem',
      xs: '0.25rem',     // 4px
      sm: '0.5rem',      // 8px
      md: '1rem',        // 16px
      lg: '1.5rem',      // 24px
      xl: '2rem',        // 32px
      '2xl': '3rem',     // 48px
    },
  },

  // Component-specific spacing
  components: {
    // Card spacing
    card: {
      padding: '1.5rem',        // 24px
      gap: '1rem',              // 16px
      margin: '0.5rem',         // 8px
    },

    // Button spacing
    button: {
      paddingX: {
        sm: '0.75rem',          // 12px
        md: '1rem',             // 16px
        lg: '1.5rem',           // 24px
        xl: '2rem',             // 32px
      },
      paddingY: {
        sm: '0.375rem',         // 6px
        md: '0.5rem',           // 8px
        lg: '0.75rem',          // 12px
        xl: '1rem',             // 16px
      },
      gap: '0.5rem',            // 8px
    },

    // Form spacing
    form: {
      fieldGap: '1rem',         // 16px
      labelGap: '0.25rem',      // 4px
      groupGap: '1.5rem',       // 24px
    },

    // Navigation spacing
    navigation: {
      itemPadding: '0.75rem',   // 12px
      itemGap: '0.5rem',        // 8px
      sectionGap: '2rem',       // 32px
    },

    // Game-specific spacing
    game: {
      cardGap: '1rem',          // 16px
      deckPadding: '1.5rem',    // 24px
      battlefieldGap: '2rem',   // 32px
      handCardGap: '0.5rem',    // 8px
      statSpacing: '0.75rem',   // 12px
    },
  },

  // Layout spacing (for major page sections)
  layout: {
    containerPadding: {
      mobile: '1rem',           // 16px
      tablet: '2rem',           // 32px
      desktop: '3rem',          // 48px
    },
    sectionGap: {
      small: '2rem',            // 32px
      medium: '4rem',           // 64px
      large: '6rem',            // 96px
    },
    headerHeight: '4rem',       // 64px
    footerHeight: '3rem',       // 48px
    sidebarWidth: '16rem',      // 256px
  },

  // Responsive spacing breakpoints
  responsive: {
    mobile: {
      padding: '1rem',
      margin: '0.5rem',
      gap: '0.75rem',
    },
    tablet: {
      padding: '1.5rem',
      margin: '1rem',
      gap: '1rem',
    },
    desktop: {
      padding: '2rem',
      margin: '1.5rem',
      gap: '1.5rem',
    },
  },
} as const;

// CSS Custom Properties Generator
export const generateSpacingVariables = () => {
  const variables: Record<string, string> = {};

  // Base scale
  Object.entries(spacing.scale).forEach(([key, value]) => {
    variables[`--space-${key}`] = value;
  });

  // Semantic spacing
  Object.entries(spacing.semantic.padding).forEach(([key, value]) => {
    variables[`--padding-${key}`] = value;
  });

  Object.entries(spacing.semantic.margin).forEach(([key, value]) => {
    variables[`--margin-${key}`] = value;
  });

  Object.entries(spacing.semantic.gap).forEach(([key, value]) => {
    variables[`--gap-${key}`] = value;
  });

  // Component spacing
  Object.entries(spacing.components).forEach(([component, values]) => {
    if (typeof values === 'object' && values !== null) {
      Object.entries(values).forEach(([property, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([size, sizeValue]) => {
            variables[`--${component}-${property}-${size}`] = sizeValue;
          });
        } else {
          variables[`--${component}-${property}`] = value as string;
        }
      });
    }
  });

  // Layout spacing
  Object.entries(spacing.layout).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        variables[`--layout-${key}-${subKey}`] = subValue;
      });
    } else {
      variables[`--layout-${key}`] = value;
    }
  });

  return variables;
};

// Utility functions
export const getSpacing = (key: keyof typeof spacing.scale) => {
  return spacing.scale[key];
};

export const getComponentSpacing = (component: keyof typeof spacing.components, property: string) => {
  const componentSpacing = spacing.components[component];
  if (componentSpacing && typeof componentSpacing === 'object') {
    return (componentSpacing as any)[property];
  }
  return undefined;
};

export type SpacingScale = keyof typeof spacing.scale;
export type SemanticSpacing = keyof typeof spacing.semantic.padding;
export type ComponentSpacing = keyof typeof spacing.components;