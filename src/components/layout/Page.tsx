import React from 'react'

interface PageProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function Page({ title, subtitle, children }: PageProps) {
  return (
    <main className="page">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-[var(--txt-high)]">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-[var(--txt-med)]">{subtitle}</p>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </main>
  )
}
