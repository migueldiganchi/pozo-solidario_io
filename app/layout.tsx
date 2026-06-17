import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { CookieBanner } from '@/components/CookieBanner'

export const metadata: Metadata = {
  title: {
    default: 'Pozo Solidario — Participá y ayudá',
    template: '%s — Pozo Solidario',
  },
  description: 'Un sorteo solidario semanal donde todos participan del mismo pozo. 50% a donaciones, 40% a premios, 100% transparente.',
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pozo Solidario',
  },
  keywords: ['sorteo solidario', 'donaciones', 'causas sociales', 'Argentina', 'Mercado Pago', 'Random.org'],
  authors: [{ name: 'Pozo Solidario' }],
  openGraph: {
    title: 'Pozo Solidario',
    description: 'Comprás un número, ayudás y participás.',
    type: 'website',
    url: 'https://pozosolidario.com',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pozo Solidario',
    description: 'Comprás un número, ayudás y participás.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body>
        {children}
        <CookieBanner />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'hsl(0 0% 7%)',
              color: 'hsl(0 0% 97%)',
              border: '1px solid hsl(0 0% 12%)',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 20px',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#000' } },
          }}
        />
      </body>
    </html>
  )
}
