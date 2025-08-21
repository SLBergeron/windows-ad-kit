"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { shadowTokens, glowEffects } from '../shared/utils';

// Design tokens from Lemonbrand UI spec
const ease = [0.2, 0.8, 0.2, 1] as const;
const durations = { fast: 0.12, base: 0.24, slow: 0.42 };

interface AceternityFeatureCardProps {
  title: string;
  description: string;
  icon?: string;
  included: boolean;
  features?: string[];
  className?: string;
}

/**
 * Aceternity Feature Card Component
 * Following UI spec: Card: rounded-2xl border bg-[--lb-bg-elev-1] shadow-[--lb-shadow-2] with hover:shadow-[--lb-shadow-3]
 */
export function AceternityFeatureCard({ 
  title, 
  description, 
  icon, 
  included, 
  features = [],
  className 
}: AceternityFeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.base, ease }}
      whileHover={{ 
        y: -4,
        boxShadow: glowEffects.card.hover
      }}
      className={cn(
        // Base card styling per UI spec
        "rounded-2xl border relative overflow-hidden p-6 h-full group",
        // Background and surface tokens per spec
        "bg-slate-900/90 border-slate-700/50",
        // Shadow tokens per spec: --lb-shadow-2 default, --lb-shadow-3 on hover
        "shadow-lg hover:shadow-xl backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        className
      )}
      style={{
        // Using proper shadow tokens per UI spec
        boxShadow: shadowTokens.md
      }}
    >
      {/* Hover glow effect per spec: Interactive magnetic/hover effects allowed for marketing */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, rgba(255, 107, 107, 0.1) 0%, transparent 70%)`
        }}
      />

      {/* Status Badge following design system */}
      <div className={cn(
        "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium border",
        "backdrop-blur-sm transition-colors duration-200",
        included 
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
          : "bg-amber-500/20 text-amber-400 border-amber-500/30"
      )}>
        {included ? 'INCLUDED' : 'UPGRADE'}
      </div>

      {/* Icon with enhanced animation */}
      {icon && (
        <motion.div 
          className="mb-6 relative"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ duration: durations.fast }}
        >
          <span 
            className="text-5xl block" 
            role="img" 
            aria-hidden="true"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }}
          >
            {icon}
          </span>
        </motion.div>
      )}

      {/* Title following typography spec */}
      <h3 className={cn(
        "text-xl font-semibold text-white mb-4",
        "leading-tight tracking-tight" // tight line height for headings per spec
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

      {/* Features list with enhanced styling */}
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
                delay: index * 0.05,
                ease 
              }}
            >
              <span 
                className="text-emerald-400 text-sm mt-0.5 flex-shrink-0 font-medium"
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

      {/* Value indicator with enhanced styling */}
      <div className="mt-auto">
        <motion.div 
          className={cn(
            "inline-flex items-center px-4 py-3 rounded-xl font-medium text-sm",
            "border backdrop-blur-sm transition-all duration-200",
            "hover:scale-105 cursor-default",
            included 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20" 
              : "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/20"
          )}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: durations.fast }}
          style={{
            boxShadow: included 
              ? '0 4px 12px rgba(16, 185, 129, 0.15)' 
              : '0 4px 12px rgba(245, 158, 11, 0.15)'
          }}
        >
          <span className="mr-2 text-base" aria-hidden="true">
            {included ? '✓' : '💎'}
          </span>
          <span className="font-semibold">
            {included ? 'Included for $295' : 'Premium Add-On'}
          </span>
        </motion.div>
      </div>

      {/* Subtle border glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(238, 90, 36, 0.05) 100%)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          padding: '1px'
        }}
      />
    </motion.div>
  );
}

export default AceternityFeatureCard;