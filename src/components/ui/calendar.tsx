"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <>
      <DayPicker
        showOutsideDays={showOutsideDays}
        locale={idLocale}
        weekStartsOn={1}
        formatters={{
          formatCaption: (month) => format(month, "LLLL yyyy", { locale: idLocale }), // "Agustus 2025"
          formatWeekdayName: (date) => format(date, "EEE", { locale: idLocale }),     // "Sen", "Sel", ...
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        } as Record<string, React.ComponentType<Record<string, never>>>}
        className={cn("rdp p-2", className)}
        classNames={{
          months: "rdp-months",
          month: "rdp-month",
          table: "rdp-table",
          head_row: "rdp-head_row",
          head_cell: "rdp-head_cell",
          row: "rdp-row",
          cell: "rdp-cell",
          day: "rdp-day",
          day_selected: "rdp-day_selected",
          day_today: "rdp-day_today",
          day_outside: "rdp-day_outside",
          day_disabled: "rdp-day_disabled",
          caption: "rdp-caption",
          caption_label: "rdp-caption_label",
          nav: "rdp-nav",
          nav_button: "rdp-button",
          ...classNames,
        }}
        {...props}
      />

      {/* LOCKED CSS — injected once with this component so layout never breaks */}
      <style jsx global>{`
        .rdp {
          --rdp-cell-size: 36px;
          --rdp-radius: var(--radius);
          --rdp-accent: var(--primary);
          --rdp-bg: var(--surface);
          --rdp-border: var(--border);
          --rdp-txt1: var(--txt-1);
          --rdp-txt3: var(--txt-3);
        }
        .rdp-months { display: flex; gap: .75rem; }
        .rdp-month { background: var(--rdp-bg); }
        .rdp-table { width: 100%; border-collapse: collapse; }
        /* Force 7 columns — prevents the "long list" issue */
        .rdp-head_row, .rdp-row { display: grid; grid-template-columns: repeat(7, 1fr); }
        .rdp-head_cell {
          color: var(--rdp-txt3); font-size: 11px; text-transform: uppercase;
          height: 36px; display: grid; place-items: center;
        }
        .rdp-cell { height: 36px; display: grid; place-items: center; }

        /* Days */
        .rdp-day {
          height: var(--rdp-cell-size); width: var(--rdp-cell-size);
          border-radius: 8px; color: var(--rdp-txt1);
        }
        .rdp-day:hover { background: color-mix(in oklab, var(--rdp-bg) 85%, black 0%); }
        .rdp-day_selected { background: var(--rdp-accent); color: white; }
        .rdp-day_today { outline: 1px dashed var(--rdp-border); outline-offset: 1px; }
        .rdp-day_outside, .rdp-day_disabled { color: var(--rdp-txt3); opacity: .6; }

        /* Caption + nav */
        .rdp-caption { display: flex; align-items: center; justify-content: space-between; padding: .25rem .25rem 0; }
        .rdp-caption_label { color: var(--rdp-txt1); font-weight: 600; text-transform: capitalize; }
        .rdp-nav { display: inline-flex; gap: .25rem; }
        .rdp-button {
          height: 28px; width: 28px; border: 1px solid var(--rdp-border);
          border-radius: 8px; background: transparent; color: var(--rdp-txt1);
        }
        .rdp-button:hover { background: color-mix(in oklab, var(--rdp-bg) 80%, black 0%); }
      `}</style>
    </>
  );
}
