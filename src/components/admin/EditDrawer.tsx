"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

interface EditDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  onSave: () => void
  onCancel?: () => void
  saveText?: string
  cancelText?: string
  loading?: boolean
}

export function EditDrawer({
  open,
  onOpenChange,
  title,
  children,
  onSave,
  onCancel,
  saveText = 'Simpan',
  cancelText = 'Batal',
  loading = false
}: EditDrawerProps) {
  if (!open) return null

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[color:var(--bg)]/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto card">
        <div className="flex flex-row items-center justify-between space-y-0 pb-4 p-6 border-b border-[color:var(--border)]">
          <h2 className="text-xl font-semibold text-[color:var(--txt-1)]">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0 hover:bg-[color:var(--surface-2)]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6 space-y-6">
          {children}
          <div className="flex justify-end gap-3 pt-4 border-t border-[color:var(--border)]">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="border-[color:var(--border)] text-[color:var(--txt-1)] hover:bg-[color:var(--surface-2)]"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onSave}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Menyimpan...' : saveText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
