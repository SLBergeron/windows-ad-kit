/**
 * Hero components export barrel
 * Windows Ad Kit - Phase 1 Implementation
 */

export { AceternityHeroHighlight } from './AceternityHeroHighlight';
export { AceternityAurora } from './AceternityAurora';
export { AceternityBackgroundBeams } from './AceternityBackgroundBeams';
export { AceternityBackgroundBeamsWithCollision } from './AceternityBackgroundBeamsWithCollision';
export { default as AceternityHeroHighlightDefault } from './AceternityHeroHighlight';
export { default as AceternityAuroraDefault } from './AceternityAurora';
export { default as AceternityBackgroundBeamsDefault } from './AceternityBackgroundBeams';
export { default as AceternityBackgroundBeamsWithCollisionDefault } from './AceternityBackgroundBeamsWithCollision';

// Re-export types for convenience
export type { 
  AceternityHeroHighlightProps, 
  AceternityAuroraProps 
} from '../shared/types';