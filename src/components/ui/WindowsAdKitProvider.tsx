'use client'

import React, { ReactNode } from 'react'
import { windowsAdKitTheme, componentOverrides } from '../../config/once-ui.config'

interface WindowsAdKitProviderProps {
  children: ReactNode
}

/**
 * Windows Ad Kit Theme Provider
 * Provides the custom red gradient theme context to Once UI components
 */
export function WindowsAdKitProvider({ children }: WindowsAdKitProviderProps) {
  // Set CSS custom properties for Once UI integration
  React.useEffect(() => {
    const root = document.documentElement
    
    // Apply brand colors
    Object.entries(windowsAdKitTheme.colors.brand).forEach(([key, value]) => {
      root.style.setProperty(`--brand-${key}`, value)
    })
    
    // Apply background colors
    Object.entries(windowsAdKitTheme.colors.background).forEach(([key, value]) => {
      root.style.setProperty(`--background-${key}`, value)
    })
    
    // Apply text colors
    Object.entries(windowsAdKitTheme.colors.text).forEach(([key, value]) => {
      root.style.setProperty(`--text-${key}`, value)
    })
    
    // Apply gradients
    Object.entries(windowsAdKitTheme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value)
    })

    // Force dark theme
    root.setAttribute('data-theme', 'dark')
    document.body.className = 'dark-theme'
    
  }, [])

  return (
    <div data-theme="dark" className="windows-ad-kit-theme">
      {children}
    </div>
  )
}

/**
 * Hook to access Windows Ad Kit theme values
 */
export function useWindowsAdKitTheme() {
  return {
    theme: windowsAdKitTheme,
    components: componentOverrides
  }
}

/**
 * Utility function to create brand-styled components
 */
export const brandStyles = {
  button: {
    brand: {
      background: windowsAdKitTheme.gradients.brand,
      color: windowsAdKitTheme.colors.text.primary,
      border: 'none',
      boxShadow: windowsAdKitTheme.shadows.brand,
      transition: windowsAdKitTheme.transitions.base,
      padding: `${windowsAdKitTheme.spacing.md} ${windowsAdKitTheme.spacing['2xl']}`,
      borderRadius: windowsAdKitTheme.borderRadius.md,
      fontSize: windowsAdKitTheme.typography.fontSize.base,
      fontWeight: windowsAdKitTheme.typography.fontWeight.semibold,
      fontFamily: windowsAdKitTheme.typography.fontFamily.base,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none'
    },
    brandHover: {
      background: windowsAdKitTheme.gradients.brandHover,
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)'
    },
    brandSecondary: {
      background: 'transparent',
      color: windowsAdKitTheme.colors.brand[500],
      border: `2px solid ${windowsAdKitTheme.colors.brand[500]}`,
      transition: windowsAdKitTheme.transitions.base
    }
  },
  
  card: {
    dark: {
      background: windowsAdKitTheme.gradients.surface,
      color: windowsAdKitTheme.colors.text.primary,
      border: `1px solid ${windowsAdKitTheme.colors.border.light}`,
      borderRadius: windowsAdKitTheme.borderRadius.lg,
      padding: windowsAdKitTheme.spacing['2xl'],
      boxShadow: windowsAdKitTheme.shadows.xl
    },
    brandHighlight: {
      background: windowsAdKitTheme.gradients.surface,
      border: `2px solid ${windowsAdKitTheme.colors.brand[500]}`,
      borderRadius: windowsAdKitTheme.borderRadius.xl,
      padding: windowsAdKitTheme.spacing['4xl'],
      boxShadow: windowsAdKitTheme.shadows.brand
    }
  },

  input: {
    base: {
      width: '100%',
      padding: windowsAdKitTheme.spacing.md,
      borderRadius: windowsAdKitTheme.borderRadius.md,
      border: `1px solid ${windowsAdKitTheme.colors.border.light}`,
      fontSize: windowsAdKitTheme.typography.fontSize.base,
      fontFamily: windowsAdKitTheme.typography.fontFamily.base,
      backgroundColor: windowsAdKitTheme.colors.background.surface,
      color: windowsAdKitTheme.colors.text.primary,
      transition: windowsAdKitTheme.transitions.base
    },
    focus: {
      borderColor: windowsAdKitTheme.colors.brand[500],
      boxShadow: '0 0 0 3px rgba(255, 107, 107, 0.1)',
      outline: 'none'
    }
  },

  text: {
    gradient: {
      background: windowsAdKitTheme.gradients.brand,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    heading: {
      color: windowsAdKitTheme.colors.text.primary,
      fontWeight: windowsAdKitTheme.typography.fontWeight.bold,
      fontFamily: windowsAdKitTheme.typography.fontFamily.base
    },
    body: {
      color: windowsAdKitTheme.colors.text.secondary,
      fontFamily: windowsAdKitTheme.typography.fontFamily.base,
      lineHeight: windowsAdKitTheme.typography.lineHeight.base
    }
  },

  layout: {
    page: {
      minHeight: '100vh',
      backgroundColor: windowsAdKitTheme.colors.background.primary,
      color: windowsAdKitTheme.colors.text.primary,
      fontFamily: windowsAdKitTheme.typography.fontFamily.base
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${windowsAdKitTheme.spacing['2xl']}`
    },
    section: {
      padding: `${windowsAdKitTheme.spacing['8xl']} 0`
    }
  }
}