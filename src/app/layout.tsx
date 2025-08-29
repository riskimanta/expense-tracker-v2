import './globals.css'
import './tokens.css'
import { TopNav } from '@/components/TopNav'
import { Providers } from '@/components/Providers'
import { ToastProvider } from '@/components/ToastProvider'

export const metadata = { title: 'Expense Tracker' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Force light theme as default on SSR to avoid dark flash
  const attr = { suppressHydrationWarning: true, 'data-theme': 'light' as const };

  return (
    <html lang="id" {...attr}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <ToastProvider>
            <TopNav />
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  )
}
