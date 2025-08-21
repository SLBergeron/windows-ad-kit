"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Using Unicode symbols instead of lucide-react
import { CanvasRevealEffect } from './canvas-reveal-effect';

interface UpgradeCardProps {
  title: string;
  description: string;
  value: string;
  icon?: string;
  features: string[];
}

export const AceternityUpgradeCard: React.FC<UpgradeCardProps> = ({
  title,
  description,
  value,
  icon,
  features
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-xl h-full">
        {/* Canvas Reveal Effect Background */}
        <div className="absolute inset-0">
          <CanvasRevealEffect
            colors={[[245, 158, 11], [217, 119, 6], [255, 193, 7]]}
            dotSize={3}
            animationSpeed={0.4}
          />
        </div>

        {/* Animated Border Glow */}
        <div className="absolute inset-0 rounded-xl">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/50 via-orange-500/50 to-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
          <div className="absolute inset-[1px] rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-sm" />
        </div>

        {/* Card Content */}
        <div className="relative z-10 p-6 h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-xl border border-amber-500/30 backdrop-blur-sm">
          {/* Premium Badge */}
          <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <span className="text-xs">👑</span>
            <span className="text-xs font-semibold">PREMIUM</span>
          </div>

          {/* Icon with Special Effect */}
          {icon && (
            <div className="mb-4 relative">
              <motion.div
                className="text-4xl"
                animate={isHovered ? { rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {icon}
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}

          {/* Title with Gradient */}
          <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-amber-200 to-orange-300 bg-clip-text text-transparent">
            {title}
          </h3>

          {/* Description */}
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* Enhanced Features List */}
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              >
                <span className="mt-0.5 text-green-400 text-sm flex-shrink-0">✓</span>
                <span className="text-slate-300 text-sm flex-1">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Premium Value Badge */}
          <div className="mt-auto">
            <motion.div 
              className="relative overflow-hidden inline-flex items-center px-6 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-400 border border-amber-500/30"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="mr-2">👑</span>
              <span className="relative z-10">{value}</span>
            </motion.div>
          </div>

          {/* Shimmer Effect on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 -rotate-45 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AceternityUpgradeCard;