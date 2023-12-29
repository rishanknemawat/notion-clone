import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import { EdgeStoreProvider } from '@/lib/edgestore'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConvexClientProvider } from '@/components/providers/concex.provider'
import { ModalProvider } from '@/components/providers/modal-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Note Creater',
  description: 'Collaboratory workspace for better and faster work!',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/logo.png',
        href: '/logo.png'
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/logo_dark.png',
        href: '/logo_dark.png'
      },
    ],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
              storageKey='note-creator'
            >
              <Toaster position='bottom-center'/>
              <ModalProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
