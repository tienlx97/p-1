import 'maplibre-gl/dist/maplibre-gl.css'
import 'overlayscrollbars/overlayscrollbars.css'
import 'swiper/css'
import 'swiper/css/free-mode'
import './globals.css'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { AuthGate, AuthSessionProvider } from '@/features/auth'
import { AriaProviders } from '@/shared/components/aria-providers'

export const metadata = {
  title: 'Our Memory Map',
  description: 'Không gian kỷ niệm riêng tư dành cho hai người.',
  applicationName: 'Our Memory Map',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Our Memory',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <AriaProviders>
          <AuthSessionProvider>
            <AuthGate>{children}</AuthGate>
          </AuthSessionProvider>
        </AriaProviders>
      </body>
    </html>
  )
}
