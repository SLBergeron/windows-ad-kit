"use client";

import React from 'react';
import { motion } from 'motion/react';
import { AceternityAuroraProps } from '../shared/types';
import { windowsAdKitTheme, generateAuroraKeyframes, a11yProps } from '../shared/utils';

/**
 * AceternityAurora - Subtle background light effect component
 * Provides organic, slow-moving light animation behind hero content
 */
export const AceternityAurora: React.FC<AceternityAuroraProps> = React.memo(({
  className = '',
  color = windowsAdKitTheme.colors.aurora.primary,
  size = 'md',
  intensity = 0.3
}) => {
  const keyframes = generateAuroraKeyframes(size);
  
  const auroraStyles = {
    container: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -2,
      opacity: intensity,
      pointerEvents: 'none' as const,
      overflow: 'hidden'
    },
    light1: {
      position: 'absolute' as const,
      top: '20%',
      left: '10%',
      width: '300px',
      height: '300px',
      background: `radial-gradient(circle, ${windowsAdKitTheme.colors.aurora.primary} 0%, transparent 70%)`,
      borderRadius: '50%',
      filter: 'blur(40px)'
    },
    light2: {
      position: 'absolute' as const,
      top: '60%',
      right: '15%',
      width: '400px',
      height: '400px',
      background: `radial-gradient(circle, ${windowsAdKitTheme.colors.aurora.secondary} 0%, transparent 70%)`,
      borderRadius: '50%',
      filter: 'blur(50px)'
    },
    light3: {
      position: 'absolute' as const,
      bottom: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '350px',
      height: '350px',
      background: `radial-gradient(circle, ${windowsAdKitTheme.colors.aurora.accent} 0%, transparent 70%)`,
      borderRadius: '50%',
      filter: 'blur(45px)'
    }
  };

  return (
    <div 
      className={`aceternity-aurora ${className}`}
      style={auroraStyles.container}
      {...a11yProps.decorative}
    >
      {/* Primary light source */}
      <motion.div
        style={auroraStyles.light1}
        animate={{
          transform: [
            'translate(0px, 0px) rotate(0deg)',
            'translate(30px, -30px) rotate(120deg)',
            'translate(-20px, 20px) rotate(240deg)',
            'translate(0px, 0px) rotate(360deg)'
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Secondary light source */}
      <motion.div
        style={auroraStyles.light2}
        animate={{
          transform: [
            'translate(0px, 0px) rotate(0deg)',
            'translate(-25px, 35px) rotate(90deg)',
            'translate(40px, -15px) rotate(180deg)',
            'translate(0px, 0px) rotate(270deg)'
          ]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
      />
      
      {/* Accent light source */}
      <motion.div
        style={auroraStyles.light3}
        animate={{
          transform: [
            'translate(-50%, 0px) rotate(0deg) scale(1)',
            'translate(-50%, -20px) rotate(45deg) scale(1.1)',
            'translate(-50%, 10px) rotate(90deg) scale(0.9)',
            'translate(-50%, 0px) rotate(135deg) scale(1)'
          ]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          delay: 10
        }}
      />
      
      {/* Additional ambient light for depth */}
      <motion.div
        style={{
          position: 'absolute' as const,
          top: '40%',
          left: '30%',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${windowsAdKitTheme.colors.aurora.primary} 0%, transparent 60%)`,
          borderRadius: '50%',
          filter: 'blur(60px)',
          opacity: 0.5
        }}
        animate={{
          opacity: [0.3, 0.7, 0.4, 0.6, 0.3],
          scale: [1, 1.2, 0.8, 1.1, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
});

AceternityAurora.displayName = 'AceternityAurora';

export default AceternityAurora;