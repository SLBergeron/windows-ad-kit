/**
 * Windows Ad Kit UI Components
 * Export all custom UI components with Once UI integration
 */

export { WindowsAdKitProvider, useWindowsAdKitTheme, brandStyles } from './WindowsAdKitProvider'
export { BrandButton } from './BrandButton'
export { BrandCard } from './BrandCard'
export { BrandInput, BrandTextarea, BrandSelect } from './BrandInput'
export { Navigation } from './Navigation'
export { FloatingNavbar } from './FloatingNavbar'
export { default as FloatingNavbarDemo } from './FloatingNavbarDemo'
export { BackgroundBeams } from './BackgroundBeams'
export { AppleCarousel } from './AppleCarousel'
export { CardSpotlight } from './CardSpotlight'
export { AceternityBackgroundBeams } from './AceternityBackgroundBeams'
export { AceternityCarousel, AceternityCard } from './AceternityAppleCarousel'
export { AceternityCardSpotlight } from './AceternityCardSpotlight'
export { AceternityFeatureCard } from './AceternityFeatureCard'
export { AceternityFeaturesSection } from './AceternityFeaturesSection'
export { AceternityUpgradeCard } from './AceternityUpgradeCard'
export { FeatureCard } from './FeatureCard'
export { UpgradeCard } from './UpgradeCard'
export { FeaturesSection } from './FeaturesSection'
export { CanvasRevealEffect } from './canvas-reveal-effect'
export { Footer } from './Footer'

// Phase 1: New Aceternity Hero Components
export * from '../aceternity'

// Re-export theme configuration
export { windowsAdKitTheme, componentOverrides } from '../../config/once-ui.config'
export type { WindowsAdKitTheme, ComponentOverrides } from '../../config/once-ui.config'