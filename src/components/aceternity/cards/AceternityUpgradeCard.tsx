"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { shadowTokens, glowEffects } from '../shared/utils';
import { CanvasRevealEffect } from '../../ui/canvas-reveal-effect';

// Design tokens from Lemonbrand UI spec
const ease = [0.2, 0.8, 0.2, 1] as const;
const durations = { fast: 0.12, base: 0.24, slow: 0.42 };

interface AceternityUpgradeCardProps {
  title: string;
  description: string;
  icon?: string;
  features?: string[];
  className?: string;
}

/**
 * Aceternity Upgrade Card Component
 * Premium card with Canvas Reveal Effect following UI spec
 */
export function AceternityUpgradeCard({ 
  title, 
  description, 
  icon, 
  features = [],
  className 
}: AceternityUpgradeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.slow, ease, delay: 0.3 }}
      whileHover={{ 
        y: -6,
        scale: 1.02
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "group relative rounded-2xl h-full overflow-hidden",
        "border border-amber-500/30",
        "transition-all duration-500 ease-out",
        className
      )}
      style={{
        boxShadow: `${shadowTokens.xl}, 0 0 30px rgba(245, 158, 11, 0.2)`
      }}
    >
      {/* Canvas Reveal Effect Background - Premium visual effect */}
      <div className="absolute inset-0">
        <CanvasRevealEffect
          colors={[[245, 158, 11], [217, 119, 6], [255, 193, 7]]}
          dotSize={2}
          animationSpeed={0.3}
        />
      </div>

      {/* Premium glow border effect */}
      <div className="absolute inset-0 rounded-2xl">
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(217, 119, 6, 0.3) 50%, rgba(245, 158, 11, 0.4) 100%)'
          }}
        />
        <div 
          className="absolute inset-[1px] rounded-2xl backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)'
          }}
        />
      </div>

      {/* Card content with proper z-index layering */}
      <div className={cn(
        "relative z-10 p-6 h-full backdrop-blur-sm",
        "bg-gradient-to-br from-slate-900/95 to-slate-800/90 rounded-2xl",
        "border border-amber-500/20",
        "shadow-2xl transition-all duration-300"
      )}>
        {/* Premium Badge */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 backdrop-blur-sm">
          <span className="text-xs text-amber-300" aria-hidden="true">👑</span>
          <span className="text-xs font-bold text-amber-300 tracking-wide">PREMIUM</span>
        </div>

        {/* Icon with premium hover effect */}
        {icon && (
          <motion.div 
            className="mb-6 relative"
            animate={isHovered ? { 
              rotate: [0, -3, 3, 0], 
              scale: [1, 1.1, 1] 
            } : {}}
            transition={{ duration: durations.slow }}
          >
            <span 
              className="text-5xl block" 
              role="img" 
              aria-hidden="true"
              style={{
                filter: 'drop-shadow(0 8px 16px rgba(245, 158, 11, 0.3))'
              }}
            >
              {icon}
            </span>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              style={{
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)'
              }}
            />
          </motion.div>
        )}

        {/* Title with premium gradient */}
        <h3 className={cn(
          "text-xl font-bold mb-4 leading-tight tracking-tight",
          "bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent"
        )}>
          {title}
        </h3>

        {/* Description following typography spec */}
        <p className={cn(
          "text-slate-300 text-sm mb-6",
          "leading-relaxed" // relaxed line height for body per spec
        )}>
          {description}
        </p>

        {/* Enhanced features list with premium styling */}
        {features.length > 0 && (
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: durations.base, 
                  delay: index * 0.1 + 0.2,
                  ease 
                }}
              >
                <span 
                  className="text-emerald-400 text-sm mt-0.5 flex-shrink-0 font-bold"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span className="text-slate-300 text-sm font-medium">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Premium value badge with enhanced styling */}
        <div className="mt-auto">
          <motion.div 
            className={cn(
              "relative overflow-hidden inline-flex items-center px-6 py-3 rounded-xl font-bold text-sm",
              "bg-gradient-to-r from-amber-500/20 to-yellow-600/20 text-amber-300",
              "border border-amber-500/40 backdrop-blur-sm",
              "hover:from-amber-500/30 hover:to-yellow-600/30",
              "transition-all duration-300"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: durations.fast }}
            style={{
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.2)'
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)'
              }}
            />
            <span className="mr-2 text-base" aria-hidden="true">👑</span>
            <span className="relative z-10 tracking-wide">Premium Add-On</span>
          </motion.div>
        </div>

        {/* Premium shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div 
            className="absolute inset-0 -rotate-45 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              width: '200%'
            }}
          />
        </div>

        {/* Animated border glow */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 50%, rgba(245, 158, 11, 0.2) 100%)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            padding: '2px'
          }}
        />
      </div>
    </motion.div>
  );
}

export default AceternityUpgradeCard;