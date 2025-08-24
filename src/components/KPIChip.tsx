import { cn } from "@/lib/utils"

interface KPIChipProps {
  label: string
  value: string
  tone?: "ok" | "warn" | "danger"
}

export function KPIChip({ label, value, tone = "ok" }: KPIChipProps) {
  const getToneColor = () => {
    switch (tone) {
      case "ok":
        return "text-[var(--success)]"
      case "warn":
        return "text-[var(--warning)]"
      case "danger":
        return "text-[var(--danger)]"
      default:
        return "text-foreground"
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className={cn("text-2xl font-semibold", getToneColor())}>
          {value}
        </div>
      </div>
    </div>
  )
}
