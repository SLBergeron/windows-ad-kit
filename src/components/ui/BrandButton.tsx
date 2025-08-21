'use client'

import React, { forwardRef, ButtonHTMLAttributes } from 'react'
import { useWindowsAdKitTheme, brandStyles } from './WindowsAdKitProvider'

interface BrandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'brandSecondary' | 'brandOutline'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
  href?: string
  as?: 'button' | 'a'
}

/**
 * Brand Button Component
 * Preserves Windows Ad Kit red gradient styling while using modern component patterns
 */
export const BrandButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, BrandButtonProps>(
  ({ variant = 'brand', size = 'medium', children, href, as, className, style, ...props }, ref) => {
    const { theme } = useWindowsAdKitTheme()

    const getVariantStyles = () => {
      switch (variant) {
        case 'brand':
          return brandStyles.button.brand
        case 'brandSecondary':
          return brandStyles.button.brandSecondary
        case 'brandOutline':
          return {
            background: 'transparent',
            color: theme.colors.brand[500],
            border: `1px solid ${theme.colors.border.light}`,
            transition: theme.transitions.base
          }
        default:
          return brandStyles.button.brand
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'small':
          return {
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            fontSize: theme.typography.fontSize.sm
          }
        case 'large':
          return {
            padding: `${theme.spacing['2xl']} ${theme.spacing['5xl']}`,
            fontSize: theme.typography.fontSize.xl,
            borderRadius: theme.borderRadius.xl
          }
        default:
          return {
            padding: `${theme.spacing.md} ${theme.spacing['2xl']}`,
            fontSize: theme.typography.fontSize.base
          }
      }
    }

    const buttonStyles = {
      ...getVariantStyles(),
      ...getSizeStyles(),
      ...style
    }

    const handleMouseEnter = (e: React.MouseEvent) => {
      if (variant === 'brand') {
        e.currentTarget.style.background = theme.gradients.brandHover
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 107, 107, 0.4)'
      } else if (variant === 'brandSecondary') {
        e.currentTarget.style.background = theme.gradients.brandSubtle
        e.currentTarget.style.borderColor = theme.colors.brand[600]
      }
    }

    const handleMouseLeave = (e: React.MouseEvent) => {
      if (variant === 'brand') {
        e.currentTarget.style.background = theme.gradients.brand
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = theme.shadows.brand
      } else if (variant === 'brandSecondary') {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.borderColor = theme.colors.brand[500]
      }
    }

    if (href || as === 'a') {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          style={buttonStyles}
          className={className}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        style={buttonStyles}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </button>
    )
  }
)

BrandButton.displayName = 'BrandButton'