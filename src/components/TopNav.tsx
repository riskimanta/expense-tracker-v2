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
import { ThemeToggle } from "./ui/theme-toggle"

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
    <div className="sticky top-0 z-40 w-full border-b border-[color:var(--border)] bg-[color:var(--surface)]/80 backdrop-blur-sm shadow-sm">
      <nav className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo/Brand */}
          <Link 
            href="/dashboard" 
            className="group inline-flex items-center gap-3 rounded-xl border px-4 py-2 text-sm transition bg-[color:var(--surface)] border-[color:var(--border)] text-[color:var(--txt-1)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] shadow-sm"
          >
            {/* Logo placeholder - bird icon in brand color */}
            <div className="w-6 h-6 rounded-full bg-[color:var(--brand)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">🐦</span>
            </div>
            <span className="text-xl font-bold tracking-tight">ExpenseTracker</span>
          </Link>

          {/* Navigation Links */}
          <ul className="no-scrollbar scroll-fade flex gap-2 overflow-x-auto snap-x" aria-label="Main navigation">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              const Icon = item.icon
              
              return (
                <li key={item.name} className="shrink-0 snap-start">
                  <Link
                    href={item.href}
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition bg-[color:var(--surface)] shadow-sm",
                      isActive
                        ? "border-[color:var(--brand)] text-[color:var(--txt-1)] bg-[color:var(--brand-50)]"
                        : "border-[color:var(--border)] text-[color:var(--txt-2)] hover:border-[color:var(--brand)] hover:text-[color:var(--txt-1)] hover:bg-[color:var(--surface-2)]"
                    )}
                  >
                    <Icon 
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive 
                          ? "text-[color:var(--brand)]" 
                          : "text-[color:var(--txt-3)] group-hover:text-[color:var(--brand)]"
                      )} 
                    />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </div>
  )
}
