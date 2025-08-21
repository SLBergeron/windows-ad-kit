'use client'

import React, { forwardRef, HTMLAttributes } from 'react'
import { useWindowsAdKitTheme, brandStyles } from './WindowsAdKitProvider'

interface BrandCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'dark' | 'brandHighlight' | 'elevated' | 'info'
  children: React.ReactNode
}

/**
 * Brand Card Component
 * Dark theme card with optional brand highlighting
 */
export const BrandCard = forwardRef<HTMLDivElement, BrandCardProps>(
  ({ variant = 'dark', children, className, style, ...props }, ref) => {
    const { theme } = useWindowsAdKitTheme()

    const getVariantStyles = () => {
      switch (variant) {
        case 'dark':
          return brandStyles.card.dark
        case 'brandHighlight':
          return brandStyles.card.brandHighlight
        case 'elevated':
          return {
            background: theme.colors.background.elevated,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing['2xl'],
            border: `1px solid ${theme.colors.border.light}`,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.shadows.xl,
            color: theme.colors.text.primary
          }
        case 'info':
          return {
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: `1px solid #3b82f6`,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.lg,
            color: theme.colors.text.primary
          }
        default:
          return brandStyles.card.dark
      }
    }

    const cardStyles = {
      ...getVariantStyles(),
      ...style
    }

    return (
      <div
        ref={ref}
        style={cardStyles}
        className={className}
        {...props}
      >
        {children}
      </div>
    )
  }
)

BrandCard.displayName = 'BrandCard'