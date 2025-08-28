"use client";
import * as React from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  value?: Date | null;                      // bulan terpilih (tanggal apapun di bulan tsb)
  onChange?: (d: Date) => void;             // callback ketika pilih bulan
  minYear?: number;                          // optional batas bawah
  maxYear?: number;                          // optional batas atas
  className?: string;
  placeholder?: string;
};

// Set locale Indonesia
dayjs.locale("id");

const months = [
  "Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des",
];

export function MonthYearPicker({
  value,
  onChange,
  minYear = dayjs().year()-5,
  maxYear = dayjs().year()+5,
  className,
  placeholder = "Pilih bulan",
}: Props) {
  const initial = value ? dayjs(value) : dayjs();
  const [open, setOpen] = React.useState(false);
  const [year, setYear] = React.useState<number>(initial.year());

  const selectedYM = value ? dayjs(value).format("MMMM YYYY") : "";

  const clampYear = (y:number)=> Math.max(minYear, Math.min(maxYear, y));
  const prevYear = ()=> setYear(y=>clampYear(y-1));
  const nextYear = ()=> setYear(y=>clampYear(y+1));

  function handleSelectMonth(idx:number) {
    const d = dayjs().year(year).month(idx).startOf("month").toDate();
    onChange?.(d);
    setOpen(false);
  }

  const selIdx = value ? dayjs(value).year()===year ? dayjs(value).month() : -1 : -1;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full inline-flex items-center justify-between gap-2 rounded-[var(--radius)]",
            "border border-[color:var(--border)] bg-[color:var(--surface)]",
            "px-3 py-2 text-left text-[color:var(--txt-1)]",
            "focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]",
            "hover:border-[color:var(--primary)]/50 transition-colors",
            className
          )}
          aria-label="Pilih bulan"
        >
          <span className={cn(!value && "text-[color:var(--txt-3)]")}>
            {selectedYM || placeholder}
          </span>
          <CalendarIcon className="h-4 w-4 text-[color:var(--txt-2)]" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "w-[320px] p-3 rounded-[var(--radius)] border border-[color:var(--border)]",
          "bg-[color:var(--surface)] shadow-lg z-[60] select-none"
        )}
        align="start"
      >
        {/* Header Tahun */}
        <div className="mb-2 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevYear} aria-label="Tahun sebelumnya">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium text-[color:var(--txt-1)]">{year}</div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextYear} aria-label="Tahun berikutnya">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Grid Bulan 3x4 */}
        <div
          className={cn(
            "grid grid-cols-4 gap-2",
            "[&::-webkit-scrollbar]:hidden overflow-hidden" // no scrollbar
          )}
        >
          {months.map((m, i) => {
            const isSelected = i === selIdx;
            return (
              <button
                key={m}
                type="button"
                onClick={() => handleSelectMonth(i)}
                className={cn(
                  "h-9 rounded-md text-sm font-medium",
                  "border border-transparent",
                  "bg-[color:var(--bg)]/40 hover:bg-[color:var(--bg)]/60",
                  "text-[color:var(--txt-1)]",
                  "focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]",
                  "transition-colors duration-200",
                  isSelected && "bg-[color:var(--primary)]/15 border-[color:var(--primary)] text-[color:var(--primary)]"
                )}
              >
                {m}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <button
            type="button"
            className="text-[color:var(--txt-3)] hover:text-[color:var(--txt-1)]"
            onClick={() => { onChange?.(new Date(NaN)); setOpen(false); }}
          >
            Clear
          </button>
          <button
            type="button"
            className="text-[color:var(--primary)] hover:underline"
            onClick={() => { onChange?.(dayjs().startOf('month').toDate()); setOpen(false); setYear(dayjs().year()); }}
          >
            Bulan ini
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
