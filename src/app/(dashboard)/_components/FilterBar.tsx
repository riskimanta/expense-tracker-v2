"use client";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type Props = {
  period: Date | null;
  onPeriodChange: (d: Date | null) => void;
  account: string | null;
  onAccountChange: (v: string | null) => void;
  accounts: { id: string; name: string }[];
};

export function FilterBar({ period, onPeriodChange, account, onAccountChange, accounts }: Props) {
  return (
    <div
      className="
        w-full rounded-[var(--radius)]
        border border-[color:var(--border)]
        bg-[color:var(--surface)]
        p-4 md:p-5
      "
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Periode Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--txt-2)]">
            Periode
          </label>
          <MonthYearPicker
            value={period}
            onChange={onPeriodChange}
            placeholder="Pilih bulan dan tahun"
            className="h-11"
          />
        </div>

        {/* Akun Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--txt-2)]">
            Akun
          </label>
          <Select 
            value={account || "all"} 
            onValueChange={(value) => onAccountChange(value === "all" ? null : value)}
          >
            <SelectTrigger className="h-11 border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--txt-1)] focus:ring-2 focus:ring-[color:var(--primary)]">
              <SelectValue placeholder="Pilih akun" />
            </SelectTrigger>
            <SelectContent className="border-[color:var(--border)] bg-[color:var(--surface)]">
              <SelectItem value="all" className="text-[color:var(--txt-1)] hover:bg-[color:var(--bg)]/40">
                Semua akun
              </SelectItem>
              {accounts.map((acc) => (
                <SelectItem 
                  key={acc.id} 
                  value={acc.id}
                  className="text-[color:var(--txt-1)] hover:bg-[color:var(--bg)]/40"
                >
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
