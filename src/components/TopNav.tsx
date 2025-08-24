"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Receipt, 
  TrendingUp, 
  ArrowLeftRight, 
  Wallet, 
  BarChart3, 
  Lightbulb, 
  Heart 
} from "lucide-react"
import { cn } from "@/lib/cn"

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
]

export function TopNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 mr-8">
            <Link 
              href="/dashboard" 
              className="text-xl font-bold text-[var(--txt-high)] hover:text-[var(--primary)] transition-colors"
            >
              ExpenseTracker
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex items-center space-x-3 min-w-max">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-all duration-200",
                      "hover:scale-105",
                      isActive
                        ? "border-[var(--primary)] bg-[var(--surface2)] text-[var(--primary)] shadow-sm"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--txt-med)] hover:border-[var(--primary)]/50 hover:bg-[var(--surface2)]"
                    )}
                  >
                    <Icon 
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive 
                          ? "text-[var(--primary)]" 
                          : "text-[var(--txt-med)] group-hover:text-[var(--txt-high)]"
                      )} 
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
