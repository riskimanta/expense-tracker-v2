"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, FolderOpen, Wallet, PiggyBank, Coins, Settings, AlertTriangle } from 'lucide-react'
import { useMemo } from 'react'

const adminTabs = [
  { href: '/admin', label: 'Dashboard', icon: Shield },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/account-types', label: 'Account Types', icon: Wallet },
  { href: '/admin/accounts', label: 'Accounts', icon: Wallet },
  { href: '/admin/budgets', label: 'Budgets', icon: PiggyBank },
  { href: '/admin/currencies', label: 'Currencies', icon: Coins },
  { href: '/admin/monitoring', label: 'Monitoring', icon: AlertTriangle },
  { href: '/admin/settings', label: 'Settings', icon: Settings }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Memoize admin tabs to prevent infinite re-renders
  const adminTabsWithIcons = useMemo(() => {
    return adminTabs.map((tab) => {
      const Icon = tab.icon
      const isActive = pathname === tab.href
      return {
        ...tab,
        Icon,
        isActive
      }
    })
  }, [pathname])

  // Check if admin access is enabled
  if (process.env.NEXT_PUBLIC_SHOW_ADMIN !== '1') {
    return (
      <div className="min-h-screen bg-[color:var(--bg)] p-6">
        <div className="mx-auto max-w-[1200px]">
          <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
            <CardContent className="p-12 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-[var(--txt-low)]" />
              <h1 className="text-2xl font-semibold text-[color:var(--txt-1)] mb-2">
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
    <div className="min-h-screen bg-[color:var(--bg)]">
      {/* Admin Header */}
      <div className="sticky top-0 z-40 bg-[color:var(--surface)] border-b border-[color:var(--border)]">
        <div className="mx-auto max-w-[1200px] px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[color:var(--txt-1)]">Admin</h1>
            <div className="flex items-center gap-1">
              {adminTabsWithIcons.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tab.isActive
                      ? 'bg-[color:var(--brand)] text-white'
                      : 'text-[color:var(--txt-2)] hover:text-[color:var(--txt-1)] hover:bg-[color:var(--surface-2)]'
                  }`}
                >
                  <tab.Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              ))}
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
