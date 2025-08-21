'use client'

import { useState } from 'react'
import { Flex, Column, Text, Button, Card, Heading } from '@once-ui-system/core'
import { Navigation } from '../../components/ui'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For now, just redirect to dashboard placeholder
    window.location.href = '/my-campaigns'
    
    setIsLoading(false)
  }

  return (
    <Flex
      as="main"
      direction="column"
      fillWidth
      background="page"
      minHeight="100vh"
    >
      <Navigation 
        items={[]}
        showCTA={false}
        showLogin={false}
      />

      <Column maxWidth="sm" fillWidth paddingX="l" paddingY="xl" style={{ margin: '120px auto' }}>
        <Flex direction="column" alignItems="center" gap="xl">
          <Flex direction="column" alignItems="center" gap="m" textAlign="center">
            <Heading size="l" weight="strong">
              Customer Login
            </Heading>
            <Text size="m" color="neutral-medium">
              Access your Windows Ad Kit dashboard
            </Text>
          </Flex>

          <Card padding="l" fillWidth>
            <form onSubmit={handleLogin}>
              <Flex direction="column" gap="l">
                <Flex direction="column" gap="xs">
                  <Text size="s" weight="medium">Email Address</Text>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--neutral-weak)',
                      fontSize: '1rem',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--neutral-on-background-strong)',
                      fontFamily: 'inherit'
                    }}
                  />
                </Flex>

                <Flex direction="column" gap="xs">
                  <Text size="s" weight="medium">Password</Text>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--neutral-weak)',
                      fontSize: '1rem',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--neutral-on-background-strong)',
                      fontFamily: 'inherit'
                    }}
                  />
                </Flex>

                <Button
                  type="submit"
                  variant="primary"
                  size="l"
                  fillWidth
                  disabled={!email || !password || isLoading}
                  style={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    border: 'none'
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                <Flex justifyContent="center" gap="s">
                  <Text size="s" color="neutral-medium">
                    Don't have an account?
                  </Text>
                  <Text size="s" color="brand-strong" href="/get-started" as="a">
                    Get Started
                  </Text>
                </Flex>
              </Flex>
            </form>
          </Card>
        </Flex>
      </Column>
    </Flex>
  )
}