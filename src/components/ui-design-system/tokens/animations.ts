// Animation Design Tokens
// Centralized animation system for Card Clash Legends Arena

export const animations = {
  // Timing Functions (Easing)
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Custom easing for game feel
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    
    // Game-specific easing
    cardFlip: 'cubic-bezier(0.23, 1, 0.32, 1)',
    magicCast: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    battleImpact: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Duration Scale
  duration: {
    instant: '0ms',
    fastest: '50ms',
    faster: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '800ms',
    crawl: '1000ms',
    
    // Game-specific durations
    cardFlip: '600ms',
    cardDraw: '400ms',
    spellCast: '800ms',
    battleAnimation: '1200ms',
    packOpening: '2000ms',
  },

  // Base Keyframes
  keyframes: {
    // Basic animations
    fadeIn: {
      '0%': { opacity: 0, transform: 'translateY(10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    fadeOut: {
      '0%': { opacity: 1, transform: 'translateY(0)' },
      '100%': { opacity: 0, transform: 'translateY(-10px)' },
    },
    slideIn: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(0)' },
    },
    slideOut: {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(100%)' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: 0 },
      '100%': { transform: 'scale(1)', opacity: 1 },
    },
    scaleOut: {
      '0%': { transform: 'scale(1)', opacity: 1 },
      '100%': { transform: 'scale(0.95)', opacity: 0 },
    },

    // Interactive animations
    bounce: {
      '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
      '40%, 43%': { transform: 'translate3d(0,-8px,0)' },
      '70%': { transform: 'translate3d(0,-4px,0)' },
      '90%': { transform: 'translate3d(0,-2px,0)' },
    },
    pulse: {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
    },
    shake: {
      '0%, 100%': { transform: 'translateX(0)' },
      '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
      '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
    },
    wiggle: {
      '0%, 100%': { transform: 'rotate(0deg)' },
      '25%': { transform: 'rotate(-3deg)' },
      '75%': { transform: 'rotate(3deg)' },
    },

    // Card-specific animations
    cardFlip: {
      '0%': { transform: 'perspective(1000px) rotateY(0deg)' },
      '50%': { transform: 'perspective(1000px) rotateY(90deg)' },
      '100%': { transform: 'perspective(1000px) rotateY(0deg)' },
    },
    cardHover: {
      '0%': { transform: 'translateY(0px) scale(1)' },
      '100%': { transform: 'translateY(-8px) scale(1.02)' },
    },
    cardDraw: {
      '0%': { 
        transform: 'scale(0.8) rotateY(-180deg) translateY(20px)',
        opacity: 0,
      },
      '60%': { 
        transform: 'scale(1.05) rotateY(0deg) translateY(-10px)',
        opacity: 1,
      },
      '100%': { 
        transform: 'scale(1) rotateY(0deg) translateY(0px)',
        opacity: 1,
      },
    },
    cardTilt: {
      '0%': { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' },
      '25%': { transform: 'perspective(1000px) rotateX(2deg) rotateY(2deg)' },
      '75%': { transform: 'perspective(1000px) rotateX(-2deg) rotateY(-2deg)' },
      '100%': { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' },
    },

    // Magical effects
    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
    glow: {
      '0%, 100%': { 
        filter: 'drop-shadow(0 0 10px currentColor)',
        transform: 'scale(1)',
      },
      '50%': { 
        filter: 'drop-shadow(0 0 20px currentColor) drop-shadow(0 0 30px currentColor)',
        transform: 'scale(1.02)',
      },
    },
    float: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    sparkle: {
      '0%, 100%': { 
        opacity: 1,
        transform: 'scale(1) rotate(0deg)',
      },
      '50%': { 
        opacity: 0.7,
        transform: 'scale(1.2) rotate(180deg)',
      },
    },

    // Rarity-specific effects
    holographic: {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },
    foilShine: {
      '0%, 100%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
    },
    divineAura: {
      '0%, 100%': {
        filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 60px rgba(245, 158, 11, 0.6))',
      },
      '50%': {
        filter: 'drop-shadow(0 0 50px rgba(251, 191, 36, 1)) drop-shadow(0 0 100px rgba(245, 158, 11, 0.8))',
      },
    },

    // UI feedback animations
    buttonPress: {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(0.95)' },
      '100%': { transform: 'scale(1)' },
    },
    successPulse: {
      '0%, 100%': { 
        boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)',
        transform: 'scale(1)',
      },
      '50%': { 
        boxShadow: '0 0 30px rgba(34, 197, 94, 0.6)',
        transform: 'scale(1.02)',
      },
    },
    errorShake: {
      '0%, 100%': { transform: 'translateX(0)' },
      '25%, 75%': { transform: 'translateX(-4px)' },
      '50%': { transform: 'translateX(4px)' },
    },

    // Loading animations
    spin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    dots: {
      '0%, 20%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.5)' },
      '80%, 100%': { transform: 'scale(1)' },
    },
    progress: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
  },

  // Preset animations (combining keyframes, duration, and easing)
  presets: {
    // Entrance animations
    entrance: {
      fadeIn: {
        keyframes: 'fadeIn',
        duration: '300ms',
        easing: 'easeOut',
        fillMode: 'both',
      },
      slideIn: {
        keyframes: 'slideIn',
        duration: '400ms',
        easing: 'easeOut',
        fillMode: 'both',
      },
      scaleIn: {
        keyframes: 'scaleIn',
        duration: '200ms',
        easing: 'elastic',
        fillMode: 'both',
      },
    },

    // Exit animations
    exit: {
      fadeOut: {
        keyframes: 'fadeOut',
        duration: '200ms',
        easing: 'easeIn',
        fillMode: 'both',
      },
      slideOut: {
        keyframes: 'slideOut',
        duration: '300ms',
        easing: 'easeIn',
        fillMode: 'both',
      },
      scaleOut: {
        keyframes: 'scaleOut',
        duration: '150ms',
        easing: 'easeIn',
        fillMode: 'both',
      },
    },

    // Interactive animations
    hover: {
      cardHover: {
        keyframes: 'cardHover',
        duration: '200ms',
        easing: 'easeOut',
        fillMode: 'forwards',
      },
      buttonHover: {
        keyframes: 'pulse',
        duration: '300ms',
        easing: 'easeInOut',
        fillMode: 'forwards',
      },
    },

    // Game animations
    game: {
      cardFlip: {
        keyframes: 'cardFlip',
        duration: '600ms',
        easing: 'cardFlip',
        fillMode: 'both',
      },
      cardDraw: {
        keyframes: 'cardDraw',
        duration: '800ms',
        easing: 'elastic',
        fillMode: 'both',
      },
      spellCast: {
        keyframes: 'glow',
        duration: '800ms',
        easing: 'magicCast',
        fillMode: 'both',
      },
    },

    // Feedback animations
    feedback: {
      success: {
        keyframes: 'successPulse',
        duration: '500ms',
        easing: 'easeInOut',
        fillMode: 'both',
      },
      error: {
        keyframes: 'errorShake',
        duration: '400ms',
        easing: 'easeInOut',
        fillMode: 'both',
      },
      loading: {
        keyframes: 'spin',
        duration: '1000ms',
        easing: 'linear',
        iterationCount: 'infinite',
      },
    },
  },
} as const;

