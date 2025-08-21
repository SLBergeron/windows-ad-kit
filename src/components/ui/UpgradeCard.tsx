"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CanvasRevealEffect } from './canvas-reveal-effect';

// Design tokens from Lemonbrand UI spec
const ease = [0.2, 0.8, 0.2, 1] as const;
const durations = { fast: 0.12, base: 0.24, slow: 0.42 };

interface UpgradeCardProps {
  title: string;
  description: string;
  icon?: string;
  features?: string[];
  className?: string;
}

export function UpgradeCard({ 
  title, 
  description, 
  icon, 
  features = [],
  className 
}: UpgradeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.slow, ease, delay: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "group relative rounded-2xl h-full overflow-hidden",
        className
      )}
    >
      {/* Canvas Reveal Effect Background - Special effect for upgrade only */}
      <div className="absolute inset-0">
        <CanvasRevealEffect
          colors={[[245, 158, 11], [217, 119, 6], [255, 193, 7]]}
          dotSize={2}
          animationSpeed={0.3}
        />
      </div>

      {/* Enhanced border glow effect */}
      <div className="absolute inset-0 rounded-2xl">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-420 blur-sm" />
        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 backdrop-blur-sm" />
      </div>

      {/* Card content with proper z-index layering */}
      <div className={cn(
        "relative z-10 p-6 h-full",
        "bg-gradient-to-br from-slate-900/95 to-slate-800/95 rounded-2xl",
        "border border-amber-500/40 backdrop-blur-sm",
        "shadow-lg hover:shadow-2xl transition-all duration-240"
      )}>
        {/* Premium Badge */}
        <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <span className="text-xs" aria-hidden="true">👑</span>
          <span className="text-xs font-semibold">PREMIUM</span>
        </div>

        {/* Icon with special hover effect */}
        {icon && (
          <div className="mb-4 relative">
            <motion.div
              className="text-4xl"
              animate={isHovered ? { rotate: [0, -3, 3, 0], scale: [1, 1.05, 1] } : {}}
              transition={{ duration: durations.slow }}
              role="img"
              aria-hidden="true"
            >
              {icon}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-240" />
          </div>
        )}

        {/* Title with gradient - Following spec guidelines */}
        <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-amber-200 to-orange-300 bg-clip-text text-transparent leading-tight">
          {title}
        </h3>

        {/* Description - Guaranteed <120 characters */}
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Enhanced features list with staggered animation */}
        {features.length > 0 && (
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: durations.base, delay: index * 0.1 + 0.2 }}
              >
                <span 
                  className="mt-0.5 text-green-400 text-sm flex-shrink-0"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span className="text-slate-300 text-sm flex-1">{feature}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Premium value badge with hover effect */}
        <div className="mt-auto">
          <motion.div 
            className="relative overflow-hidden inline-flex items-center px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-400 border border-amber-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: durations.fast }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-240" />
            <span className="mr-2" aria-hidden="true">👑</span>
            <span className="relative z-10">Premium Add-On</span>
          </motion.div>
        </div>

        {/* Shimmer effect on hover - Decorative per spec */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 -rotate-45 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
}

export default UpgradeCard;