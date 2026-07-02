import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './admin.css'

export const metadata: Metadata = {
  title: 'Admin — Villa Sera',
  robots: 'noindex, nofollow',
}

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} ${inter.variable}`} style={{ fontFamily: 'var(--font-inter)' }}>
      {children}
    </div>
  )
}
