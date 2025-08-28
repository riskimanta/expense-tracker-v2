"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, FolderOpen, Wallet, PiggyBank, Coins, Settings } from 'lucide-react'

const adminTabs = [
  { href: '/admin', label: 'Dashboard', icon: Shield },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/accounts', label: 'Accounts', icon: Wallet },
  { href: '/admin/budgets', label: 'Budgets', icon: PiggyBank },
  { href: '/admin/currencies', label: 'Currencies', icon: Coins },
  { href: '/admin/settings', label: 'Settings', icon: Settings }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if admin access is enabled
  if (process.env.NEXT_PUBLIC_SHOW_ADMIN !== '1') {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-[1200px]">
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="p-12 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-[var(--txt-low)]" />
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Hanya Admin
              </h1>
              <p className="text-[var(--txt-med)]">
                Set NEXT_PUBLIC_SHOW_ADMIN=1 untuk development.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">Admin</h1>
            <div className="flex items-center gap-1">
              {adminTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = pathname === tab.href
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--primary)] text-white'
                        : 'text-[var(--txt-med)] hover:text-foreground hover:bg-[var(--surface)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="mx-auto max-w-[1200px] p-6">
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}
