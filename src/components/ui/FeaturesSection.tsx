"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BentoGrid, BentoGridItem } from './bento-grid';
import { featuresData } from '../../data/featuresData';
import { GridBackground } from '../aceternity/backgrounds/GridBackground';

// Design tokens from Lemonbrand UI spec
const ease = [0.2, 0.8, 0.2, 1] as const;
const durations = { fast: 0.12, base: 0.24, slow: 0.42 };

// Feature Header Component for Bento Grid
const FeatureHeader = ({ icon, included, upgrade }: { icon?: string; included?: boolean; upgrade?: boolean }) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 relative overflow-hidden">
    {/* Icon display */}
    {icon && (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl opacity-20" role="img" aria-hidden="true">
          {icon}
        </span>
      </div>
    )}
    
    {/* Status badge */}
    <div className="absolute top-2 right-2">
      <div className={cn(
        "px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm",
        included 
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
          : upgrade 
            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
            : "bg-slate-500/20 text-slate-400 border-slate-500/30"
      )}>
        {included ? 'INCLUDED' : upgrade ? 'PREMIUM' : 'FEATURE'}
      </div>
    </div>

    {/* Gradient overlay for upgrade items */}
    {upgrade && (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/5" />
    )}
  </div>
);

// Feature Icon Component for Bento Grid
const FeatureIcon = ({ included, upgrade }: { included?: boolean; upgrade?: boolean }) => (
  <div className={cn(
    "h-4 w-4 rounded-full",
    included 
      ? "bg-emerald-500" 
      : upgrade 
        ? "bg-amber-500" 
        : "bg-slate-500"
  )} />
);

export function FeaturesSection() {
  return (
    <GridBackground variant="both" gridSize="md">
      {/* Section with proper UI spec styling */}
      <section 
        style={{
          // Section rhythm: py-12 mobile, py-16 md+ per spec
          paddingTop: '3rem', // py-12
          paddingBottom: '3rem',
          // Gutters: px-6 mobile, px-8 md+ per spec  
          paddingLeft: '1.5rem', // px-6
          paddingRight: '1.5rem',
          maxWidth: '80rem', // max-w-7xl per spec
          margin: '0 auto',
          width: '100%'
        }}
        className="md:py-16 md:px-8" // Responsive overrides
      >
        {/* Hero Frame following spec - Title (max 2 lines) + CTA */}
        <div 
          style={{
            textAlign: 'center',
            marginBottom: '2rem', // space-y-8 equivalent
            maxWidth: '56rem', // max-w-4xl
            margin: '0 auto 2rem auto'
          }}
        >
          <motion.h2 
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3rem)', // responsive text
              fontWeight: 700, // font-bold
              color: 'white',
              lineHeight: 1.1, // leading-tight per spec
              marginBottom: '1.5rem'
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: durations.slow, ease }}
          >
            What You Get for Just{' '}
            <span 
              style={{
                background: 'linear-gradient(to right, #ff6b6b, #ee5a24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              $295
            </span>
          </motion.h2>
          
          <motion.p 
            style={{
              fontSize: '1.25rem', // text-xl
              color: '#cbd5e1', // text-slate-300
              lineHeight: 1.6 // leading-relaxed per spec
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: durations.slow, ease, delay: 0.1 }}
          >
            <span style={{ textDecoration: 'line-through', color: '#64748b' }}>
              Usual price: $997
            </span>
          </motion.p>
        </div>

        {/* Bento Grid following Aceternity UI spec */}
        <BentoGrid className="max-w-7xl mx-auto">
          {featuresData.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={<FeatureHeader icon={item.icon} included={item.included} upgrade={item.upgrade} />}
              icon={<FeatureIcon included={item.included} upgrade={item.upgrade} />}
              className={item.upgrade ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </section>
      
      {/* Value Summary following spec patterns */}
      <section 
        style={{
          paddingLeft: '1.5rem', // px-6
          paddingRight: '1.5rem',
          maxWidth: '80rem', // max-w-7xl
          margin: '0 auto',
          paddingBottom: '3rem'
        }}
        className="md:px-8"
      >
        <motion.div 
          style={{
            maxWidth: '56rem', // max-w-4xl
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            borderRadius: '1rem', // rounded-2xl
            border: '1px solid rgba(51, 65, 85, 0.5)', // border-slate-700/50
            background: 'rgba(15, 23, 42, 0.7)', // bg-slate-900/70
            backdropFilter: 'blur(4px)', // backdrop-blur-sm
            padding: '2rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' // shadow-lg
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.slow, ease, delay: 0.6 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '1.5rem', color: '#94a3b8' }}>
              Total Package Value: <span style={{ textDecoration: 'line-through' }}>$997</span>
            </p>
            
            <h3 
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 3rem)',
                fontWeight: 700,
                background: 'linear-gradient(to right, #ff6b6b, #ee5a24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Your Investment Today: Only $295
            </h3>
            
            <div 
              style={{
                fontSize: '1.125rem',
                color: '#4ade80', // text-green-400
                fontWeight: 600,
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <span>💰 Save $702</span>
              <span>⚡ One-time payment</span>
              <span>🔒 Lifetime access</span>
            </div>
          </div>
          
          <div 
            style={{
              background: 'rgba(34, 197, 94, 0.1)', // bg-green-500/10
              border: '1px solid rgba(34, 197, 94, 0.3)', // border-green-500/30
              borderRadius: '0.75rem', // rounded-xl
              padding: '1rem',
              color: '#4ade80', // text-green-400
              lineHeight: 1.6 // leading-relaxed per spec
            }}
          >
            <p>
              🎯 <strong>Get started in 15 minutes</strong> • First leads within 72 hours • Complete template package included
            </p>
          </div>
        </motion.div>
      </section>
    </GridBackground>
  );
}

export default FeaturesSection;