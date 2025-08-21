'use client'

import React, { useState, useEffect } from 'react'
import { Flex, Text, Button } from '@once-ui-system/core'
import { useRouter } from 'next/navigation'

interface NavItem {
  name: string
  link: string
  icon?: React.ReactNode
}

interface FloatingNavbarProps {
  navItems: NavItem[]
  className?: string
}

export function FloatingNavbar({ navItems, className = "" }: FloatingNavbarProps) {
  const [visible, setVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show navbar when scrolling up or when near top
      if (currentScrollY < 50) {
        setVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setVisible(true)
      } else {
        setVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <div
      style={{
        position: 'fixed',
        top: '2.5rem',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '-100px'})`,
        zIndex: 5000,
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: visible ? 'auto' : 'none'
      }}
      className={className}
    >
      <Flex
        paddingX="l"
        paddingY="s"
        gap="m"
        alignItems="center"
        style={{
          background: 'rgba(10, 14, 39, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50px',
          boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1), 0px 1px 0px rgba(255, 255, 255, 0.05)',
          maxWidth: 'fit-content'
        }}
      >
        {navItems.map((navItem, idx) => (
          <a
            key={`link-${idx}`}
            href={navItem.link}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              color: '#a0a9c0',
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              transition: 'all 0.2s ease',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#a0a9c0'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {navItem.icon && (
              <span style={{ display: 'block' }}>{navItem.icon}</span>
            )}
            <span style={{ display: window.innerWidth >= 640 ? 'block' : 'none' }}>
              {navItem.name}
            </span>
          </a>
        ))}
        
        <Button
          variant="primary"
          size="s"
          onClick={() => router.push('/login')}
          style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            border: 'none',
            borderRadius: '25px',
            fontSize: '0.875rem',
            fontWeight: 600,
            padding: '0.5rem 1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span>Login</span>
          <div style={{
            position: 'absolute',
            bottom: '-1px',
            left: '25%',
            width: '50%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)'
          }} />
        </Button>
      </Flex>
    </div>
  )
}

export default FloatingNavbar