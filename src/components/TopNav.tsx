"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { 
  Receipt, 
  TrendingUp, 
  ArrowLeftRight, 
  Wallet, 
  BarChart3, 
  Lightbulb, 
  Heart,
  Shield
} from "lucide-react"
import { cn } from "@/lib/cn"

export function TopNav() {
  const pathname = usePathname()
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    setShowAdmin(process.env.NEXT_PUBLIC_SHOW_ADMIN === '1')
  }, [])

  const navigationItems = [
    {
      name: "Expenses",
      href: "/expenses",
      icon: Receipt,
    },
    {
      name: "Income",
      href: "/income",
      icon: TrendingUp,
    },
    {
      name: "Transfer",
      href: "/transfer",
      icon: ArrowLeftRight,
    },
    {
      name: "Accounts",
      href: "/accounts",
      icon: Wallet,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
    {
      name: "Advisor",
      href: "/advisor",
      icon: Lightbulb,
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: Heart,
    },
    // Admin link - only show when enabled
    ...(showAdmin ? [{
      name: "Admin",
      href: "/admin",
      icon: Shield,
    }] : [])
  ]

  return (
    <div className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur">
      <nav className="mx-auto max-w-[1200px] px-4">
        <ul className="no-scrollbar scroll-fade flex gap-2 overflow-x-auto py-3 snap-x" aria-label="Main navigation">
          {/* Logo/Brand */}
          <li className="shrink-0 snap-start mr-4">
            <Link 
              href="/dashboard" 
              className="group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition bg-[var(--surface)] border-[var(--border)] text-[var(--txt-high)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              <span className="text-lg font-bold">ExpenseTracker</span>
            </Link>
          </li>

          {/* Navigation Links */}
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            
            return (
              <li key={item.name} className="shrink-0 snap-start">
                <Link
                  href={item.href}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition bg-[var(--surface)]",
                    isActive
                      ? "border-[var(--primary)] text-[var(--txt-high)]"
                      : "border-[var(--border)] text-[var(--txt-med)] hover:border-[var(--primary)] hover:text-[var(--txt-high)]"
                  )}
                >
                  <Icon 
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive 
                        ? "text-[var(--primary)]" 
                        : "text-[var(--txt-low)] group-hover:text-[var(--primary)]"
                    )} 
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
