"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { shadowTokens, glowEffects } from '../shared/utils';

interface LayoutGridCard {
  id: string;
  content: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface LayoutGridProps {
  cards: LayoutGridCard[];
  className?: string;
  columns?: {
    default: number;
    md?: number;
    lg?: number;
  };
}

/**
 * Layout Grid Component
 * Based on Aceternity UI with Windows Ad Kit theming and interactions
 */
export function LayoutGrid({ 
  cards, 
  className,
  columns = { default: 1, md: 2, lg: 3 }
}: LayoutGridProps) {
  const [selected, setSelected] = useState<LayoutGridCard | null>(null);
  const [lastSelected, setLastSelected] = useState<LayoutGridCard | null>(null);

  const handleClick = (card: LayoutGridCard) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  const getGridCols = () => {
    let classes = `grid-cols-${columns.default}`;
    if (columns.md) classes += ` md:grid-cols-${columns.md}`;
    if (columns.lg) classes += ` lg:grid-cols-${columns.lg}`;
    return classes;
  };

  const getSizeStyles = (size: LayoutGridCard['size'] = 'md') => {
    switch (size) {
      case 'sm':
        return 'col-span-1 row-span-1';
      case 'md':
        return 'col-span-1 row-span-1';
      case 'lg':
        return 'col-span-1 md:col-span-2 row-span-1';
      case 'xl':
        return 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  return (
    <div className={cn("w-full h-full p-6 max-w-7xl mx-auto relative", className)}>
      <div className={cn("grid gap-6 auto-rows-fr", getGridCols())}>
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            onClick={() => handleClick(card)}
            layoutId={`card-${card.id}`}
            className={cn(
              getSizeStyles(card.size),
              "cursor-pointer relative rounded-2xl overflow-hidden",
              "border border-slate-700/50 bg-slate-900/70 backdrop-blur-sm",
              "transition-all duration-300",
              card.className
            )}
            style={{
              boxShadow: selected?.id === card.id ? glowEffects.card.hover : glowEffects.card.default
            }}
            whileHover={{ 
              y: -2,
              boxShadow: glowEffects.card.hover
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: i * 0.1,
              ease: [0.2, 0.8, 0.2, 1]
            }}
          >
            {/* Card Content */}
            <div className="w-full h-full p-6 flex flex-col justify-between min-h-[200px]">
              {card.content}
            </div>

            {/* Selection indicator */}
            {selected?.id === card.id && (
              <motion.div
                className="absolute inset-0 border-2 border-red-500/50 rounded-2xl"
                layoutId="selection-border"
                transition={{ duration: 0.2 }}
              />
            )}

            {/* Glow effect overlay */}
            <div 
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at center, rgba(255, 107, 107, 0.1) 0%, transparent 70%)
                `
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Overlay for outside clicks when a card is selected */}
      {selected && (
        <motion.div
          onClick={handleOutsideClick}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Selected card expanded view */}
      {selected && (
        <motion.div
          layoutId={`card-${selected.id}`}
          className={cn(
            "fixed inset-4 md:inset-20 z-50 rounded-2xl overflow-hidden",
            "border border-slate-700/50 bg-slate-900/95 backdrop-blur-md",
            selected.className
          )}
          style={{
            boxShadow: `${shadowTokens.xl}, ${shadowTokens.brandHover}`
          }}
        >
          <div className="w-full h-full p-8 overflow-auto">
            {selected.content}
          </div>
          
          {/* Close button */}
          <button
            onClick={handleOutsideClick}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/80 transition-colors"
          >
            ×
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default LayoutGrid;