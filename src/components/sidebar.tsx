"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from 'next-intl'
import { cn } from "@/lib/utils"
import {
  CreditCard,
  DollarSign,
  Home,
  PieChart,
  Settings,
  ArrowLeftRight,
  Wallet,
} from "lucide-react"

const navigation = [
  { name: "nav.dashboard", href: "/", icon: Home },
  { name: "nav.expenses", href: "/expenses", icon: CreditCard },
  { name: "nav.income", href: "/income", icon: DollarSign },
  { name: "nav.transfer", href: "/transfer", icon: ArrowLeftRight },
  { name: "nav.reports", href: "/reports", icon: PieChart },
  { name: "nav.accounts", href: "/accounts", icon: Wallet },
  { name: "nav.settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const t = useTranslations()

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold text-sidebar-foreground">
          {t('common.expenseTracker')}
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-sidebar-primary-foreground"
                    : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                )}
                aria-hidden="true"
              />
              {t(item.name)}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
