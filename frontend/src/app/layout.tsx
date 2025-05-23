// Components Imports
import { Metadata } from 'next'
import type { ReactNode } from 'react'

// Framework CSS Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

// Provider Imports
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/i18n/LanguageContext'

// Type Imports
type ChildrenType = {
  children: ReactNode
}

export const metadata: Metadata = {
  title: 'Company - MUI React Next.js Admin Template',
  description: 'Company - MUI React Next.js Admin Template',
  keywords: 'admin template, react, next, mui, admin dashboard'
}

export default function RootLayout({ children }: ChildrenType) {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' dir={direction} lang='en'>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
