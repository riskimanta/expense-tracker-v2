import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-[color:var(--surface-2)] text-[color:var(--txt-1)] ring-[color:var(--border)]",
        ok: "bg-[var(--success)] text-white ring-[var(--success)]",
        warn: "bg-[var(--warning)] text-white ring-[var(--warning)]",
        danger: "bg-[var(--danger)] text-white ring-[var(--danger)]",
        outline: "bg-transparent text-[color:var(--txt-1)] ring-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
