import './globals.css'

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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💼</text></svg>" />
        <meta name="theme-color" content="#007acc" />
      </head>
      <body>{children}</body>
    </html>
  )
} 