'use client'

import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { useWindowsAdKitTheme, brandStyles } from './WindowsAdKitProvider'

interface BrandInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

interface BrandTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

/**
 * Brand Input Component
 * Form input with dark theme and brand focus styling
 */
export const BrandInput = forwardRef<HTMLInputElement, BrandInputProps>(
  ({ label, error, helperText, className, style, ...props }, ref) => {
    const { theme } = useWindowsAdKitTheme()

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      Object.assign(e.currentTarget.style, brandStyles.input.focus)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = theme.colors.border.light
      e.currentTarget.style.boxShadow = 'none'
      props.onBlur?.(e)
    }

    const inputStyles = {
      ...brandStyles.input.base,
      ...(error && {
        borderColor: theme.colors.status?.error || '#ef4444',
        boxShadow: `0 0 0 3px rgba(239, 68, 68, 0.1)`
      }),
      ...style
    }

    const labelStyles = {
      display: 'block',
      marginBottom: theme.spacing.sm,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.base
    }

    const helperTextStyles = {
      marginTop: theme.spacing.sm,
      fontSize: theme.typography.fontSize.xs,
      color: error ? (theme.colors.status?.error || '#ef4444') : theme.colors.text.muted
    }

    return (
      <div>
        {label && (
          <label style={labelStyles}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={inputStyles}
          className={className}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {(error || helperText) && (
          <div style={helperTextStyles}>
            {error || helperText}
          </div>
        )}
      </div>
    )
  }
)

BrandInput.displayName = 'BrandInput'

/**
 * Brand Textarea Component
 * Textarea with dark theme and brand focus styling
 */
export const BrandTextarea = forwardRef<HTMLTextAreaElement, BrandTextareaProps>(
  ({ label, error, helperText, className, style, ...props }, ref) => {
    const { theme } = useWindowsAdKitTheme()

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      Object.assign(e.currentTarget.style, brandStyles.input.focus)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = theme.colors.border.light
      e.currentTarget.style.boxShadow = 'none'
      props.onBlur?.(e)
    }

    const textareaStyles = {
      ...brandStyles.input.base,
      minHeight: '80px',
      resize: 'vertical' as const,
      ...(error && {
        borderColor: theme.colors.status?.error || '#ef4444',
        boxShadow: `0 0 0 3px rgba(239, 68, 68, 0.1)`
      }),
      ...style
    }

    const labelStyles = {
      display: 'block',
      marginBottom: theme.spacing.sm,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.base
    }

    const helperTextStyles = {
      marginTop: theme.spacing.sm,
      fontSize: theme.typography.fontSize.xs,
      color: error ? (theme.colors.status?.error || '#ef4444') : theme.colors.text.muted
    }

    return (
      <div>
        {label && (
          <label style={labelStyles}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          style={textareaStyles}
          className={className}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {(error || helperText) && (
          <div style={helperTextStyles}>
            {error || helperText}
          </div>
        )}
      </div>
    )
  }
)

BrandTextarea.displayName = 'BrandTextarea'

/**
 * Brand Select Component
 * Select dropdown with dark theme styling
 */
interface BrandSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  children: React.ReactNode
}

export const BrandSelect = forwardRef<HTMLSelectElement, BrandSelectProps>(
  ({ label, error, helperText, children, className, style, ...props }, ref) => {
    const { theme } = useWindowsAdKitTheme()

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      Object.assign(e.currentTarget.style, brandStyles.input.focus)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.colors.border.light
      e.currentTarget.style.boxShadow = 'none'
      props.onBlur?.(e)
    }

    const selectStyles = {
      ...brandStyles.input.base,
      cursor: 'pointer',
      ...(error && {
        borderColor: theme.colors.status?.error || '#ef4444',
        boxShadow: `0 0 0 3px rgba(239, 68, 68, 0.1)`
      }),
      ...style
    }

    const labelStyles = {
      display: 'block',
      marginBottom: theme.spacing.sm,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.base
    }

    const helperTextStyles = {
      marginTop: theme.spacing.sm,
      fontSize: theme.typography.fontSize.xs,
      color: error ? (theme.colors.status?.error || '#ef4444') : theme.colors.text.muted
    }

    return (
      <div>
        {label && (
          <label style={labelStyles}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          style={selectStyles}
          className={className}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        >
          {children}
        </select>
        {(error || helperText) && (
          <div style={helperTextStyles}>
            {error || helperText}
          </div>
        )}
      </div>
    )
  }
)

BrandSelect.displayName = 'BrandSelect'