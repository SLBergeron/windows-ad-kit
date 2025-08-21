'use client'

import React from 'react'
import { useStyles } from '../../styles'

export function Footer() {
  const { theme, components } = useStyles()

  return (
    <footer style={{
      backgroundColor: '#0a0e27',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      paddingTop: theme.spacing['6xl'],
      paddingBottom: theme.spacing['6xl'],
      position: 'relative'
    }}>
      {/* Grid texture background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        pointerEvents: 'none',
        opacity: 0.5
      }} />
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `0 ${theme.spacing['2xl']}`,
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: theme.spacing['5xl'],
          marginBottom: theme.spacing['5xl']
        }}>
          {/* Company Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: theme.spacing['2xl']
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: theme.gradients?.brand || 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.lg,
                fontSize: '20px'
              }}>
                🏠
              </div>
              <h3 style={{
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                margin: 0
              }}>
                Windows Ad Kit
              </h3>
            </div>
            <p style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.secondary,
              lineHeight: theme.typography.lineHeight.relaxed,
              marginBottom: theme.spacing.xl
            }}>
              Professional advertising templates that help window and door contractors book $8K+ jobs in 48 hours or less.
            </p>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.muted
            }}>
              📍 Serving contractors nationwide<br />
              ⚡ 48-hour lead guarantee<br />
              🎯 20 appointments in 28 days
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.xl
            }}>
              Product
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                'Ad Templates',
                'Campaign Setup',
                'Lead Integration',
                'Performance Tracking',
                'Bespoke Service',
                'Training & Support'
              ].map((item, index) => (
                <li key={index} style={{
                  marginBottom: theme.spacing.md
                }}>
                  <a href="#" style={{
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text.secondary,
                    textDecoration: 'none',
                    transition: theme.transitions?.base || 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = theme.colors.primary}
                  onMouseLeave={(e) => e.target.style.color = theme.colors.text.secondary}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.xl
            }}>
              Support
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                'Help Center',
                'Setup Guide',
                'Video Tutorials',
                'Contact Support',
                'Guarantee Policy',
                'Terms of Service'
              ].map((item, index) => (
                <li key={index} style={{
                  marginBottom: theme.spacing.md
                }}>
                  <a href="#" style={{
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text.secondary,
                    textDecoration: 'none',
                    transition: theme.transitions?.base || 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = theme.colors.primary}
                  onMouseLeave={(e) => e.target.style.color = theme.colors.text.secondary}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.xl
            }}>
              Get Started
            </h4>
            <div style={{
              padding: theme.spacing.xl,
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(238, 90, 36, 0.1) 100%)',
              border: '1px solid rgba(255, 107, 107, 0.2)',
              borderRadius: theme.borderRadius.lg,
              marginBottom: theme.spacing.lg
            }}>
              <p style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.md,
                margin: 0
              }}>
                Ready to book $8K+ jobs?
              </p>
              <button style={{
                ...components.button.base,
                ...components.button.primary,
                fontSize: theme.typography.fontSize.sm,
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                width: '100%',
                marginTop: theme.spacing.sm
              }}>
                Start for $295 →
              </button>
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.muted,
              textAlign: 'center'
            }}>
              🛡️ Money-back guarantee<br />
              ⚡ Setup in 15 minutes
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: theme.spacing.xl,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: theme.spacing.lg
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.muted
          }}>
            © 2024 Windows Ad Kit. All rights reserved.
          </div>
          <div style={{
            display: 'flex',
            gap: theme.spacing.lg,
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.muted
            }}>
              Made for contractors by contractors
            </span>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10b981'
            }} />
            <span style={{
              fontSize: theme.typography.fontSize.sm,
              color: '#10b981',
              fontWeight: theme.typography.fontWeight.medium
            }}>
              Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer