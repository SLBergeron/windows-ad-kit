"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface GridBackgroundProps {
  children: React.ReactNode;
  className?: string;
  gridSize?: 'sm' | 'md' | 'lg';
  variant?: 'grid' | 'dot' | 'both';
}

/**
 * Grid and Dot Background Component
 * Based on Aceternity UI with Windows Ad Kit theming
 */
export function GridBackground({ 
  children, 
  className,
  gridSize = 'md',
  variant = 'grid'
}: GridBackgroundProps) {
  const gridSizes = {
    sm: '20px',
    md: '40px', 
    lg: '60px'
  };

  const size = gridSizes[gridSize];

  const getGridStyles = () => {
    switch (variant) {
      case 'grid':
        return {
          backgroundSize: `${size} ${size}`,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 107, 107, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 107, 107, 0.1) 1px, transparent 1px)
          `
        };
      case 'dot':
        return {
          backgroundSize: `${size} ${size}`,
          backgroundImage: `
            radial-gradient(circle, rgba(255, 107, 107, 0.15) 1px, transparent 1px)
          `
        };
      case 'both':
        return {
          backgroundSize: `${size} ${size}`,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 107, 107, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 107, 107, 0.08) 1px, transparent 1px),
            radial-gradient(circle, rgba(255, 107, 107, 0.1) 0.5px, transparent 0.5px)
          `
        };
      default:
        return {};
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Grid/Dot Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={getGridStyles()}
      />
      
      {/* Radial gradient overlay for fade effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at center, transparent 0%, rgba(10, 14, 39, 0.8) 100%)
          `
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default GridBackground;