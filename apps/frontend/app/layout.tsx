import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/providers/app-providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Zixly - DevOps Automation Services | Brisbane | Docker, Kubernetes, Terraform',
  description:
    'Brisbane-based DevOps automation services for tech companies. Docker, Kubernetes, AWS EKS infrastructure implementation. Reduce cloud costs 20-50%. Production-grade reliability.',
  keywords: [
    'DevOps',
    'Brisbane',
    'Docker',
    'Kubernetes',
    'Terraform',
    'AWS',
    'CI/CD',
    'Infrastructure as Code',
    'Cloud Native',
    'Automation',
  ],
  authors: [{ name: 'Zixly' }],
  openGraph: {
    title: 'Zixly - DevOps Automation Services for Brisbane Tech Companies',
    description:
      'Expert Docker, Kubernetes, Terraform implementation. Reduce cloud costs 20-50%. Production-grade infrastructure.',
    type: 'website',
    locale: 'en_AU',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
