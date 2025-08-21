"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AceternityFeatureCard } from './AceternityFeatureCard';
import { AceternityUpgradeCard } from './AceternityUpgradeCard';
import { featuresData } from '../../data/featuresData';

export const AceternityFeaturesSection: React.FC = () => {
  return (
    <section className="relative py-20 px-6">
      {/* Section Header */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          What You Get for Just{' '}
          <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            $295
          </span>
        </motion.h2>
        
        <motion.p 
          className="text-xl text-slate-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="line-through text-slate-500">Usual price: $997</span>
        </motion.p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, index) => 
            feature.upgrade ? (
              <AceternityUpgradeCard
                key={index}
                title={feature.title}
                description={feature.description}
                value={feature.value}
                icon={feature.icon}
                features={feature.features || []}
              />
            ) : (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AceternityFeatureCard
                  title={feature.title}
                  description={feature.description}
                  value={feature.value}
                  included={feature.included}
                  upgrade={feature.upgrade}
                  icon={feature.icon}
                  features={feature.features || []}
                />
              </motion.div>
            )
          )}
        </div>
      </div>

      {/* Value Summary */}
      <motion.div 
        className="mt-16 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <div className="mb-6">
            <span className="text-2xl text-slate-400 line-through">Total Package Value: $997</span>
          </div>
          
          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-6">
            Your Investment Today: Only $295
          </div>
          
          <div className="text-lg text-green-400 font-semibold mb-6">
            💰 Save $702 • ⚡ One-time payment • 🔒 Lifetime access
          </div>
          
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400">
            🎯 <strong>Get started in 15 minutes</strong> • First leads within 72 hours • Complete template package included
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AceternityFeaturesSection;