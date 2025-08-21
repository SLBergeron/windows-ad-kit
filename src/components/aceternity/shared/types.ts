/**
 * Shared TypeScript interfaces for Aceternity UI components
 * Windows Ad Kit - Phase 1 Implementation
 */

export interface AceternityHeroHighlightProps {
  title: string;
  highlightText?: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
  backgroundEffect?: 'aurora' | 'beams' | 'both' | 'none';
  className?: string;
}

export interface AceternityAuroraProps {
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  intensity?: number; // 0-1 opacity multiplier
}

export interface AnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
}

export interface HeroAnimations {
  title: AnimationConfig;
  highlight: AnimationConfig;
  description: AnimationConfig;
  cta: AnimationConfig;
}

export interface WindowsAdKitTheme {
  colors: {
    brand: {
      primary: string;
      secondary: string;
      gradient: string;
    };
    background: {
      primary: string;
      secondary: string;
      surface: string;
    };
    aurora: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  typography: {
    fontFamily: string;
    hero: {
      title: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
        letterSpacing: string;
      };
      description: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
      };
    };
  };
}