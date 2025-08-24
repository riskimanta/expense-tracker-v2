import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[var(--surface2)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
