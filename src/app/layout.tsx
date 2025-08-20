import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Windows Ad Kit - 20 Appointments in 28 Days',
  description: 'Automated advertising that books appointments for window contractors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}