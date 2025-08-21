'use client'

import React from 'react'
import { FloatingNavbar } from './FloatingNavbar'
import { Flex, Text, Column } from '@once-ui-system/core'

// Simple icon components (since we don't have @tabler/icons-react)
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
)

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
)

const MessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
)

export default function FloatingNavbarDemo() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <HomeIcon />
    },
    {
      name: "About", 
      link: "/about",
      icon: <UserIcon />
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <MessageIcon />
    }
  ]

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <FloatingNavbar navItems={navItems} />
      <DummyContent />
    </div>
  )
}

const DummyContent = () => {
  return (
    <Column 
      fillWidth 
      style={{ 
        height: '40rem',
        background: 'var(--page-background)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.5rem',
        position: 'relative'
      }}
    >
      <Flex 
        fillWidth 
        fillHeight 
        justifyContent="center" 
        alignItems="center" 
        direction="column"
        gap="l"
      >
        <Text size="xl" weight="strong" color="white" style={{ textAlign: 'center' }}>
          Scroll back up to reveal Floating Navbar
        </Text>
        <Text size="m" color="neutral-medium" style={{ textAlign: 'center' }}>
          The navbar will appear when you scroll up
        </Text>
      </Flex>
      
      {/* Grid background pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        borderRadius: '0.5rem'
      }} />
    </Column>
  )
}