import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Harsha Salim - Portfolio',
  description: 'Software Engineer & Graduate Student at USC - Portfolio Website',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#007acc" />
      </head>
      <body>
        {children}
        <Analytics />  
      </body>
    </html>
  )
} 