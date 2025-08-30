"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Needs", value: 50, color: "var(--needs)" },
  { name: "Wants", value: 25, color: "var(--wants)" },
  { name: "Savings", value: 15, color: "var(--savings)" },
  { name: "Invest", value: 10, color: "var(--invest)" },
]

export function BudgetMeter() {
  return (
    <div className="flex items-center justify-between">
      <div className="w-[140px] h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={42} // 60% of 70px radius
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-2 text-right">
        <div className="text-sm text-[color:var(--txt-1)]">
          <span className="text-[var(--needs)]">●</span> Needs <span className="text-[color:var(--txt-2)]">50%</span>
        </div>
        <div className="text-sm text-[color:var(--txt-1)]">
          <span className="text-[var(--wants)]">●</span> Wants <span className="text-[color:var(--txt-2)]">25%</span>
        </div>
        <div className="text-sm text-[color:var(--txt-1)]">
          <span className="text-[var(--savings)]">●</span> Savings <span className="text-[color:var(--txt-2)]">15%</span>
        </div>
        <div className="text-sm text-[color:var(--txt-1)]">
          <span className="text-[var(--invest)]">●</span> Invest <span className="text-[color:var(--txt-2)]">10%</span>
        </div>
      </div>
    </div>
  )
}