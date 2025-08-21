"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { shadowTokens, glowEffects } from '../aceternity/shared/utils';

// Design tokens from Lemonbrand UI spec
const ease = [0.2, 0.8, 0.2, 1] as const;
const durations = { fast: 0.12, base: 0.24, slow: 0.42 };

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
  included: boolean;
  features?: string[];
  className?: string;
}

export function FeatureCard({ 
  title, 
  description, 
  icon, 
  included, 
  features = [],
  className 
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.base, ease }}
      whileHover={{ 
        y: -2,
        boxShadow: glowEffects.card.hover
      }}
      className={cn(
        // Base card styling per spec: rounded-2xl border bg-[--lb-bg-elev-1] shadow-[--lb-shadow-2]
        "rounded-2xl border bg-slate-900/70 backdrop-blur-sm p-6 h-full relative overflow-hidden",
        "border-slate-700/50 transition-all duration-240",
        "hover:border-slate-600/70",
        className
      )}
      style={{
        boxShadow: glowEffects.card.default
      }}
    >
      {/* Badge - Following spec for status indication */}
      <div className={cn(
        "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium",
        included 
          ? "bg-green-500/20 text-green-400 border border-green-500/30" 
          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
      )}>
        {included ? 'INCLUDED' : 'UPGRADE'}
      </div>

      {/* Icon - Optional decorative element */}
      {icon && (
        <div className="mb-4">
          <span className="text-4xl" role="img" aria-hidden="true">
            {icon}
          </span>
        </div>
      )}

      {/* Title - Max 2 lines per spec */}
      <h3 className="text-xl font-semibold text-white mb-3 leading-tight">
        {title}
      </h3>

      {/* Description - Guaranteed <120 characters */}
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        {description}
      </p>

      {/* Features list with checkmarks */}
      {features.length > 0 && (
        <div className="space-y-2 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span 
                className="text-green-400 text-sm mt-0.5 flex-shrink-0" 
                aria-hidden="true"
              >
                ✓
              </span>
              <span className="text-slate-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* Value indicator */}
      <div className="mt-auto pt-4">
        <div className={cn(
          "inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors",
          included 
            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
        )}>
          <span className="mr-2" aria-hidden="true">
            {included ? '✓' : '💎'}
          </span>
          {included ? 'Included for $295' : 'Premium Add-On'}
        </div>
      </div>
    </motion.div>
  );
}

export default FeatureCard;