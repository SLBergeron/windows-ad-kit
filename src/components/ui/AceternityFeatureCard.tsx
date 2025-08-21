"use client";

import React from 'react';
import { motion } from 'framer-motion';
// Using Unicode checkmark instead of lucide-react

interface FeatureCardProps {
  title: string;
  description: string;
  value?: string;
  included: boolean;
  upgrade?: boolean;
  icon?: string;
  features?: string[];
}

export const AceternityFeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  value,
  included,
  upgrade = false,
  icon,
  features = []
}) => {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div
        className={`
          relative overflow-hidden rounded-xl p-6 h-full
          backdrop-blur-sm border
          transition-all duration-300 ease-out
          ${upgrade 
            ? 'bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-amber-500/30 shadow-lg shadow-amber-500/10' 
            : 'bg-slate-900/70 border-slate-700/50 hover:border-slate-600/70'
          }
          group-hover:shadow-xl
          ${upgrade ? 'group-hover:shadow-amber-500/20' : 'group-hover:shadow-slate-900/30'}
        `}
      >
        {/* Status Badge */}
        <div className={`
          absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold
          ${included 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }
        `}>
          {included ? 'INCLUDED' : 'UPGRADE'}
        </div>

        {/* Icon */}
        {icon && (
          <div className="mb-4">
            <span className="text-4xl">{icon}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-slate-100 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Features List */}
        {features.length > 0 && (
          <div className="space-y-2 mb-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-green-400 text-sm mt-0.5 flex-shrink-0">✓</span>
                <span className="text-slate-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        )}

        {/* Value */}
        {value && (
          <div className="mt-auto pt-4">
            <div className={`
              inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm
              ${included 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }
            `}>
              {included ? '✓' : '💎'} {value}
            </div>
          </div>
        )}

        {/* Upgrade Card Special Background Effect */}
        {upgrade && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
      </div>
    </motion.div>
  );
};

export default AceternityFeatureCard;