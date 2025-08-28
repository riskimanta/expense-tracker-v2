// src/components/accounts/AccountCard.tsx
import * as React from "react";

type Props = {
  name: string;          // "Cash", "BCA", "OVO", "GoPay"
  type: "Cash" | "Bank" | "E-Wallet";
  balance: number;       // in IDR
  currency?: string;     // default "IDR"
  icon?: React.ReactNode;
  tone?: "green" | "blue" | "orange" | "gray";
};

const fmtIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

const toneRing: Record<NonNullable<Props["tone"]>, string> = {
  green:  "ring-[color:var(--success)]",
  blue:   "ring-[color:var(--primary)]",
  orange: "ring-[color:var(--warning)]",
  gray:   "ring-[color:var(--border)]",
};

export function AccountCard({
  name, type, balance, currency = "IDR", icon, tone = "gray",
}: Props) {
  return (
    <div
      className={[
        "relative rounded-[var(--radius)] ring-1", toneRing[tone],
        "bg-[color:var(--surface)] p-4 md:p-5",
        "hover:shadow-md transition-shadow min-h-[140px]",
        "flex flex-col items-center justify-center text-center gap-2",
      ].join(" ")}
    >
      {/* Badge currency: fixed di pojok, jangan dipakai untuk prefix Rp */}
      <span className="absolute right-3 top-3 z-10 text-[11px] px-2 py-[2px] rounded-full border border-[color:var(--border)] text-[color:var(--txt-2)]">
        {currency}
      </span>

      {/* Icon */}
      {icon ? <div className="text-2xl">{icon}</div> : null}

      {/* Nominal BESAR di tengah: prefix 'Rp' menyatu di sini */}
      <div className="text-xl md:text-2xl font-semibold tracking-tight text-[color:var(--txt-1)]">
        {"Rp "}{fmtIDR(balance)}
      </div>

      {/* Nama & tipe */}
      <div className="text-sm md:text-base text-[color:var(--txt-3)] leading-tight">
        <div className="font-medium text-[color:var(--txt-1)]">{name}</div>
        <div>{type}</div>
      </div>
    </div>
  );
}
