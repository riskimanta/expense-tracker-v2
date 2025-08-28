"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number | null | undefined;         // nilai murni (number)
  onValueChange: (n: number | null) => void;
  prefix?: string;                           // default: tanpa "Rp "
  placeholder?: string;
  className?: string;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

export function CurrencyInput({
  value,
  onValueChange,
  prefix = "",           // kosong → tampil "50.000"; isi "Rp " jika ingin "Rp 50.000"
  placeholder,
  className,
}: Props) {
  const [display, setDisplay] = React.useState<string>("");

  // sinkronisasi dari parent → display
  React.useEffect(() => {
    if (value == null) { setDisplay(""); return; }
    const f = fmt(value);
    setDisplay(prefix ? `${prefix}${f}` : f);
  }, [value, prefix]);

  const toDigits = (s: string) => s.replace(/\D+/g, "");

  const apply = (digits: string) => {
    const n = digits ? parseInt(digits, 10) : null;
    setDisplay(
      n == null ? "" : (prefix ? `${prefix}${fmt(n)}` : fmt(n))
    );
    onValueChange(n);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    apply(toDigits(e.target.value));
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    apply(toDigits(e.clipboardData.getData("text")));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // biar Backspace/Delete bisa mengosongkan input
    if ((e.key === "Backspace" || e.key === "Delete") && display === (prefix || "")) {
      e.preventDefault();
      setDisplay("");
      onValueChange(null);
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={display}
      onChange={onChange}
      onPaste={onPaste}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-[var(--radius)] border border-[color:var(--border)]",
        "bg-[color:var(--surface)] px-3 py-2 text-[color:var(--txt-1)]",
        "focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]",
        "whitespace-nowrap",
        className
      )}
    />
  );
}
