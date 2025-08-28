"use client"

import * as React from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/cn"

export interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onDismiss: (id: string) => void
}

export function Toast({ id, title, description, variant = "default", onDismiss }: ToastProps) {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-[var(--success)]" />
      case "destructive":
        return <AlertCircle className="w-4 h-4 text-[var(--danger)]" />
      default:
        return <Info className="w-4 h-4 text-[var(--primary)]" />
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "border-[var(--success)]/20 bg-[var(--success)]/10"
      case "destructive":
        return "border-[var(--danger)]/20 bg-[var(--danger)]/10"
      default:
        return "border-[var(--border)] bg-[var(--surface)]"
    }
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out",
        getVariantClasses()
      )}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[var(--txt-high)]">{title}</h4>
          {description && (
            <p className="mt-1 text-sm text-[var(--txt-med)]">{description}</p>
          )}
        </div>
        <button
          onClick={() => onDismiss(id)}
          className="rounded-md p-1 text-[var(--txt-low)] hover:text-[var(--txt-high)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export interface ToastContainerProps {
  toasts: Array<{
    id: string
    title: string
    description?: string
    variant?: "default" | "destructive" | "success"
  }>
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}
