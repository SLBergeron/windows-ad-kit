import Link from 'next/link'
import { Box, Container, Stack, Grid, Heading, Text, Button, Card } from 'once-ui'
import { CUSTOMER_ROUTES } from './routes'

export default function LandingPage() {
  return (
    <Box as="main" style={{ backgroundColor: '#1a2332', color: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
      <Container style={{ padding: '80px 0' }}>
        <Stack spacing="32px" align="center" style={{ textAlign: 'center' }}>
          <Heading as="h1" style={{ fontSize: '3rem', fontWeight: 900 }}>
            Stop Wasting Money on Broken Marketing
          </Heading>
          <Text style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '800px' }}>
            Agencies charge thousands and leave you empty-handed. The <Text as="span" style={{ color: '#ff6b35', fontWeight: 700 }}>Windows Ad Kit</Text> costs just $295 and generates real appointments.
          </Text>
          <Stack direction="row" spacing="16px" style={{ fontWeight: 700, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Text as="span">15-minute setup</Text>
            <Text as="span" style={{ color: '#ff6b35' }}>•</Text>
            <Text as="span">first lead in 48 hrs</Text>
            <Text as="span" style={{ color: '#ff6b35' }}>•</Text>
            <Text as="span">28-day Grand Slam guarantee</Text>
          </Stack>
          <Button
            asChild
            style={{ backgroundColor: '#ff6b35', color: '#ffffff', padding: '20px 40px', borderRadius: '8px', fontWeight: 800 }}
          >
            <Link href={CUSTOMER_ROUTES.GET_STARTED}>Get the $295 Kit</Link>
          </Button>
        </Stack>
      </Container>

      <Container style={{ padding: '60px 0' }}>
        <Grid columns={4} gap="40px" style={{ textAlign: 'center' }}>
          <Box>
            <Heading as="h3" style={{ fontSize: '2rem', color: '#ff6b35' }}>237+</Heading>
            <Text style={{ color: '#94a3b8' }}>Contractors Using City Ad Kit</Text>
          </Box>
          <Box>
            <Heading as="h3" style={{ fontSize: '2rem', color: '#ff6b35' }}>$2.3M+</Heading>
            <Text style={{ color: '#94a3b8' }}>Revenue Generated</Text>
          </Box>
          <Box>
            <Heading as="h3" style={{ fontSize: '2rem', color: '#ff6b35' }}>8,400+</Heading>
            <Text style={{ color: '#94a3b8' }}>Appointments Booked</Text>
          </Box>
          <Box>
            <Heading as="h3" style={{ fontSize: '2rem', color: '#ff6b35' }}>$47</Heading>
            <Text style={{ color: '#94a3b8' }}>Avg. Cost Per Appointment</Text>
          </Box>
        </Grid>
      </Container>

      <Container style={{ padding: '60px 0' }}>
        <Heading as="h2" style={{ textAlign: 'center', marginBottom: '40px' }}>
          Everything You Get With <Text as="span" style={{ color: '#ff6b35' }}>The City Ad Kit™</Text>
        </Heading>
        <Grid columns={3} gap="24px">
          <Card>
            <Text style={{ fontSize: '24px' }}>📱</Text>
            <Heading as="h3">Campaign Template #1</Heading>
            <Text>"Emergency Repair Rush"</Text>
            <Text style={{ color: '#94a3b8' }}>
              Targets homeowners with damaged windows/doors needing immediate help. Highest urgency = fastest closes.
            </Text>
            <Text style={{ color: '#ff6b35', fontWeight: 700 }}>VALUE: $497</Text>
          </Card>
          <Card>
            <Text style={{ fontSize: '24px' }}>🏠</Text>
            <Heading as="h3">Campaign Template #2</Heading>
            <Text>"Energy Savings Calculator"</Text>
            <Text style={{ color: '#94a3b8' }}>
              Interactive tool showing exact monthly savings with new windows. Converts skeptics into believers.
            </Text>
            <Text style={{ color: '#ff6b35', fontWeight: 700 }}>VALUE: $497</Text>
          </Card>
          <Card>
            <Text style={{ fontSize: '24px' }}>💰</Text>
            <Heading as="h3">Campaign Template #3</Heading>
            <Text>"Tax Credit Maximizer"</Text>
            <Text style={{ color: '#94a3b8' }}>
              Leverages government incentives and rebates. Creates urgency with deadline-driven offers.
            </Text>
            <Text style={{ color: '#ff6b35', fontWeight: 700 }}>VALUE: $497</Text>
          </Card>
          <Card>
            <Text style={{ fontSize: '24px' }}>🎯</Text>
            <Heading as="h3">Landing Page Templates</Heading>
            <Text>3 High-Converting Designs</Text>
            <Text style={{ color: '#94a3b8' }}>
              Mobile-first pages with appointment schedulers, social proof, and trust signals built in.
            </Text>
            <Text style={{ color: '#ff6b35', fontWeight: 700 }}>VALUE: $797</Text>
          </Card>
          <Card>
            <Text style={{ fontSize: '24px' }}>📲</Text>
            <Heading as="h3">SMS Automation Flows</Heading>
            <Text>7-Message Sequences</Text>
            <Text style={{ color: '#94a3b8' }}>
              Follow-up messages that nurture leads and book appointments on autopilot. 89% open rates.
            </Text>
            <Text style={{ color: '#ff6b35', fontWeight: 700 }}>VALUE: $397</Text>
          </Card>
          <Card>
            <Text style={{ fontSize: '24px' }}>🚀</Text>
            <Heading as="h3">72-Hour Launch Support</Heading>
            <Text>Done-With-You Setup</Text>
            <Text style={{ color: '#94a3b8' }}>
              Our team helps you implement everything in 72 hours or less. Includes 1-on-1 Zoom support.
            </Text>
            <Text style={{ color: '#ff6b35', fontWeight: 700 }}>VALUE: $997</Text>
          </Card>
        </Grid>
        <Stack spacing="8px" style={{ textAlign: 'center', marginTop: '40px' }}>
          <Text style={{ color: '#94a3b8', fontSize: '1.25rem' }}>
            Total Value: <del>$3,682</del>
          </Text>
          <Heading as="h3" style={{ color: '#22c55e', fontSize: '2rem' }}>
            Your Investment Today: Only $295
          </Heading>
        </Stack>
      </Container>

      <Container style={{ padding: '60px 0' }}>
        <Heading as="h2" style={{ textAlign: 'center', marginBottom: '40px' }}>
          What Contractors Are Saying
        </Heading>
        <Grid columns={3} gap="24px">
          <Card>
            <Text style={{ fontStyle: 'italic' }}>
              "43 appointments booked in our first month. We had to hire 2 new installers to keep up. This system is insane!"
            </Text>
            <Text style={{ marginTop: '16px', fontWeight: 700 }}>Mike Richardson</Text>
            <Text style={{ color: '#94a3b8' }}>Premier Windows & Doors, Dallas TX</Text>
          </Card>
          <Card>
            <Text style={{ fontStyle: 'italic' }}>
              "Finally stopped paying $3k/month to agencies. City Ad Kit books more appointments for 1/10th the cost."
            </Text>
            <Text style={{ marginTop: '16px', fontWeight: 700 }}>Sarah Chen</Text>
            <Text style={{ color: '#94a3b8' }}>ClearView Installation Co., Seattle WA</Text>
          </Card>
          <Card>
            <Text style={{ fontStyle: 'italic' }}>
              "$127,000 in new contracts from the Energy Savings campaign alone. ROI is absolutely ridiculous."
            </Text>
            <Text style={{ marginTop: '16px', fontWeight: 700 }}>Tom Bradley</Text>
            <Text style={{ color: '#94a3b8' }}>Bradley Windows Group, Phoenix AZ</Text>
          </Card>
        </Grid>
      </Container>
    </Box>
  )
}
