/**
 * Utility functions for Aceternity UI components
 * Windows Ad Kit - Phase 1 Implementation
 */

import { WindowsAdKitTheme, HeroAnimations } from './types';

/**
 * Windows Ad Kit brand theme configuration
 */
export const windowsAdKitTheme: WindowsAdKitTheme = {
  colors: {
    brand: {
      primary: '#ff6b6b',
      secondary: '#ee5a24',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
    },
    background: {
      primary: '#0a0e27',
      secondary: '#1a1f3a',
      surface: '#2d3561'
    },
    aurora: {
      primary: 'rgba(255, 107, 107, 0.2)',
      secondary: 'rgba(238, 90, 36, 0.16)',
      accent: 'rgba(16, 185, 129, 0.12)'
    }
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    hero: {
      title: {
        fontSize: 'clamp(3rem, 8vw, 5.5rem)',
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: '-0.02em'
      },
      description: {
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: 1.6
      }
    }
  }
};

/**
 * Default animation configurations for hero components
 */
export const heroAnimations: HeroAnimations = {
  title: {
    duration: 0.8,
    ease: "easeOut",
    delay: 0.1
  },
  highlight: {
    duration: 1.2,
    ease: "easeInOut",
    delay: 0.5
  },
  description: {
    duration: 0.8,
    ease: "easeOut",
    delay: 0.3
  },
  cta: {
    duration: 0.6,
    ease: "easeOut",
    delay: 0.6
  }
};

/**
 * Generate CSS-in-JS styles for hero components
 */
export const generateHeroStyles = (backgroundEffect: string = 'aurora') => ({
  section: {
    position: 'relative' as const,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 1.5rem',
    overflow: 'hidden',
    background: windowsAdKitTheme.colors.background.primary
  },
  content: {
    textAlign: 'center' as const,
    maxWidth: '1200px',
    margin: '0 auto',
    zIndex: 10,
    position: 'relative' as const
  },
  title: {
    fontFamily: windowsAdKitTheme.typography.fontFamily,
    fontSize: windowsAdKitTheme.typography.hero.title.fontSize,
    fontWeight: windowsAdKitTheme.typography.hero.title.fontWeight,
    lineHeight: windowsAdKitTheme.typography.hero.title.lineHeight,
    letterSpacing: windowsAdKitTheme.typography.hero.title.letterSpacing,
    color: 'white',
    marginBottom: '1.5rem'
  },
  highlight: {
    background: windowsAdKitTheme.colors.brand.gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'inline-block'
  },
  description: {
    fontFamily: windowsAdKitTheme.typography.fontFamily,
    fontSize: windowsAdKitTheme.typography.hero.description.fontSize,
    fontWeight: windowsAdKitTheme.typography.hero.description.fontWeight,
    lineHeight: windowsAdKitTheme.typography.hero.description.lineHeight,
    color: '#a0a9c0',
    maxWidth: '32rem',
    margin: '0 auto 2.5rem auto'
  },
  cta: {
    background: windowsAdKitTheme.colors.brand.gradient,
    border: 'none',
    borderRadius: '25px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    // Using proper shadow tokens per UI spec
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 10px 30px rgba(255, 107, 107, 0.3)'
  }
});

/**
 * Performance optimization utility for component memoization
 */
export const createMemoComparison = <T extends Record<string, any>>(keys: (keyof T)[]) => {
  return (prevProps: T, nextProps: T): boolean => {
    return keys.every(key => prevProps[key] === nextProps[key]);
  };
};

/**
 * Responsive breakpoint utilities
 */
export const breakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  large: 1200
};

export const createMediaQuery = (minWidth: number): string => {
  return `@media (min-width: ${minWidth}px)`;
};

/**
 * Aurora animation keyframes generator
 */
export const generateAuroraKeyframes = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const movements = {
    sm: { x: 20, y: 20 },
    md: { x: 30, y: 30 },
    lg: { x: 40, y: 40 }
  };
  
  const { x, y } = movements[size];
  
  return {
    "0%": { transform: `translate(0px, 0px) rotate(0deg)` },
    "33%": { transform: `translate(${x}px, -${y}px) rotate(120deg)` },
    "66%": { transform: `translate(-${x * 0.7}px, ${y * 0.7}px) rotate(240deg)` },
    "100%": { transform: `translate(0px, 0px) rotate(360deg)` }
  };
};

/**
 * Shadow tokens per UI spec: --lb-shadow-1 (sm), --lb-shadow-2 (md), --lb-shadow-3 (xl, colored)
 * Following spec: "Prefer drop shadows over blurs"
 */
export const shadowTokens = {
  // --lb-shadow-1 (sm)
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  // --lb-shadow-2 (md) 
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  // --lb-shadow-3 (xl, colored) - with brand color for interactive elements
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  // Colored shadows for brand elements
  brand: '0 10px 30px rgba(255, 107, 107, 0.3)',
  brandHover: '0 15px 40px rgba(255, 107, 107, 0.4)'
};

/**
 * Glow effects per UI spec for interactive elements
 */
export const glowEffects = {
  button: {
    default: shadowTokens.md,
    hover: `${shadowTokens.xl}, ${shadowTokens.brandHover}`,
    focus: `0 0 0 2px #ff6b6b, 0 0 0 4px rgba(255, 107, 107, 0.2)`
  },
  card: {
    default: shadowTokens.md,
    hover: `${shadowTokens.xl}, ${shadowTokens.brand}`
  }
};

/**
 * Accessibility utilities
 */
export const a11yProps = {
  hero: {
    role: 'banner',
    'aria-label': 'Hero section'
  },
  cta: {
    role: 'button',
    'aria-label': 'Call to action button'
  },
  decorative: {
    'aria-hidden': 'true',
    role: 'presentation'
  }
};