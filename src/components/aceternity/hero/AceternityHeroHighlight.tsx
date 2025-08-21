"use client";

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { AceternityHeroHighlightProps } from '../shared/types';
import { 
  windowsAdKitTheme, 
  heroAnimations, 
  generateHeroStyles, 
  createMemoComparison,
  a11yProps,
  glowEffects 
} from '../shared/utils';
import { AceternityAurora } from './AceternityAurora';
import { AceternityBackgroundBeams } from './AceternityBackgroundBeams';
import { AceternityBackgroundBeamsWithCollision } from './AceternityBackgroundBeamsWithCollision';

/**
 * AceternityHeroHighlight - Modern hero section component
 * Replaces verbose Once UI hero sections with clean, performant Aceternity implementation
 */
export const AceternityHeroHighlight: React.FC<AceternityHeroHighlightProps> = React.memo(({
  title,
  highlightText,
  description,
  ctaText,
  onCtaClick,
  backgroundEffect = 'aurora',
  className = ''
}) => {
  // Memoize styles to prevent unnecessary recalculations
  const styles = useMemo(() => generateHeroStyles(backgroundEffect), [backgroundEffect]);
  
  // Split title for animation if highlight text exists
  const { mainTitle, highlightTitle } = useMemo(() => {
    if (highlightText) {
      return { mainTitle: title, highlightTitle: highlightText };
    }
    return { mainTitle: title, highlightTitle: null };
  }, [title, highlightText]);

  return (
    <section 
      className={`aceternity-hero-highlight ${className}`}
      style={styles.section}
      {...a11yProps.hero}
    >
      {/* Background effects - Only render if specified (per UI spec: content must remain legible with effects off) */}
      {backgroundEffect === 'aurora' && <AceternityAurora intensity={0.7} />}
      {backgroundEffect === 'beams' && <AceternityBackgroundBeamsWithCollision />}
      {backgroundEffect === 'both' && (
        <>
          <AceternityAurora intensity={0.7} />
          <AceternityBackgroundBeamsWithCollision />
        </>
      )}
      
      {/* Hero content */}
      <div style={styles.content}>
        {/* Hero title with optional highlight */}
        <motion.h1 
          style={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: heroAnimations.title.duration,
            ease: heroAnimations.title.ease,
            delay: heroAnimations.title.delay
          }}
        >
          {mainTitle}
          {highlightTitle && (
            <>
              <br />
              <motion.span 
                style={styles.highlight}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: heroAnimations.highlight.duration,
                  ease: heroAnimations.highlight.ease,
                  delay: heroAnimations.highlight.delay
                }}
              >
                {highlightTitle}
              </motion.span>
            </>
          )}
        </motion.h1>
        
        {/* Hero description */}
        <motion.p 
          style={styles.description}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: heroAnimations.description.duration,
            ease: heroAnimations.description.ease,
            delay: heroAnimations.description.delay
          }}
        >
          {description}
        </motion.p>
        
        {/* Call to action button */}
        <motion.button
          style={styles.cta}
          onClick={onCtaClick}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: heroAnimations.cta.duration,
            ease: heroAnimations.cta.ease,
            delay: heroAnimations.cta.delay
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: glowEffects.button.hover
          }}
          whileTap={{ scale: 0.98 }}
          {...a11yProps.cta}
        >
          {ctaText}
        </motion.button>
      </div>
    </section>
  );
}, createMemoComparison<AceternityHeroHighlightProps>([
  'title', 
  'highlightText', 
  'description', 
  'ctaText', 
  'backgroundEffect'
]));

AceternityHeroHighlight.displayName = 'AceternityHeroHighlight';

export default AceternityHeroHighlight;