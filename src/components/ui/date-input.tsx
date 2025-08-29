"use client";
import * as React from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type Props = {
  value: Date | null | undefined;
  onChange: (d: Date | null) => void;
  placeholder?: string;       // default: "DD/MM/YYYY"
  fromYear?: number;          // default: currentYear-5
  toYear?: number;            // default: currentYear+5
  className?: string;
  "data-testid"?: string;
};

export function DateInput({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  fromYear = dayjs().year() - 5,
  toYear   = dayjs().year() + 5,
  className,
  ...rest
}: Props) {
  const [open, setOpen] = React.useState(false);
  const display = value ? dayjs(value).locale("id").format("DD/MM/YYYY") : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative w-full h-11",
            "rounded-[var(--radius)] border border-[color:var(--border)]",
            "bg-[color:var(--surface)] px-3 pr-10 text-left",
            "text-[color:var(--txt-1)]",
            "focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]",
            className
          )}
          aria-label="Pilih tanggal"
          {...rest}
        >
          <span className={cn(!value && "text-[color:var(--txt-3)]")}>
            {display || placeholder}
          </span>
          <CalendarIcon
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-80 pointer-events-none"
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>

                   <PopoverContent
               className={cn(
                 "w-[320px] p-0 rounded-[var(--radius)] border border-[color:var(--border)]",
                 "bg-[color:var(--surface)] shadow-lg z-[60] overflow-hidden",
                 "max-w-[320px] min-w-[320px]" // Force exact width
               )}
               align="start"
               sideOffset={4}
             >
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(d) => { onChange(d ?? null); setOpen(false); }}
          fromYear={fromYear}
          toYear={toYear}
          initialFocus
          captionLayout="dropdown"  // ada dropdown tahun/bulan
          weekStartsOn={1}                  // Senin
          className="text-[color:var(--txt-1)]"
        />
      </PopoverContent>
    </Popover>
  );
}