// CSS Custom Properties Generator
export const generateAnimationVariables = () => {
  const variables: Record<string, string> = {};

  // Easing functions
  Object.entries(animations.easing).forEach(([key, value]) => {
    variables[`--ease-${key}`] = value;
  });

  // Durations
  Object.entries(animations.duration).forEach(([key, value]) => {
    variables[`--duration-${key}`] = value;
  });

  return variables;
};

// Utility function to create CSS animation string
export const createAnimation = (
  keyframes: string,
  duration: string = '300ms',
  easing: string = 'ease-out',
  delay: string = '0ms',
  iterationCount: string = '1',
  direction: string = 'normal',
  fillMode: string = 'both'
) => {
  return `${keyframes} ${duration} ${easing} ${delay} ${iterationCount} ${direction} ${fillMode}`;
};

// Get preset animation
export const getPresetAnimation = (category: keyof typeof animations.presets, name: string) => {
  const preset = (animations.presets[category] as any)?.[name];
  if (!preset) return undefined;
  
  return createAnimation(
    preset.keyframes,
    preset.duration,
    preset.easing,
    preset.delay || '0ms',
    preset.iterationCount || '1',
    preset.direction || 'normal',
    preset.fillMode || 'both'
  );
};

export type AnimationEasing = keyof typeof animations.easing;
export type AnimationDuration = keyof typeof animations.duration;
export type AnimationKeyframes = keyof typeof animations.keyframes;